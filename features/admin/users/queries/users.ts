"use server";

import { db } from "@/db/drizzle";
import { user } from "@/db/schema";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";

export const getCurrentUser = async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/login");
	}

	const currentUser = await db.query.user.findFirst({
		where: eq(user.id, session.user.id),
	});

	if (!currentUser) {
		redirect("/login");
	}

	return {
		...session,
		currentUser,
	};
};

export async function getUsers() {
	try {
		const results = await db.select().from(user).orderBy(desc(user.createdAt));
		return results;
	} catch (error) {
		console.error("Error fetching users:", error);
		return {
			error: "Failed to fetch users",
		};
	}
}

export async function getUserById(userId: string) {
	try {
		const [result] = await db.select().from(user).where(eq(user.id, userId));
		if (!result) return { error: "User not found" };
		return result;
	} catch (error) {
		console.error("Error fetching user:", error);
		return {
			error: "Failed to fetch user",
		};
	}
}

export async function getUserByEmail(email: string) {
	try {
		const [result] = await db.select().from(user).where(eq(user.email, email));
		if (!result) return { error: "User not found" };
		return result;
	} catch (error) {
		console.error("Error fetching user by email:", error);
		return { error: "Failed to fetch user by email" };
	}
}

export async function getLearners() {
	try {
		const results = await db
			.select()
			.from(user)
			.where(eq(user.role, "learner"))
			.orderBy(desc(user.createdAt));
		return results;
	} catch (error) {
		console.error("Error fetching learners:", error);
		return {
			error: "Failed to fetch learners",
		};
	}
}
