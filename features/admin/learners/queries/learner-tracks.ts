"use server";

import { db } from "@/db/drizzle";
import { learnerTrack, track, user, purchase } from "@/db/schema";
import { desc, eq, count, sum } from "drizzle-orm";

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

export async function getAllLearnersTracks() {
	try {
		const results = await db
			.select()
			.from(track)
			.leftJoin(learnerTrack, eq(learnerTrack.trackId, track.id))
			.leftJoin(user, eq(learnerTrack.userId, user.id))
			.orderBy(desc(learnerTrack.createdAt));
		return results;
	} catch (error) {
		console.error("Error fetching all learner tracks:", error);
		return { error: "Failed to fetch all learner tracks" };
	}
}

export async function getAllLearnersAggregated() {
	try {
		// Get all learners first
		const learners = await db
			.select()
			.from(user)
			.where(eq(user.role, "learner"))
			.orderBy(desc(user.createdAt));

		// For each learner, get their tracks and purchase data
		const learnersWithData = await Promise.all(
			learners.map(async (learner) => {
				// Get enrolled tracks
				const enrolledTracksQuery = await db
					.select({
						id: track.id,
						name: track.name,
					})
					.from(learnerTrack)
					.leftJoin(track, eq(learnerTrack.trackId, track.id))
					.where(eq(learnerTrack.userId, learner.id));

				// Get purchase data
				const purchaseData = await db
					.select({
						totalPurchases: count(purchase.id),
						totalAmount: sum(purchase.pricePaidInCents),
					})
					.from(purchase)
					.where(eq(purchase.userId, learner.id));

				const purchases = purchaseData[0] || {
					totalPurchases: 0,
					totalAmount: 0,
				};

				return {
					user: learner,
					enrolledTracks: enrolledTracksQuery.filter((t) => t.id && t.name),
					totalPurchases: Number(purchases.totalPurchases) || 0,
					totalPurchaseAmount: Number(purchases.totalAmount) || 0,
				};
			})
		);

		return learnersWithData;
	} catch (error) {
		console.error("Error fetching aggregated learner data:", error);
		return { error: "Failed to fetch aggregated learner data" };
	}
}

export async function getLearnerDetailsById(userId: string) {
	try {
		// Get user details
		const learner = await db
			.select()
			.from(user)
			.where(eq(user.id, userId))
			.limit(1);

		if (learner.length === 0) {
			return { error: "Learner not found" };
		}

		// Get enrolled tracks with enrollment dates
		const enrolledTracks = await db
			.select({
				track: track,
				enrollmentDate: learnerTrack.createdAt,
				trackId: learnerTrack.trackId,
			})
			.from(learnerTrack)
			.leftJoin(track, eq(learnerTrack.trackId, track.id))
			.where(eq(learnerTrack.userId, userId))
			.orderBy(desc(learnerTrack.createdAt));

		// Get purchase history
		const purchases = await db
			.select()
			.from(purchase)
			.leftJoin(track, eq(purchase.trackId, track.id))
			.where(eq(purchase.userId, userId))
			.orderBy(desc(purchase.createdAt));

		// Calculate totals
		const totalPurchaseAmount = purchases.reduce(
			(sum, p) => sum + (p.purchase.pricePaidInCents || 0),
			0
		);

		return {
			user: learner[0],
			enrolledTracks: enrolledTracks.filter((et) => et.track),
			purchases,
			totalPurchases: purchases.length,
			totalPurchaseAmount,
		};
	} catch (error) {
		console.error("Error fetching learner details:", error);
		return { error: "Failed to fetch learner details" };
	}
}
