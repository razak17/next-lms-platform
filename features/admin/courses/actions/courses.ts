"use server";

import { db } from "@/db/drizzle";
import { CourseInsert, course } from "@/db/schema";
import { getCurrentUser } from "@/server/user";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirects } from "@/lib/constants";

export async function createCourse(data: CourseInsert) {
	try {
		const { currentUser } = await getCurrentUser();
		if (!currentUser) return { error: "Unauthorized" };

		if (!data.userId) data.userId = currentUser.id;

		const [newCourse] = await db.insert(course).values(data).returning();
		if (!newCourse) throw new Error("Failed to create course");

		revalidatePath(redirects.adminToCourses);

		return {
			data: newCourse,
			message: "Course created successfully",
			error: null,
		};
	} catch (error) {
		console.error("Error creating course:", error);
		return { error: "Failed to create course" };
	}
}

export async function updateCourse(
	courseId: string,
	data: Partial<typeof course.$inferInsert>
) {
	try {
		const { currentUser } = await getCurrentUser();
		if (!currentUser)
			return {
				error: true,
				message: "Unauthorized",
			};

		// Ensure user owns the course (add admin check as needed)
		const [existingCourse] = await db
			.select()
			.from(course)
			.where(eq(course.id, courseId));

		if (!existingCourse) {
			return {
				error: true,
				message: "Course not found",
			};
		}

		if (existingCourse.userId !== currentUser.id /* && !currentUser.isAdmin */)
			return {
				error: true,
				message: "Forbidden",
			};

		const [updatedCourse] = await db
			.update(course)
			.set({ ...data, updatedAt: new Date() })
			.where(eq(course.id, courseId))
			.returning();

		if (!updatedCourse) throw new Error("Failed to update course");

		return {
			data: updatedCourse,
			message: "Course updated successfully",
			error: false,
		};
	} catch (error) {
		console.error("Error updating course:", error);
		return { error: "Failed to update course" };
	}
}

export async function deleteCourse(courseId: string) {
	try {
		const { currentUser } = await getCurrentUser();
		if (!currentUser)
			return {
				error: true,
				message: "Unauthorized",
			};

		const [existingCourse] = await db
			.select()
			.from(course)
			.where(eq(course.id, courseId));

		if (!existingCourse) return { error: true, message: "Course not found" };

		if (existingCourse.userId !== currentUser.id /* && !currentUser.isAdmin */)
			return {
				error: true,
				message: "Forbidden",
			};

		const [deletedCourse] = await db
			.delete(course)
			.where(eq(course.id, courseId))
			.returning();

		if (!deletedCourse) throw new Error("Failed to delete course");

		revalidatePath(redirects.adminToCourses);

		return {
			message: "Course deleted successfully",
			error: false,
		};
	} catch (error) {
		console.error("Error deleting course:", error);
		return {
			error: true,
			message: "Failed to delete course",
		};
	}
}
