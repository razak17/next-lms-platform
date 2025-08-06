"use server";

import { db } from "@/db/drizzle";
import { user, User } from "@/db/schema";
import { getCurrentUser } from "@/features/admin/users/queries/users";
import { auth } from "@/lib/auth/auth";
import { getErrorMessage } from "@/lib/handle-error";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

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

export async function changePassword(
	currentPassword: string,
	newPassword: string
): Promise<{ success: boolean; message: string }> {
	try {
		const { currentUser } = await getCurrentUser();

		if (!currentUser) {
			return { success: false, message: "Unauthorized" };
		}

		await auth.api.changePassword({
			body: {
				currentPassword,
				newPassword,
				revokeOtherSessions: true, // Optionally revoke other sessions
			},
			headers: await headers(),
		});

		return { success: true, message: "Password changed successfully" };
	} catch (error) {
		console.error("Error changing password:", error);
		return {
			success: false,
			message: getErrorMessage(error) || "Failed to change password",
		};
	}
}
