import { z } from "zod";

export const createInvoiceSchema = z.object({
	learnerId: z.string().min(1, "Learner is required"),
	amount: z.string().regex(/^\d+(\.\d{1,2})?$/, {
		message: "Must be a valid amount",
	}),
	dueDate: z
		.string()
		.min(1, "Due date is required")
		.refine((date) => !isNaN(Date.parse(date)), {
			message: "Must be a valid date",
		}),
	status: z.enum(["pending", "paid", "overdue"]),
	details: z.string().min(1, "Description is required"),
});

export type CreateInvoiceSchema = z.infer<typeof createInvoiceSchema>;
