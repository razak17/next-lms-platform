"use server";

import { db } from "@/db/drizzle";
import { invoice } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function getInvoices(userId: string) {
	try {
		const results = await db
			.select()
			.from(invoice)
			.where(eq(invoice.userId, userId))
			.orderBy(desc(invoice.createdAt));
		return results;
	} catch (error) {
		console.error("Error fetching invoices:", error);
		return { error: "Failed to fetch invoices" };
	}
}

export async function getInvoicesWithLearner(userId: string) {
	try {
		const results = await db.query.invoice.findMany({
			with: { learner: true },
			where: eq(invoice.userId, userId),
			orderBy: desc(invoice.createdAt),
		});
		return results;
	} catch (error) {
		console.error("Error fetching invoices with learner:", error);
		return { error: "Failed to fetch invoices with learner" };
	}
}

export async function getInvoiceById(invoiceId: string) {
	try {
		const [result] = await db
			.select()
			.from(invoice)
			.where(eq(invoice.id, invoiceId));
		if (!result) return { error: "Invoice not found" };
		return result;
	} catch (error) {
		console.error("Error fetching invoice:", error);
		return { error: "Failed to fetch invoice" };
	}
}
