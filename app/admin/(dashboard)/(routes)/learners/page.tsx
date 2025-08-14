import {
	desc,
	eq,
	count,
	sum,
	countDistinct,
	gte,
	lt,
	and,
	sql,
} from "drizzle-orm";
import { db } from "@/db/drizzle";
import { Heading } from "@/components/ui/heading";
import { LearnersTable } from "@/features/admin/learners/components/learners-table";
import { getAllLearnersTracks } from "@/features/admin/learners/queries/learner-tracks";
import { auth } from "@/lib/auth/auth";
import { redirects } from "@/lib/constants";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { track, user, purchase, learnerTrack } from "@/db/schema";

export default async function LearnersPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect(redirects.adminToLogin);
	}

	const learners = await getAllLearners(session.user.id);

	return (
		<div className="@container/main flex flex-1 flex-col gap-2">
			<div className="mt-4 flex items-center justify-between px-4 lg:px-6">
				<Heading
					title="Manage Learners"
					description="Filter, sort and access detailed learners"
				/>
			</div>
			<div className="flex flex-col px-6 pt-6">
				<LearnersTable data={learners} />
			</div>
		</div>
	);
}

async function getAllLearners(userId: string) {
  const results = await db
    .select()
    .from(learnerTrack)
    .leftJoin(track, eq(learnerTrack.trackId, track.id))
    .leftJoin(user, eq(learnerTrack.userId, user.id))
    .where(eq(learnerTrack.createdBy, userId))
    .orderBy(desc(learnerTrack.createdAt));

  return results;
}

