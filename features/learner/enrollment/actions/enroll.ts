"use server";

import { db } from "@/db/drizzle";
import { learnerTrack, user } from "@/db/schema";
import { EnrollmentFormData } from "../validations/enrollment";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function enrollInTrack(
	data: EnrollmentFormData & { trackId: string }
) {
	try {
		const { firstName, lastName, email, phone, trackId } = data;

		// Check if user already exists
		let existingUser = await db.query.user.findFirst({
			where: eq(user.email, email),
		});

		let userId: string;

		if (existingUser) {
			userId = existingUser.id;

			// Update user information if needed
			await db
				.update(user)
				.set({
					firstName,
					lastName,
					phone,
					updatedAt: new Date(),
				})
				.where(eq(user.id, existingUser.id));
		} else {
			// Create new user
			userId = nanoid();
			await db.insert(user).values({
				id: userId,
				name: `${firstName} ${lastName}`,
				firstName,
				lastName,
				email,
				phone,
				role: "learner",
				emailVerified: false,
			});
		}

		// Check if user is already enrolled in this track
		const existingEnrollment = await db.query.learnerTrack.findFirst({
			where: and(
				eq(learnerTrack.userId, userId),
				eq(learnerTrack.trackId, trackId)
			),
		});

		if (existingEnrollment) {
			return {
				success: false,
				message: "You are already enrolled in this track",
			};
		}

		// Enroll user in track
		await db.insert(learnerTrack).values({
			userId,
			trackId,
			createdBy: userId,
		});

		return {
			success: true,
			message:
				"Successfully enrolled in track! Check your email for further instructions.",
		};
	} catch (error) {
		console.error("Enrollment error:", error);
		return {
			success: false,
			message: "An error occurred during enrollment. Please try again.",
		};
	}
}
