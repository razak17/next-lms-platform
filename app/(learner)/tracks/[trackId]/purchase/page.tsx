import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { redirects } from "@/lib/constants";
import { db } from "@/db/drizzle";
import { track as tracksTable, User } from "@/db/schema";
import { eq } from "drizzle-orm";
import { StripeCheckoutForm } from "@/features/learner/enrollment/components/stripe-checkout-form";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/loading-spinner";

export default async function TrackPurchasePage({
	params,
}: {
	params: Promise<{ trackId: string }>;
}) {
	return (
		<Suspense
			fallback={
				<LoadingSpinner className="mx-auto my-6 size-36 min-h-screen" />
			}
		>
			<SuspendedComponent params={params} />
		</Suspense>
	);
}

async function SuspendedComponent({
	params,
}: {
	params: Promise<{ trackId: string }>;
}) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect(redirects.toLogin);
	}

	const { trackId } = await params;
	const track = await getTrack(trackId);

	if (!track) {
		redirect(redirects.toLanding);
	}

	return (
		<div className="container mx-auto my-12 min-h-screen lg:max-w-6xl">
			<StripeCheckoutForm track={track} user={session.user as User} />
		</div>
	);
}

async function getTrack(id: string) {
	return db.query.track.findFirst({
		columns: {
			name: true,
			id: true,
			image: true,
			description: true,
			price: true,
			userId: true,
		},
		where: eq(tracksTable.id, id),
	});
}
