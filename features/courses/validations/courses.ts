import { z } from "zod";

export const createCourseSchema = z.object({
	title: z.string().min(1, "Required"),
	trackId: z.string().min(1, "Track id is required"),
	image: z.custom<File[] | undefined | null>().optional().nullable(),
	description: z.string().min(1, "Required"),
});

export type CreateCourseSchema = z.infer<typeof createCourseSchema>;
