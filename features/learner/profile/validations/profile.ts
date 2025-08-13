import { z } from "zod";

export const learnerProfileSchema = z.object({
	firstName: z.string().min(1, "First name is required."),
	lastName: z.string().min(1, "Last name is required."),
	gender: z.enum(["male", "female", "other"], {
		message: "Gender is required.",
	}),
	email: z.email("Please enter a valid email address."),
	phone: z.string().optional(),
	location: z.string().optional(),
	bio: z.string().optional(),
});

export const learnerChangePasswordSchema = z
	.object({
		currentPassword: z.string().min(1, "Current password is required."),
		newPassword: z
			.string()
			.min(8, "Password must be at least 8 characters long."),
		confirmPassword: z.string().min(1, "Confirm password is required."),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Passwords do not match.",
		path: ["confirmPassword"],
	});
