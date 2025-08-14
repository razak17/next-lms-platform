"use server";

import { db } from "@/db/drizzle";
import { PurchaseInsert, purchase, learnerTrack, Purchase } from "@/db/schema";
import { getCurrentUser } from "@/features/shared/queries/users";
import { redirects } from "@/lib/constants";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/features/shared/utils/middleware";
import { stripe } from "@/lib/stripe";

async function revokeUserAccess(
	refundedPurchase: Purchase,
	trx: Omit<typeof db, "$client">
) {
	// Remove the user's access to the track by deleting their learner track enrollment
	await trx
		.delete(learnerTrack)
		.where(
			and(
				eq(learnerTrack.userId, refundedPurchase.userId),
				eq(learnerTrack.trackId, refundedPurchase.trackId)
			)
		);
}

export async function refundPurchase(id: string) {
	const { currentUser } = await getCurrentUser();
	if (!currentUser) return { error: "Unauthorized" };

	if (!isAdmin(currentUser.role)) {
		return {
			error: true,
			message: "There was an error refunding this purchase",
		};
	}

	const data = await db.transaction(async (trx) => {
		const refundedPurchase = await updatePurchaseById(
			id,
			{ refundedAt: new Date() },
			trx
		);

		const session = await stripe.checkout.sessions.retrieve(
			refundedPurchase.stripeSessionId
		);

		if (session.payment_intent == null) {
			trx.rollback();
			return {
				error: true,
				message: "There was an error refunding this purchase",
			};
		}

		try {
			await stripe.refunds.create({
				payment_intent:
					typeof session.payment_intent === "string"
						? session.payment_intent
						: session.payment_intent.id,
			});
			await revokeUserAccess(refundedPurchase, trx);
		} catch {
			trx.rollback();
			return {
				error: true,
				message: "There was an error refunding this purchase",
			};
		}
	});

	// Revalidate relevant paths
	revalidatePath(redirects.adminToInvoices);
	revalidatePath(redirects.toDashboard);

	return data ?? { error: false, message: "Successfully refunded purchase" };
}

export async function createPurchase(
	data: PurchaseInsert,
	trx: Omit<typeof db, "$client"> = db
) {
	// const user = await getCurrentUser();
	//
	// if (!user) {
	// 	throw new Error("User not authenticated");
	// }
	//
	// if (isAdmin(user?.currentUser?.role)) {
	// 	throw new Error("Admins cannot create purchases");
	// }

	// const existingPurchase = await trx.query.purchase.findFirst({
	// 	where: eq(purchase.userId, user?.currentUser?.id),
	// });
	//
	// if (existingPurchase) {
	// 	throw new Error("You have already made a purchase");
	// }

	const details = data.trackDetails;

	const newPurchase = await trx
		.insert(purchase)
		.values({
			...data,
			trackDetails: {
				name: details.name,
				description: details.description,
				image: details.image,
			},
		})
		.onConflictDoNothing()
		.returning();

	if (newPurchase !== null) revalidatePath(redirects.toDashboard);

	return newPurchase;
}

export async function updatePurchaseById(
	id: string,
	data: Partial<PurchaseInsert>,
	trx: Omit<typeof db, "$client"> = db
) {
	const user = await getCurrentUser();

	if (!user || !isAdmin(user?.currentUser?.role)) {
		throw new Error("User not authenticated or not an admin");
	}

	const purchaseToUpdate = await db.query.purchase.findFirst({
		where: eq(purchase.id, id),
	});

	if (!purchaseToUpdate) {
		throw new Error("Purchase not found");
	}

	const details = data.trackDetails;

	const updatedPurchase = await trx
		.update(purchase)
		.set({
			...data,
			updatedAt: new Date(),
			trackDetails: details
				? {
						name: details.name,
						description: details.description,
						image: details.image,
					}
				: undefined,
		})
		.where(eq(purchase.id, id))
		.returning();

	revalidatePath(redirects.toDashboard);

	return updatedPurchase[0];
}

export async function deletePurchaseById(id: string) {
	const user = await getCurrentUser();

	if (!user || !isAdmin(user?.currentUser?.role)) {
		throw new Error("User not authenticated or not an admin");
	}

	const purchaseToDelete = await db.query.purchase.findFirst({
		where: eq(purchase.id, id),
	});

	if (!purchaseToDelete) {
		throw new Error("Purchase not found");
	}

	await db.delete(purchase).where(eq(purchase.id, id));

	revalidatePath(redirects.toDashboard);

	return purchaseToDelete;
}
