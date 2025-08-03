"use server";

import { db } from "@/db/drizzle";
import { learnerTrack, track, user } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function getLearnerTracks(userId: string) {
	try {
		const results = await db
			.select()
			.from(learnerTrack)
			.where(eq(learnerTrack.userId, userId))
			.orderBy(desc(learnerTrack.createdAt));
		return results;
	} catch (error) {
		console.error("Error fetching learner Tracks:", error);
		return { error: "Failed to fetch learner Tracks" };
	}
}

export async function getAllLearnersTracks(userId: string) {
	try {
		const results = await db
			.select()
			.from(track)
			.leftJoin(learnerTrack, eq(learnerTrack.trackId, track.id))
			.leftJoin(user, eq(learnerTrack.userId, user.id))
			.where(eq(learnerTrack.createdBy, userId))
			.orderBy(desc(learnerTrack.createdAt));
		return results;
	} catch (error) {
		console.error("Error fetching all learner tracks:", error);
		return { error: "Failed to fetch all learner tracks" };
	}
}
