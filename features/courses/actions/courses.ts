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
    if (!currentUser) return { error: "Unauthorized" };

    // Ensure user owns the course (add admin check as needed)
    const [existingCourse] = await db.select().from(course).where(eq(course.id, courseId));
    if (!existingCourse) return { error: "Course not found" };
    if (existingCourse.userId !== currentUser.id /* && !currentUser.isAdmin */)
      return { error: "Forbidden" };

    const [updatedCourse] = await db
      .update(course)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(course.id, courseId))
      .returning();
    if (!updatedCourse) throw new Error("Failed to update course");
    return updatedCourse;
  } catch (error) {
    console.error("Error updating course:", error);
    return { error: "Failed to update course" };
  }
}

export async function deleteCourse(courseId: string) {
  try {
    const { currentUser } = await getCurrentUser();
    if (!currentUser) return { error: "Unauthorized" };

    const [existingCourse] = await db.select().from(course).where(eq(course.id, courseId));
    if (!existingCourse) return { error: "Course not found" };
    if (existingCourse.userId !== currentUser.id /* && !currentUser.isAdmin */)
      return { error: "Forbidden" };

    const [deletedCourse] = await db
      .delete(course)
      .where(eq(course.id, courseId))
      .returning();
    if (!deletedCourse) throw new Error("Failed to delete course");
    return deletedCourse;
  } catch (error) {
    console.error("Error deleting course:", error);
    return { error: "Failed to delete course" };
  }
}
