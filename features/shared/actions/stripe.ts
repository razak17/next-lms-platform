"use server";

import { env } from "@/config/client";
import { User } from "@/db/schema";
import { stripe } from "@/lib/stripe";
import { StoredFile } from "@/types";

export async function getClientSessionSecret(
	track: {
		price: string;
		name: string;
		image: StoredFile | null;
		description: string;
		id: string;
		userId: string;
	},
	user: User
) {
	const session = await stripe.checkout.sessions.create({
		line_items: [
			{
				quantity: 1,
				price_data: {
					currency: "usd",
					product_data: {
						name: track.name,
						images: track.image
							? [new URL(track.image.url, env.NEXT_PUBLIC_SERVER_URL).href]
							: [],
						description: track.description,
					},
					unit_amount: Math.round(parseFloat(track.price) * 100), // Convert to cents
				},
			},
		],
		ui_mode: "embedded",
		mode: "payment",
		return_url: `${env.NEXT_PUBLIC_SERVER_URL}/api/webhooks/stripe?stripeSessionId={CHECKOUT_SESSION_ID}`,
		customer_email: user.email,
		payment_intent_data: {
			receipt_email: user.email,
		},
		metadata: {
			trackId: track.id,
			userId: user.id,
			createdBy: track.userId,
		},
	});

	if (session.client_secret == null) throw new Error("Client secret is null");

	return session.client_secret;
}
