"use client";

import {
	EmbeddedCheckoutProvider,
	EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { getClientSessionSecret } from "@/features/shared/actions/stripe";
import { StoredFile } from "@/types";
import { getStripe } from "@/lib/get-stripe";
import { User } from "@/db/schema";

export function StripeCheckoutForm({
	track,
	user,
}: {
	track: {
		price: string;
		name: string;
		image: StoredFile | null;
		description: string;
		id: string;
		userId: string;
	};
	user: User;
}) {
	const stripePromise = getStripe();
	return (
		<EmbeddedCheckoutProvider
			stripe={stripePromise}
			options={{
				fetchClientSecret: getClientSessionSecret.bind(null, track, user),
			}}
		>
			<EmbeddedCheckout />
		</EmbeddedCheckoutProvider>
	);
}
