"use server";

import { db } from "@/db/drizzle";
import { InvoiceInsert, invoice } from "@/db/schema";
import { getCurrentUser } from "@/features/admin/users/queries/users";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirects } from "@/lib/constants";

export async function createInvoice(data: InvoiceInsert) {
	try {
		const { currentUser } = await getCurrentUser();
		if (!currentUser) return { error: "Unauthorized" };

		if (!data.userId) data.userId = currentUser.id;

		const [newInvoice] = await db.insert(invoice).values(data).returning();
		if (!newInvoice) throw new Error("Failed to create invoice");

		revalidatePath(redirects.adminToInvoices);

		return {
			data: newInvoice,
			message: "Invoice created successfully",
			error: null,
		};
	} catch (error) {
		console.error("Error creating invoice:", error);
		return { error: "Failed to create invoice" };
	}
}

export async function updateInvoice(
	invoiceId: string,
	data: Partial<typeof invoice.$inferInsert>
) {
	try {
		const { currentUser } = await getCurrentUser();
		if (!currentUser)
			return {
				error: true,
				message: "Unauthorized",
			};

		// Ensure user owns the invoice (add admin check as needed)
		const [existingInvoice] = await db
			.select()
			.from(invoice)
			.where(eq(invoice.id, invoiceId));

		if (!existingInvoice) {
			return {
				error: true,
				message: "Invoice not found",
			};
		}

		if (existingInvoice.userId !== currentUser.id /* && !currentUser.isAdmin */)
			return {
				error: true,
				message: "You do not have permission to update this invoice",
			};

		const [updatedInvoice] = await db
			.update(invoice)
			.set(data)
			.where(eq(invoice.id, invoiceId))
			.returning();

		revalidatePath(redirects.adminToInvoices);

		return {
			data: updatedInvoice,
			message: "Invoice updated successfully",
			error: null,
		};
	} catch (error) {
		console.error("Error updating invoice:", error);
		return { error: "Failed to update invoice" };
	}
}

export async function deleteInvoice(invoiceId: string) {
	try {
		const { currentUser } = await getCurrentUser();
		if (!currentUser)
			return {
				error: true,
				message: "Unauthorized",
			};

		// Ensure user owns the invoice (add admin check as needed)
		const [existingInvoice] = await db
			.select()
			.from(invoice)
			.where(eq(invoice.id, invoiceId));

		if (!existingInvoice) {
			return {
				error: true,
				message: "Invoice not found",
			};
		}

		if (existingInvoice.userId !== currentUser.id /* && !currentUser.isAdmin */)
			return {
				error: true,
				message: "You do not have permission to delete this invoice",
			};

		await db.delete(invoice).where(eq(invoice.id, invoiceId));

		revalidatePath(redirects.adminToInvoices);

		return {
			message: "Invoice deleted successfully",
			error: false,
		};
	} catch (error) {
		console.error("Error deleting invoice:", error);
		return {
			error: true,
			message: "Failed to delete invoice",
		};
	}
}
