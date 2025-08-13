"use server";

import { db } from "@/db/drizzle";
import { purchase } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function getPurchasesByUserId(userId: string) {
	try {
		const results = await db.query.purchase.findMany({
			with: {
				track: true,
			},
			where: eq(purchase.userId, userId),
			orderBy: desc(purchase.createdAt),
		});
		return results;
	} catch (error) {
		console.error("Error fetching purchases:", error);
		return { error: "Failed to fetch purchases" };
	}
}

export async function getPurchaseById(purchaseId: string) {
	try {
		const result = await db.query.purchase.findFirst({
			with: {
				track: true,
				user: true,
			},
			where: eq(purchase.id, purchaseId),
		});
		if (!result) return { error: "Purchase not found" };
		return result;
	} catch (error) {
		console.error("Error fetching purchase:", error);
		return { error: "Failed to fetch purchase" };
	}
}
