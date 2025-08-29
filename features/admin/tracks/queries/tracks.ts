"use server";

import { db } from "@/db/drizzle";
import { track } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function getTracks() {
	try {
		const results = await db
			.select()
			.from(track)
			.orderBy(desc(track.createdAt));
		return results;
	} catch (error) {
		console.error("Error fetching tracks:", error);
		return { error: "Failed to fetch tracks" };
	}
}

export async function getTracksWithCourses() {
	try {
		const results = await db.query.track.findMany({
			with: { courses: true },
			orderBy: desc(track.createdAt),
		});
		return results;
	} catch (error) {
		console.error("Error fetching tracks with courses:", error);
		return { error: "Failed to fetch tracks with courses" };
	}
}

export async function getTrackById(trackId: string) {
	try {
		const result = await db.query.track.findFirst({
			where: eq(track.id, trackId),
			with: { courses: true },
		});
		return result;
	} catch (error) {
		console.error("Error fetching track:", error);
		return { error: "Failed to fetch track" };
	}
}
