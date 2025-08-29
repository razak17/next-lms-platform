import Stripe from "stripe";
import { PurchaseReceipt } from "@/features/learner/purchases/components/purchase-receipt";
import { getPurchaseById } from "@/features/learner/purchases/queries/purchases";
import { auth } from "@/lib/auth/auth";
import { redirects } from "@/lib/constants";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

export default async function PurchaseReceiptPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect(redirects.toLogin);
	}

	const { id } = await params;

	const purchase = await getPurchaseById(id);

	if (!purchase || "error" in purchase) {
		notFound();
	}

	if (purchase.userId !== session.user.id) {
		notFound();
	}

	const { payment_intent } = await stripe.checkout.sessions.retrieve(
		purchase.stripeSessionId,
		{
			expand: [
				"payment_intent.latest_charge",
				"total_details.breakdown.discounts",
			],
		}
	);

	return (
		<PurchaseReceipt
			purchase={purchase}
			receiptUrl={getReceiptUrl(payment_intent)}
		/>
	);
}

function getReceiptUrl(paymentIntent: Stripe.PaymentIntent | string | null) {
	if (
		typeof paymentIntent === "string" ||
		typeof paymentIntent?.latest_charge === "string"
	) {
		return;
	}

	return paymentIntent?.latest_charge?.receipt_url;
}
