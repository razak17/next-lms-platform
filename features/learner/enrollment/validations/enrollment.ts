import { z } from "zod";

export const enrollmentSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters"),
	gender: z.enum(["male", "female", "other"], {
		message: "Gender is required.",
	}),
	email: z.email("Please enter a valid email address."),
	phone: z.string().min(8, "Please enter a valid phone number"),
	track: z.string().optional(),
	location: z.string().optional(),
	disabled: z.boolean().optional(),
	bio: z.string().optional(),
});

export type EnrollmentFormData = z.infer<typeof enrollmentSchema>;
