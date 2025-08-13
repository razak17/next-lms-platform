"use server";

import { db } from "@/db/drizzle";
import { PurchaseInsert, purchase } from "@/db/schema";
import { getCurrentUser } from "@/features/shared/queries/users";
import { redirects } from "@/lib/constants";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/features/shared/utils/middleware";

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

	return updatedPurchase;
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
