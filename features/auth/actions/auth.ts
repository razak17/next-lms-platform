"use server";

import { db } from "@/db/drizzle";
import { user } from "@/db/schema";
import { auth } from "@/lib/auth/auth";
import { authClient } from "@/lib/auth/client";
import { APIError } from "better-auth";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

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
		const e = error as APIError;

		return {
			success: false,
			statusCode: e.statusCode,
			message: e.message || "An unknown error occurred.",
		};
	}
};

export const signUp = async ({
	email,
	password,
	firstName,
	lastName,
	gender,
	role = "learner",
}: {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	gender: string;
	role?: "learner" | "admin";
}) => {
	try {
		const newUser = await auth.api.signUpEmail({
			body: {
				email,
				password,
				name: `${firstName} ${lastName}`,
				gender,
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

export const getUserByEmail = async (email: string) => {
	const currentUser = await db.query.user.findFirst({
		where: eq(user.email, email),
	});

	if (!currentUser) {
		redirect("/");
	}

	return {
		currentUser,
	};
};

export const sendVerificationOtp = async (email: string) => {
	try {
		const { currentUser } = await getUserByEmail(email);

		await authClient.emailOtp.sendVerificationOtp({
			email: currentUser.email,
			type: "email-verification", // or "sign-in", "email-verification", "forget-password"
		});

		return {
			success: true,
			message: "Please check your email for your verification code.",
		};
	} catch (error) {
		const e = error as Error;

		return {
			success: false,
			message: e.message || "An unknown error occurred.",
		};
	}
};
