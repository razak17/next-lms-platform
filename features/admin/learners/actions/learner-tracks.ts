"use server";

import { db } from "@/db/drizzle";
import { learnerTrack, LearnerTrackInsert } from "@/db/schema";
import { getCurrentUser } from "@/features/shared/queries/users";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirects } from "@/lib/constants";

export async function addLearnerTrack(data: LearnerTrackInsert): Promise<void> {
	const user = await getCurrentUser();

	if (!user) {
		throw new Error("User not found");
	}

	const [newTrack] = await db
		.insert(learnerTrack)
		.values({
			...data,
		})
		.returning();

	revalidatePath(redirects.adminToTracks);

	return newTrack;
}
