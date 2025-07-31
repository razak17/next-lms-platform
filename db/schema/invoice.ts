import { generateId } from "@/lib/id";
import { relations } from "drizzle-orm";
import {
	decimal,
	pgEnum,
	pgTable,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";
import { user } from "./user";

export const invoiceStatusEnums = pgEnum("invoice_status", [
	"pending",
	"paid",
	"overdue",
]);

export const invoice = pgTable("invoice", {
	id: varchar("id", { length: 30 })
		.$defaultFn(() => generateId())
		.primaryKey(), // prefix_ + nanoid (12)
	amount: decimal("amount", { precision: 10, scale: 2 }).notNull().default("0"),
	details: text("details"),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	learnerId: text("learner_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	status: invoiceStatusEnums().notNull().default("pending"),
	dueDate: timestamp("due_date").$defaultFn(() => /* @__PURE__ */ new Date()),
	createdAt: timestamp("created_at")
		.$defaultFn(() => /* @__PURE__ */ new Date())
		.notNull(),
	updatedAt: timestamp("updated_at")
		.$defaultFn(() => /* @__PURE__ */ new Date())
		.notNull(),
});

export const invoiceRelations = relations(invoice, ({ one }) => ({
	user: one(user, {
		fields: [invoice.userId],
		references: [user.id],
	}),
	learner: one(user, {
		fields: [invoice.learnerId],
		references: [user.id],
	}),
}));

export type Invoice = typeof invoice.$inferSelect;
export type InvoiceInsert = typeof invoice.$inferInsert;
