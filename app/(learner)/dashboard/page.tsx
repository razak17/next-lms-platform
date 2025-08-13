import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { redirects } from "@/lib/constants";
import { db } from "@/db/drizzle";
import { learnerTrack, track, user } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export default async function LearnersDashboardPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect(redirects.adminToLogin);
	}

	const learnerTracks = await db
		.select()
		.from(learnerTrack)
		.leftJoin(track, eq(learnerTrack.trackId, track.id))
		.leftJoin(user, eq(learnerTrack.userId, user.id))
		.where(eq(learnerTrack.userId, session.user.id))
		.orderBy(desc(learnerTrack.createdAt));

	console.warn("DEBUGPRINT[1151]: page.tsx:18: learnerTracks=", learnerTracks);
	return (
		<div className="flex min-h-screen flex-col">
			<div className="bg-sidebar py-12 text-center text-white">
				<h1 className="text-2xl font-bold md:text-3xl">Dashboard</h1>
			</div>
			<div className="mb-12 w-full gap-6 px-4 lg:mx-auto lg:w-6xl">
				<h1>Learners Dashboard</h1>
			</div>
		</div>
	);
}
