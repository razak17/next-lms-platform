import { db } from "@/db/drizzle";
import { track } from "@/db/schema";
import { Banner } from "@/features/learner/landing/components/banner";
import { MainContent } from "@/features/learner/landing/components/main-content";
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
			<Banner />
			<MainContent tracksWithCourses={tracksWithCourses} />
		</div>
	);
}
