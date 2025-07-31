import { relations } from "drizzle-orm";
import { boolean, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { course } from "./course";
import { track } from "./track";
import { invoice } from "./invoice";

export const userRoleEnums = pgEnum("user_role", ["admin", "learner"]);
export const userGenderEnums = pgEnum("user_gender", [
	"male",
	"female",
	"other",
]);

export const user = pgTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	firstName: text("first_name"),
	lastName: text("last_name"),
	gender: userGenderEnums(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("email_verified")
		.$defaultFn(() => false)
		.notNull(),
	image: text("image"),
	createdAt: timestamp("created_at")
		.$defaultFn(() => /* @__PURE__ */ new Date())
		.notNull(),
	updatedAt: timestamp("updated_at")
		.$defaultFn(() => /* @__PURE__ */ new Date())
		.notNull(),
	role: userRoleEnums(),
	banned: boolean("banned"),
	banReason: text("ban_reason"),
	banExpires: timestamp("ban_expires"),
});

export const session = pgTable("session", {
	id: text("id").primaryKey(),
	expiresAt: timestamp("expires_at").notNull(),
	token: text("token").notNull().unique(),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	impersonatedBy: text("impersonated_by"),
});

export const account = pgTable("account", {
	id: text("id").primaryKey(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at"),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
	scope: text("scope"),
	password: text("password"),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
	id: text("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: timestamp("expires_at").notNull(),
	createdAt: timestamp("created_at").$defaultFn(
		() => /* @__PURE__ */ new Date()
	),
	updatedAt: timestamp("updated_at").$defaultFn(
		() => /* @__PURE__ */ new Date()
	),
});

export const userRelations = relations(user, ({ many }) => ({
	tracks: many(track),
	courses: many(course),
	invoice: many(invoice),
	learner: many(user, { relationName: "learner" }),
}));

export type User = typeof user.$inferSelect;
export type UserInsert = typeof user.$inferInsert;
