"use server";

import { db } from "@/db/drizzle";
import { user } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

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

export const signIn = async (email: string, password: string) => {
	try {
		await auth.api.signInEmail({
			body: {
				email,
				password,
			},
		});

		return {
			success: true,
			message: "Signed in successfully.",
		};
	} catch (error) {
		const e = error as Error;

		return {
			success: false,
			message: e.message || "An unknown error occurred.",
		};
	}
};

export const signUp = async ({
	email,
	password,
	firstName,
	lastName,
	role = "learner",
}: {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	role?: "learner" | "admin";
}) => {
	try {
		const newUser = await auth.api.signUpEmail({
			body: {
				email,
				password,
				name: firstName,
			},
		});
		await db
			.update(user)
			.set({
				firstName,
				lastName,
				role,
			})
			.where(eq(user.id, newUser.user.id));

		return {
			success: true,
			message: "Signed up successfully.",
		};
	} catch (error) {
		const e = error as Error;

		return {
			success: false,
			message: e.message || "An unknown error occurred.",
		};
	}
};
