"use server";

import { db } from "@/db/drizzle";
import { track, course } from "@/db/schema";
import { getCurrentUser } from "@/server/user";
import { eq, desc } from "drizzle-orm";
import { TrackInsert } from "@/db/schema/track";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";

export async function createTrack(data: Omit<TrackInsert, "id">) {
	console.warn("DEBUGPRINT[1088]: tracks.ts:9: data=", data);
	try {
		const { currentUser } = await getCurrentUser();
		if (!currentUser) return { error: "Unauthorized" };

		// Optional: assign userId
		if (!data.userId) data.userId = currentUser.id;

		const [newTrack] = await db.insert(track).values(data).returning();
		if (!newTrack) throw new Error("Failed to create track");

		revalidatePath("/adminn/tracks/");

		return {
			data: newTrack,
			message: "Track created successfully",
			error: null,
		};
	} catch (error) {
		console.error("Error creating track:", error);
		return { error: "Failed to create track" };
	}
}

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

export async function updateTrack(
	trackId: string,
	data: Partial<typeof track.$inferInsert>
) {
	try {
		const { currentUser } = await getCurrentUser();
		if (!currentUser) return { error: "Unauthorized" };

		// Ensure the user owns the track OR is admin (pseudo logic, adjust as needed)
		const [existingTrack] = await db
			.select()
			.from(track)
			.where(eq(track.id, trackId));
		if (!existingTrack) return { error: "Track not found" };
		if (existingTrack.userId !== currentUser.id /* && !currentUser.isAdmin */) {
			return { error: "Forbidden" };
		}

		const [updatedTrack] = await db
			.update(track)
			.set({ ...data, updatedAt: new Date() })
			.where(eq(track.id, trackId))
			.returning();
		if (!updatedTrack) throw new Error("Failed to update track");

		return updatedTrack;
	} catch (error) {
		console.error("Error updating track:", error);
		return { error: "Failed to update track" };
	}
}

export async function deleteTrack(trackId: string) {
	try {
		const { currentUser } = await getCurrentUser();
		if (!currentUser) return { error: "Unauthorized" };

		// Ensure the user owns the track OR is admin (pseudo logic)
		const [existingTrack] = await db
			.select()
			.from(track)
			.where(eq(track.id, trackId));
		if (!existingTrack) return { error: "Track not found" };
		if (existingTrack.userId !== currentUser.id /* && !currentUser.isAdmin */) {
			return { error: "Forbidden" };
		}

		const [deletedTrack] = await db
			.delete(track)
			.where(eq(track.id, trackId))
			.returning();
		if (!deletedTrack) throw new Error("Failed to delete track");

		return deletedTrack;
	} catch (error) {
		console.error("Error deleting track:", error);
		return { error: "Failed to delete track" };
	}
}
