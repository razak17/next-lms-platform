import { z } from "zod";

export const createTrackSchema = z.object({
	name: z.string().min(1, "Name is required"),
	description: z.string().min(1, "Description is required"),
	duration: z.string().min(1, "Duratiion is required"),
	instructor: z.string().min(1, "Instructor is required"),
	price: z
		.number("Price is required")
		.min(0, "Price must be a positive number"),
	isPopular: z.boolean().optional(),
	image: z.custom<File[] | undefined | null>().optional().nullable(),
});
