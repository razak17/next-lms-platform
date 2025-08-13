import { db } from "@/db/drizzle";
import { purchase } from "@/db/schema";
import { and, eq, isNull } from "drizzle-orm";

export async function learnerOwnsTrack(trackId: string, learnerId: string) {
	const existingPurchase = await db.query.purchase.findFirst({
		where: and(
			eq(purchase.trackId, trackId),
			eq(purchase.userId, learnerId),
			isNull(purchase.refundedAt)
		),
	});

	return existingPurchase !== null && existingPurchase !== undefined;
}
