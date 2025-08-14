"use server";

import { db } from "@/db/drizzle";
import { user, track, course, learnerTrack, purchase } from "@/db/schema";
import {
	count,
	sum,
	desc,
	asc,
	eq,
	gte,
	lt,
	and,
	sql,
	countDistinct,
	avg,
} from "drizzle-orm";

export async function getReportsOverview() {
	try {
		const [
			totalUsers,
			totalTracks,
			totalCourses,
			totalEnrollments,
			totalRevenue,
			avgTrackRating,
		] = await Promise.all([
			db.select({ count: countDistinct(learnerTrack.userId) }).from(learnerTrack),
			db.select({ count: count() }).from(track),
			db.select({ count: count() }).from(course),
			db.select({ count: count() }).from(learnerTrack),
			db.select({ total: sum(purchase.pricePaidInCents) }).from(purchase),
			db.select({ avg: avg(track.rating) }).from(track),
		]);

		return {
			totalUsers: totalUsers[0]?.count || 0,
			totalTracks: totalTracks[0]?.count || 0,
			totalCourses: totalCourses[0]?.count || 0,
			totalEnrollments: totalEnrollments[0]?.count || 0,
			totalRevenue: totalRevenue[0]?.total
				? Number(totalRevenue[0].total) / 100
				: 0,
			avgTrackRating: avgTrackRating[0]?.avg
				? Number(avgTrackRating[0].avg)
				: 0,
		};
	} catch (error) {
		console.error("Error fetching reports overview:", error);
		return {
			totalUsers: 0,
			totalTracks: 0,
			totalCourses: 0,
			totalEnrollments: 0,
			totalRevenue: 0,
			avgTrackRating: 0,
		};
	}
}

export async function getUserGrowthData() {
	try {
		const sixMonthsAgo = new Date();
		sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

		const result = await db
			.select({
				month: sql<string>`to_char(${user.createdAt}, 'YYYY-MM')`,
				users: count(),
			})
			.from(user)
			.where(and(eq(user.role, "learner"), gte(user.createdAt, sixMonthsAgo)))
			.groupBy(sql`to_char(${user.createdAt}, 'YYYY-MM')`)
			.orderBy(asc(sql`to_char(${user.createdAt}, 'YYYY-MM')`));

		return result;
	} catch (error) {
		console.error("Error fetching user growth data:", error);
		return [];
	}
}

export async function getRevenueData() {
	try {
		const sixMonthsAgo = new Date();
		sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

		const result = await db
			.select({
				month: sql<string>`to_char(${purchase.createdAt}, 'YYYY-MM')`,
				revenue: sum(purchase.pricePaidInCents),
				purchases: count(),
			})
			.from(purchase)
			.where(gte(purchase.createdAt, sixMonthsAgo))
			.groupBy(sql`to_char(${purchase.createdAt}, 'YYYY-MM')`)
			.orderBy(asc(sql`to_char(${purchase.createdAt}, 'YYYY-MM')`));

		return result.map((item) => ({
			month: item.month,
			revenue: item.revenue ? Number(item.revenue) / 100 : 0,
			purchases: item.purchases,
		}));
	} catch (error) {
		console.error("Error fetching revenue data:", error);
		return [];
	}
}

export async function getTopTracks() {
	try {
		const result = await db
			.select({
				id: track.id,
				name: track.name,
				price: track.price,
				rating: track.rating,
				enrollments: count(learnerTrack.userId),
				revenue: sum(purchase.pricePaidInCents),
				instructor: track.instructor,
			})
			.from(track)
			.leftJoin(learnerTrack, eq(track.id, learnerTrack.trackId))
			.leftJoin(purchase, eq(track.id, purchase.trackId))
			.groupBy(track.id)
			.orderBy(desc(count(learnerTrack.userId)))
			.limit(10);

		return result.map((item) => ({
			...item,
			revenue: item.revenue ? Number(item.revenue) / 100 : 0,
			price: Number(item.price),
		}));
	} catch (error) {
		console.error("Error fetching top tracks:", error);
		return [];
	}
}

export async function getRecentEnrollments() {
	try {
		const result = await db
			.select({
				id: learnerTrack.userId,
				userName: user.name,
				userEmail: user.email,
				trackName: track.name,
				trackPrice: track.price,
				enrolledAt: learnerTrack.createdAt,
			})
			.from(learnerTrack)
			.innerJoin(user, eq(learnerTrack.userId, user.id))
			.innerJoin(track, eq(learnerTrack.trackId, track.id))
			.orderBy(desc(learnerTrack.createdAt))
			.limit(20);

		return result.map((item) => ({
			...item,
			trackPrice: Number(item.trackPrice),
		}));
	} catch (error) {
		console.error("Error fetching recent enrollments:", error);
		return [];
	}
}

export async function getUserDemographics() {
	try {
		const [genderStats, locationStats] = await Promise.all([
			db
				.select({
					gender: user.gender,
					count: count(),
				})
				.from(user)
				.where(eq(user.role, "learner"))
				.groupBy(user.gender),

			db
				.select({
					location: user.location,
					count: count(),
				})
				.from(user)
				.where(and(eq(user.role, "learner"), sql`${user.location} IS NOT NULL`))
				.groupBy(user.location)
				.orderBy(desc(count()))
				.limit(10),
		]);

		return {
			genderStats,
			locationStats,
		};
	} catch (error) {
		console.error("Error fetching user demographics:", error);
		return {
			genderStats: [],
			locationStats: [],
		};
	}
}

export async function getPurchaseAnalytics() {
	try {
		const [purchaseStats, recentPurchases] = await Promise.all([
			db
				.select({
					status: sql<string>`
						CASE 
							WHEN ${purchase.refundedAt} IS NOT NULL THEN 'refunded'
							ELSE 'completed'
						END
					`,
					count: count(),
					totalAmount: sum(purchase.pricePaidInCents),
				})
				.from(purchase).groupBy(sql`
					CASE 
						WHEN ${purchase.refundedAt} IS NOT NULL THEN 'refunded'
						ELSE 'completed'
					END
				`),

			db
				.select({
					id: purchase.id,
					amount: purchase.pricePaidInCents,
					status: sql<string>`
						CASE 
							WHEN ${purchase.refundedAt} IS NOT NULL THEN 'refunded'
							ELSE 'completed'
						END
					`,
					trackName: sql<string>`${purchase.trackDetails}->>'name'`,
					learnerName: user.name,
					learnerEmail: user.email,
					createdAt: purchase.createdAt,
					refundedAt: purchase.refundedAt,
				})
				.from(purchase)
				.innerJoin(user, eq(purchase.userId, user.id))
				.orderBy(desc(purchase.createdAt))
				.limit(15),
		]);

		return {
			purchaseStats: purchaseStats.map((item) => ({
				...item,
				totalAmount: item.totalAmount ? Number(item.totalAmount) : 0,
			})),
			recentPurchases: recentPurchases.map((item) => ({
				...item,
				amount: Number(item.amount),
			})),
		};
	} catch (error) {
		console.error("Error fetching purchase analytics:", error);
		return {
			purchaseStats: [],
			recentPurchases: [],
		};
	}
}

export async function getCourseAnalytics() {
	try {
		const result = await db
			.select({
				trackName: track.name,
				courseCount: count(course.id),
				totalEnrollments: countDistinct(learnerTrack.userId),
			})
			.from(track)
			.leftJoin(course, eq(track.id, course.trackId))
			.leftJoin(learnerTrack, eq(track.id, learnerTrack.trackId))
			.groupBy(track.id, track.name)
			.orderBy(desc(count(course.id)));

		return result;
	} catch (error) {
		console.error("Error fetching course analytics:", error);
		return [];
	}
}
