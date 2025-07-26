"use server";

import { db } from "@/db/drizzle";
import { course } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function getCourses(userId: string) {
	try {
		const results = await db
			.select()
			.from(course)
			.where(eq(course.userId, userId))
			.orderBy(desc(course.createdAt));
		return results;
	} catch (error) {
		console.error("Error fetching courses:", error);
		return { error: "Failed to fetch courses" };
	}
}

export async function getCoursesWithTrack(userId: string) {
	try {
		const results = await db.query.course.findMany({
			with: { track: true },
			where: eq(course.userId, userId),
			orderBy: desc(course.createdAt),
		});
		return results;
	} catch (error) {
		console.error("Error fetching courses with track:", error);
		return { error: "Failed to fetch courses with track" };
	}
}

export async function getCourseById(courseId: string) {
	try {
		const [result] = await db
			.select()
			.from(course)
			.where(eq(course.id, courseId));
		if (!result) return { error: "Course not found" };
		return result;
	} catch (error) {
		console.error("Error fetching course:", error);
		return { error: "Failed to fetch course" };
	}
}
