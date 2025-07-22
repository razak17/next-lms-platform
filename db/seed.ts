import * as schema from "@/db/schema";
import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle } from "drizzle-orm/node-postgres";

dotenv.config({ path: "./.env.local" });

const sql = neon(process.env.DATABASE_URL!);

export const db =
	process.env.ENV === "development"
		? drizzle({
				schema,
				connection: {
					password: process.env.DB_PASSWORD!,
					user: process.env.DB_USER!,
					database: process.env.DB_NAME!,
					host: process.env.DB_HOST!,
					ssl: false,
				},
			})
		: drizzleNeon(sql, { schema });

async function seed() {
	console.log("🌱 Starting database seed...");
	try {
		await db.delete(schema.user);
		console.log("🧹 Cleared existing data");

		console.log("🎉 Database seeding completed successfully!");
	} catch (error) {
		console.error("❌ Error seeding database:", error);
		process.exit(1);
	}
}

// Run the seed function
seed()
	.then(() => {
		console.log("✅ Seeding process completed");
		process.exit(0);
	})
	.catch((error) => {
		console.error("❌ Seeding process failed:", error);
		process.exit(1);
	});
