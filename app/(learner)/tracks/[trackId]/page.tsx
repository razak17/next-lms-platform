import { db } from "@/db/drizzle";
import { track as tracksTable, User } from "@/db/schema";
import { TrackDetails } from "@/features/shared/components/track-details";
import { auth } from "@/lib/auth/auth";
import { redirects } from "@/lib/constants";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { getTrackRatings } from "@/features/shared/queries/track-ratings";

export default async function TracksDetailsPage({
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

	if (track == null) return notFound();

	// Get track ratings data
	const ratingsData = await getTrackRatings(trackId, session.user.id);

	return (
		<div className="flex min-h-screen flex-col">
			<div className="bg-sidebar mb-12 py-12 text-center text-white">
				<h1 className="text-2xl font-bold md:text-3xl">Track Details</h1>
			</div>
			<TrackDetails
				track={track}
				user={session.user as User}
				ratingsData={ratingsData}
			/>
		</div>
	);
}
