import { db } from "./drizzle";
import { user } from "./schema/user";

async function seed() {
	console.log("🌱 Starting database seed...");
	try {
		// Clear existing data (optional - comment out if you want to preserve existing data)
		await db.delete(user);
		console.log("🧹 Cleared existing data");

		// Insert sample users
		const users = await db
			.insert(user)
			.values([
				{
					id: "user_1",
					name: "John Doe",
					firstName: "John",
					lastName: "Doe",
					email: "john@example.com",
					emailVerified: true,
					image:
						"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
					createdAt: new Date("2024-01-15"),
					updatedAt: new Date("2024-01-15"),
					role: "admin",
				},
			])
			.returning();

		console.log(`✅ Created ${users.length} users`);

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
