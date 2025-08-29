import { env } from "@/config/server";
import { db } from "@/db/drizzle";
import { track } from "@/db/schema";
import { Banner } from "@/features/learner/landing/components/banner";
import { MainContent } from "@/features/learner/landing/components/main-content";
import { auth } from "@/lib/auth/auth";
import { desc, eq } from "drizzle-orm";
import { headers } from "next/headers";

export default async function LandingPage() {
	const tracksWithCourses = await db.query.track.findMany({
		with: { courses: true },
		limit: 4,
		orderBy: desc(track.createdAt),
	});

	const session = await auth.api.getSession({
		headers: await headers(),
	});

	return (
		<div className="flex flex-col lg:min-h-screen">
			<Banner userId={session?.user?.id} />
			<MainContent
				tracksWithCourses={tracksWithCourses}
				userId={session?.user?.id}
			/>
		</div>
	);
}
