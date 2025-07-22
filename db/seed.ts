import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@/db/schema";
import * as dotenv from "dotenv";

dotenv.config({ path: "./.env.local" });

export const db = drizzle({ schema, connection: {
	password: process.env.DB_PASSWORD!,
	user: process.env.DB_USER!,
	database: process.env.DB_NAME!,
	host: process.env.DB_HOST!,
	ssl: false,
} });

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
