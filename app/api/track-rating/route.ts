import { db } from "@/db/drizzle";
import { trackRating, track } from "@/db/schema";
import { auth } from "@/lib/auth/auth";
import { eq, and, avg, count } from "drizzle-orm";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { trackId, rating } = await request.json();

		if (!trackId || !rating || rating < 1 || rating > 5) {
			return NextResponse.json(
				{ error: "Invalid track ID or rating" },
				{ status: 400 }
			);
		}

		// Check if user already rated this track
		const existingRating = await db.query.trackRating.findFirst({
			where: and(
				eq(trackRating.userId, session.user.id),
				eq(trackRating.trackId, trackId)
			),
		});

		if (existingRating) {
			// Update existing rating
			await db
				.update(trackRating)
				.set({
					rating,
					updatedAt: new Date(),
				})
				.where(
					and(
						eq(trackRating.userId, session.user.id),
						eq(trackRating.trackId, trackId)
					)
				);
		} else {
			// Create new rating
			await db.insert(trackRating).values({
				userId: session.user.id,
				trackId,
				rating,
			});
		}

		// Calculate new average rating and update track
		const ratings = await db
			.select({
				avgRating: avg(trackRating.rating),
				totalRatings: count(trackRating.rating),
			})
			.from(trackRating)
			.where(eq(trackRating.trackId, trackId));

		const newAvgRating = ratings[0]?.avgRating
			? Math.round(Number(ratings[0].avgRating))
			: 0;

		// Update track's rating field
		await db
			.update(track)
			.set({
				rating: newAvgRating,
				updatedAt: new Date(),
			})
			.where(eq(track.id, trackId));

		return NextResponse.json({
			success: true,
			averageRating: Number(ratings[0]?.avgRating) || 0,
			totalRatings: ratings[0]?.totalRatings || 0,
		});
	} catch (error) {
		console.error("Error handling track rating:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const trackId = searchParams.get("trackId");
		const userId = searchParams.get("userId");

		if (!trackId) {
			return NextResponse.json(
				{ error: "Track ID is required" },
				{ status: 400 }
			);
		}

		// Get track ratings statistics
		const ratings = await db
			.select({
				avgRating: avg(trackRating.rating),
				totalRatings: count(trackRating.rating),
			})
			.from(trackRating)
			.where(eq(trackRating.trackId, trackId));

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

		return NextResponse.json({
			averageRating: Number(ratings[0]?.avgRating) || 0,
			totalRatings: ratings[0]?.totalRatings || 0,
			userRating,
		});
	} catch (error) {
		console.error("Error fetching track ratings:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
