import { CheckoutForm } from "@/features/learner/enrollment/components/checkout-form";
import { db } from "@/db/drizzle";
import { track as tracksTable, User } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { redirects } from "@/lib/constants";

export default async function CheckoutPage({
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

	const track = await db.query.track.findFirst({
		where: eq(tracksTable.id, trackId),
		with: { courses: true },
	});

	if (!track) {
		notFound();
	}

	return (
		<div className="from-background to-muted/20 min-h-screen bg-gradient-to-br">
			<div className="bg-sidebar py-12 text-center text-white">
				<h1 className="text-2xl font-bold md:text-3xl">Checkout</h1>
			</div>
			<CheckoutForm track={track} user={session.user as User} />
		</div>
	);
}
