import { z } from "zod";

export const createTrackSchema = z.object({
	name: z.string().min(1, "Name is required"),
	description: z.string().min(1, "Description is required"),
	duration: z.string().min(1, "Duratiion is required"),
	instructor: z.string().min(1, "Instructor is required"),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, {
    message: "Must be a valid price",
  }),
	isPopular: z.boolean().optional(),
	image: z.custom<File[] | undefined | null>().optional().nullable(),
});
