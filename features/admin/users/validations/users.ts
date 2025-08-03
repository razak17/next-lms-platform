import { z } from "zod";

export const userProfileSchema = z.object({
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
