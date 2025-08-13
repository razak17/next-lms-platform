import { generateId } from "@/lib/id";
import { relations } from "drizzle-orm";
import {
	integer,
	jsonb,
	pgTable,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";
import { track } from "./track";
import { user } from "./user";

export const purchase = pgTable("purchase", {
	id: varchar("id", { length: 30 })
		.$defaultFn(() => generateId())
		.primaryKey(), // prefix_ + nanoid (12)
	pricePaidInCents: integer().notNull(),
	trackDetails: jsonb()
		.notNull()
		.$type<{ name: string; description: string; image: string }>(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	trackId: varchar("track_id", { length: 30 })
		.notNull()
		.references(() => track.id, { onDelete: "no action" }),
	stripeSessionId: text().notNull().unique(),
	refundedAt: timestamp({ withTimezone: true }),
	createdAt: timestamp("created_at")
		.$defaultFn(() => /* @__PURE__ */ new Date())
		.notNull(),
	updatedAt: timestamp("updated_at")
		.$defaultFn(() => /* @__PURE__ */ new Date())
		.notNull(),
});

export const purchaseRelations = relations(purchase, ({ one }) => ({
	user: one(user, {
		fields: [purchase.userId],
		references: [user.id],
	}),
	track: one(track, {
		fields: [purchase.trackId],
		references: [track.id],
	}),
}));

export type Purchase = typeof purchase.$inferSelect;
export type PurchaseInsert = typeof purchase.$inferInsert;
