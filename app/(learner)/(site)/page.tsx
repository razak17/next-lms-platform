import { db } from "@/db/drizzle";
import { track } from "@/db/schema";
import { LandingBanner } from "@/features/learner/landing/components/landing-banner";
import { OverviewTrackCard } from "@/features/shared/components/overview-track-card";
import { LANDING_PAGE_ADMIN_ID } from "@/lib/constants";
import { desc, eq } from "drizzle-orm";

export default async function LandingPage() {
	const tracksWithCourses = await db.query.track.findMany({
		with: { courses: true },
		where: eq(track.userId, LANDING_PAGE_ADMIN_ID),
		limit: 4,
		orderBy: desc(track.createdAt),
	});

	return (
		<div className="flex flex-col">
			<LandingBanner />
			<div className="mx-auto w-full max-w-6xl py-8">
				<h2 className="mt-12 text-center text-3xl font-bold">Our Solutions</h2>
				<p className="mt-4 text-center">
					Create your account quickly with just your email or social media
					login, then explore a wide range
				</p>
				<div className="mt-8 grid grid-cols-1 gap-4 px-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
					{tracksWithCourses.map((track, i) => (
						<OverviewTrackCard
							showDescription={false}
							showInstructor={false}
							track={track}
							key={i}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
