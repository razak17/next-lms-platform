import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

import { env } from "@/config/server";
import { db } from "@/db/drizzle";
import {
	learnerTrack,
	track as tracksTable,
	user as usersTable,
} from "@/db/schema";
import { createPurchase } from "@/features/shared/actions/purchase";
import { stripe } from "@/lib/stripe";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function GET(request: NextRequest) {
	const stripeSessionId = request.nextUrl.searchParams.get("stripeSessionId");
	if (stripeSessionId == null) redirect("/tracks/purchase-failure");

	let redirectUrl: string;
	try {
		const checkoutSession = await stripe.checkout.sessions.retrieve(
			stripeSessionId,
			{ expand: ["line_items"] }
		);
		const trackId = await processStripeCheckout(checkoutSession);

		redirectUrl = `/tracks/${trackId}/purchase/success`;
	} catch {
		redirectUrl = "/tracks/purchase-failure";
	}

	return NextResponse.redirect(new URL(redirectUrl, request.url));
}

export async function POST(request: Request) {
	const event = await stripe.webhooks.constructEvent(
		await request.text(),
		request.headers.get("stripe-signature") as string,
		env.STRIPE_WEBHOOK_SECRET
	);

	switch (event.type) {
		case "checkout.session.completed":
		case "checkout.session.async_payment_succeeded": {
			try {
				await processStripeCheckout(event.data.object);
			} catch {
				return new Response(null, { status: 500 });
			}
		}
	}
	return new Response(null, { status: 200 });
}

async function processStripeCheckout(checkoutSession: Stripe.Checkout.Session) {
	const userId = checkoutSession.metadata?.userId;
	const trackId = checkoutSession.metadata?.trackId;
	const createdBy = checkoutSession.metadata?.createdBy;

	if (userId == null || trackId == null || createdBy == null) {
		throw new Error("Missing metadata");
	}

	const [track, user] = await Promise.all([getTrack(trackId), getUser(userId)]);

	if (track == null) throw new Error("Track not found");
	if (user == null) throw new Error("User not found");

	// const existingEnrollment = await db.query.learnerTrack.findFirst({
	// 	where: and(
	// 		eq(learnerTrack.userId, userId),
	// 		eq(learnerTrack.trackId, trackId)
	// 	),
	// });
	//
	// if (existingEnrollment) {
	// 	throw new Error("User already enrolled in this track");
	// }

	// Note: Neon HTTP driver doesn't support transactions, so we handle operations sequentially
	// We implement manual rollback logic in case of failures
	let enrollmentResult;
	try {
		enrollmentResult = await enrollInTrack({
			userId: user.id,
			trackId,
			createdBy,
		});

		await createPurchase({
			stripeSessionId: checkoutSession.id,
			pricePaidInCents:
				checkoutSession.amount_total ||
				Math.round(parseFloat(track.price) * 100),
			trackDetails: {
				...track,
				image: track?.image?.url as string,
			},
			userId: user.id,
			trackId,
		});
	} catch (error) {
		// If enrollment succeeded but purchase failed, rollback the enrollment
		if (
			enrollmentResult &&
			Array.isArray(enrollmentResult) &&
			enrollmentResult.length > 0
		) {
			try {
				await db
					.delete(learnerTrack)
					.where(
						and(
							eq(learnerTrack.userId, user.id),
							eq(learnerTrack.trackId, trackId)
						)
					);
			} catch (rollbackError) {
				console.error("Failed to rollback enrollment:", rollbackError);
			}
		}
		console.error("Error processing Stripe checkout:", error);
		throw error;
	}

	return trackId;
}

async function enrollInTrack(data: {
	userId: string;
	trackId: string;
	createdBy: string;
}) {
	const { userId, trackId, createdBy } = data;

	const existingEnrollment = await db.query.learnerTrack.findFirst({
		where: and(
			eq(learnerTrack.userId, userId),
			eq(learnerTrack.trackId, trackId)
		),
	});

	if (existingEnrollment) {
		return {
			success: false,
			message: "You are already enrolled in this track",
		};
	}

	const accesses = await db
		.insert(learnerTrack)
		.values({
			userId,
			trackId,
			createdBy,
		})
		.onConflictDoNothing()
		.returning();

	return accesses;
}

async function getTrack(id: string) {
	return db.query.track.findFirst({
		columns: {
			name: true,
			id: true,
			image: true,
			description: true,
			price: true,
		},
		where: eq(tracksTable.id, id),
	});
}

function getUser(id: string) {
	return db.query.user.findFirst({
		columns: { id: true },
		where: eq(usersTable.id, id),
	});
}
