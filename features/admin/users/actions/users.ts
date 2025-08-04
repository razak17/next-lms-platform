"use server";

import { db } from "@/db/drizzle";
import { user, User } from "@/db/schema";
import { getCurrentUser } from "@/features/admin/users/queries/users";
import { eq } from "drizzle-orm";

export async function updateUser(
	userId: string,
	data: Pick<
		User,
		| "firstName"
		| "lastName"
		| "email"
		| "gender"
		| "bio"
		| "phone"
		| "location"
		| "image"
	>
): Promise<User | { error: string }> {
	try {
		const { currentUser } = await getCurrentUser();

		if (!currentUser) return { error: "Unauthorized" };

		if (currentUser.id !== userId) {
			return { error: "You do not have permission to update this user" };
		}

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
				image: data.image,
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
