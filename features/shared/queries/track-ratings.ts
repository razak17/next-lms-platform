"use server";

import { db } from "@/db/drizzle";
import { trackRating } from "@/db/schema";
import { eq, and, avg, count } from "drizzle-orm";

export async function getTrackRatings(trackId: string, userId?: string) {
	try {
		// Get average rating and total count
		const ratingsStats = await db
			.select({
				averageRating: avg(trackRating.rating),
				totalRatings: count(trackRating.rating),
			})
			.from(trackRating)
			.where(eq(trackRating.trackId, trackId));

		// Get user's specific rating if userId is provided
		let userRating = null;
		if (userId) {
			const userRatingResult = await db.query.trackRating.findFirst({
				where: and(
					eq(trackRating.userId, userId),
					eq(trackRating.trackId, trackId)
				),
			});
			userRating = userRatingResult?.rating || null;
		}

		return {
			averageRating: Number(ratingsStats[0]?.averageRating) || 0,
			totalRatings: ratingsStats[0]?.totalRatings || 0,
			userRating,
		};
	} catch (error) {
		console.error("Error fetching track ratings:", error);
		return {
			averageRating: 0,
			totalRatings: 0,
			userRating: null,
		};
	}
}

export async function getUserTrackRating(trackId: string, userId: string) {
	try {
		const rating = await db.query.trackRating.findFirst({
			where: and(
				eq(trackRating.userId, userId),
				eq(trackRating.trackId, trackId)
			),
		});

		return rating?.rating || null;
	} catch (error) {
		console.error("Error fetching user track rating:", error);
		return null;
	}
}
