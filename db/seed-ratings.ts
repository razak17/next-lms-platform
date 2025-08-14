import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { trackRating, track, user } from "./schema";
import { eq, avg, count } from "drizzle-orm";

// Create a direct database connection for seeding
const connectionString =
	process.env.DATABASE_URL ||
	"postgresql://postgres:password@localhost:5432/learning_platform";
const sql = postgres(connectionString);
const db = drizzle({ client: sql, schema: { trackRating, track, user } });

async function seedTrackRatings() {
	console.log("🌱 Seeding track ratings...");

	try {
		// Get all tracks
		const tracks = await db.query.track.findMany({
			columns: { id: true },
		});

		// Get some users (assuming there are users already)
		const users = await db.query.user.findMany({
			columns: { id: true },
			limit: 5,
		});

		if (tracks.length === 0) {
			console.log("No tracks found. Skipping rating seeding.");
			return;
		}

		if (users.length === 0) {
			console.log("No users found. Skipping rating seeding.");
			return;
		}

		const ratingsToInsert = [];

		for (const trackItem of tracks) {
			// Generate 2-5 random ratings per track
			const numRatings = Math.floor(Math.random() * 4) + 2; // 2-5 ratings
			const selectedUsers = users
				.sort(() => 0.5 - Math.random())
				.slice(0, Math.min(numRatings, users.length));

			for (const user of selectedUsers) {
				// Generate rating between 3-5 (mostly positive)
				const rating = Math.floor(Math.random() * 3) + 3; // 3, 4, or 5 stars

				ratingsToInsert.push({
					trackId: trackItem.id,
					userId: user.id,
					rating,
				});
			}
		}

		// Insert all ratings
		if (ratingsToInsert.length > 0) {
			await db
				.insert(trackRating)
				.values(ratingsToInsert)
				.onConflictDoNothing();
		}

		// Update track rating averages
		for (const trackItem of tracks) {
			const ratingsStats = await db
				.select({
					avgRating: avg(trackRating.rating),
					totalRatings: count(trackRating.rating),
				})
				.from(trackRating)
				.where(eq(trackRating.trackId, trackItem.id));

			if (ratingsStats.length > 0) {
				const avgRating = Math.round(Number(ratingsStats[0].avgRating) || 0);
				await db
					.update(track)
					.set({ rating: avgRating })
					.where(eq(track.id, trackItem.id));
			}
		}

		console.log(
			`✅ Seeded ${ratingsToInsert.length} track ratings successfully!`
		);
	} catch (error) {
		console.error("❌ Error seeding track ratings:", error);
		throw error;
	} finally {
		await sql.end();
	}
}

// Run if called directly
if (require.main === module) {
	seedTrackRatings()
		.then(() => {
			console.log("✅ Seeding completed!");
			process.exit(0);
		})
		.catch((error) => {
			console.error("❌ Seeding failed:", error);
			process.exit(1);
		});
}

export { seedTrackRatings };
