import { env } from "@/config/client";
import { loadStripe, type Stripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null>;
export function getStripe(stripeAccountId?: string) {
	if (!stripePromise) {
		stripePromise = loadStripe(
			env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
			stripeAccountId ? { stripeAccount: stripeAccountId } : undefined
		);
	}
	return stripePromise;
}
