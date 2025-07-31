"use server";

import { db } from "@/db/drizzle";
import { TrackInsert, track } from "@/db/schema";
import { getCurrentUser } from "@/features/admin/users/queries/users";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirects } from "@/lib/constants";

export async function createTrack(data: Omit<TrackInsert, "id">) {
	try {
		const { currentUser } = await getCurrentUser();
		if (!currentUser) return { error: "Unauthorized" };

		// Optional: assign userId
		if (!data.userId) data.userId = currentUser.id;

		const [newTrack] = await db.insert(track).values(data).returning();
		if (!newTrack) throw new Error("Failed to create track");

		revalidatePath(redirects.adminToTracks);

		return {
			data: newTrack,
			message: "Track created successfully",
			error: false,
		};
	} catch (error) {
		console.error("Error creating track:", error);
		return { error: "Failed to create track" };
	}
}

export async function updateTrack(
	trackId: string,
	data: Partial<typeof track.$inferInsert>
) {
	try {
		const { currentUser } = await getCurrentUser();
		if (!currentUser)
			return {
				error: true,
				message: "Unauthorized",
			};

		// Ensure the user owns the track OR is admin (pseudo logic, adjust as needed)
		const [existingTrack] = await db
			.select()
			.from(track)
			.where(eq(track.id, trackId));

		if (!existingTrack)
			return {
				error: true,
				message: "Track not found",
			};

		if (existingTrack.userId !== currentUser.id /* && !currentUser.isAdmin */) {
			return {
				error: true,
				message: "Forbidden",
			};
		}

		const [updatedTrack] = await db
			.update(track)
			.set({ ...data, updatedAt: new Date() })
			.where(eq(track.id, trackId))
			.returning();

		if (!updatedTrack) throw new Error("Failed to update track");

		return {
			data: updatedTrack,
			message: "Track updated successfully",
			error: false,
		};
	} catch (error) {
		console.error("Error updating track:", error);
		return { error: "Failed to update track" };
	}
}

export async function deleteTrack(trackId: string) {
	try {
		const { currentUser } = await getCurrentUser();
		if (!currentUser)
			return {
				error: true,
				message: "Unauthorized",
			};

		const [existingTrack] = await db
			.select()
			.from(track)
			.where(eq(track.id, trackId));

		if (!existingTrack)
			return {
				error: true,
				message: "Track not found",
			};

		if (existingTrack.userId !== currentUser.id /* && !currentUser.isAdmin */) {
			return {
				error: true,
				message: "Forbidden",
			};
		}

		const [deletedTrack] = await db
			.delete(track)
			.where(eq(track.id, trackId))
			.returning();

		if (!deletedTrack) throw new Error("Failed to delete track");

		revalidatePath(redirects.adminToTracks);

		return {
			error: false,
			message: "Track deleted successfully",
		};
	} catch (error) {
		console.error("Error deleting track:", error);
		return {
			error: true,
			message: "Failed to delete track",
		};
	}
}
