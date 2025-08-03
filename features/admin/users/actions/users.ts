"use server";

import { db } from "@/db/drizzle";
import { user, User } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function updateUser(
	userId: string,
	data: Pick<
		User,
		"firstName" | "lastName" | "email" | "gender" | "bio" | "phone" | "location"
	>
): Promise<User | { error: string }> {
	try {
		const [updatedUser] = await db
			.update(user)
			.set({
        name: `${data.firstName} ${data.lastName}`,
				firstName: data.firstName,
				lastName: data.lastName,
				gender: data.gender,
				bio: data.bio,
				phone: data.phone,
				location: data.location,
			})
			.where(eq(user.id, userId))
			.returning();
		if (!updatedUser) {
			return { error: "User not found" };
		}
		return updatedUser;
	} catch (error) {
		console.error("Error updating user profile:", error);
		return { error: "Failed to update user profile" };
	}
}
