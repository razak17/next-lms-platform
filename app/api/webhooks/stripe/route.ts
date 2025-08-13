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
	console.warn("DEBUGPRINT[1148]: route.ts:59: userId=", userId);
	const trackId = checkoutSession.metadata?.trackId;
	console.warn("DEBUGPRINT[1149]: route.ts:61: trackId=", trackId);
	const createdBy = checkoutSession.metadata?.createdBy;
	console.warn("DEBUGPRINT[1150]: route.ts:63: createdBy=", createdBy);

	if (userId == null || trackId == null || createdBy == null) {
		throw new Error("Missing metadata");
	}

	const [track, user] = await Promise.all([
		getTrack(trackId),
		await getUser(userId),
	]);

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

	db.transaction(async (trx) => {
		try {
			await enrollInTrack({ userId: user.id, trackId, createdBy }, trx);
			await createPurchase(
				{
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
				},
				trx
			);
		} catch (error) {
			trx.rollback();
			throw error;
		}
	});

	return trackId;
}

async function enrollInTrack(
	data: { userId: string; trackId: string; createdBy: string },
	trx: Omit<typeof db, "$client"> = db
) {
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

	const accesses = await trx
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
