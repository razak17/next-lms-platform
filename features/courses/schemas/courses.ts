import { z } from "zod"

export const courseSchema = z.object({
  title: z.string().min(1, "Required"),
  description: z.string().min(1, "Required"),
})
