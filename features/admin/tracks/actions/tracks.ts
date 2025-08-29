"use server";

import { db } from "@/db/drizzle";
import { TrackInsert, track, course } from "@/db/schema";
import { getCurrentUser } from "@/features/shared/queries/users";
import { redirects } from "@/lib/constants";
import { eq, count } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/features/shared/utils/middleware";

export async function createTrack(
	data: Omit<TrackInsert, "userId"> & { userId?: string }
) {
	try {
		const { currentUser } = await getCurrentUser();
		if (!currentUser) return { error: "Unauthorized" };

		if (!isAdmin(currentUser.role)) {
			return {
				error: true,
				message: "You do not have permission to create a track",
			};
		}

		const trackData: TrackInsert = {
			...data,
			userId: data.userId || currentUser.id,
		};

		const [newTrack] = await db.insert(track).values(trackData).returning();
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
	data: Partial<Omit<typeof track.$inferInsert, "userId">>
) {
	try {
		const { currentUser } = await getCurrentUser();
		if (!currentUser) {
			return {
				error: true,
				message: "Unauthorized",
			};
		}

		if (!isAdmin(currentUser.role)) {
			return {
				error: true,
				message: "You do not have permission to update this track",
			};
		}

		const [existingTrack] = await db
			.select()
			.from(track)
			.where(eq(track.id, trackId));

		if (!existingTrack)
			return {
				error: true,
				message: "Track not found",
			};

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
		if (!currentUser) {
			return {
				error: true,
				message: "Unauthorized",
			};
		}

		if (!isAdmin(currentUser.role)) {
			return {
				error: true,
				message: "You do not have permission to delete this track",
			};
		}

		const [existingTrack] = await db
			.select()
			.from(track)
			.where(eq(track.id, trackId));

		if (!existingTrack)
			return {
				error: true,
				message: "Track not found",
			};

		// Check if track has any courses
		const [courseCount] = await db
			.select({ count: count() })
			.from(course)
			.where(eq(course.trackId, trackId));

		if (courseCount.count > 0) {
			return {
				error: true,
				message: `Cannot delete track. This track has ${courseCount.count} course${courseCount.count > 1 ? "s" : ""} associated with it. Please delete all courses first.`,
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
