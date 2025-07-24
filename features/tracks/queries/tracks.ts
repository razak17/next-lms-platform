"use server";

import { db } from "@/db/drizzle";
import { track } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function getTracks(userId: string) {
	try {
		const results = await db
			.select()
			.from(track)
			.where(eq(track.userId, userId))
			.orderBy(desc(track.createdAt));
		return results;
	} catch (error) {
		console.error("Error fetching tracks:", error);
		return { error: "Failed to fetch tracks" };
	}
}

export async function getTrackById(trackId: string) {
	try {
		const [result] = await db.select().from(track).where(eq(track.id, trackId));
		if (!result) return { error: "Track not found" };
		return result;
	} catch (error) {
		console.error("Error fetching track:", error);
		return { error: "Failed to fetch track" };
	}
}
