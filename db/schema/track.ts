import { relations } from "drizzle-orm";
import {
	boolean,
	integer,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { trackToTechStackTable } from "./techStack";
import { userTable } from "./user";

export const trackTable = pgTable("track", {
	id: text("id").primaryKey(),
	userId: text("user_id").notNull(),
	name: text("name").notNull(),
	duration: text("duration").notNull(),
	description: text("description").notNull(),
	imageUrl: text("image_url"),
	instructor: text("instructor").notNull(),
	price: integer("price").notNull(),
	isPopular: boolean("is_popular").default(false).notNull(),
	createdAt: timestamp("created_at")
		.$defaultFn(() => /* @__PURE__ */ new Date())
		.notNull(),
	updatedAt: timestamp("updated_at")
		.$defaultFn(() => /* @__PURE__ */ new Date())
		.notNull(),
});

export const trackRelations = relations(trackTable, ({ one, many }) => ({
	userTable: one(userTable, {
		fields: [trackTable.userId],
		references: [userTable.id],
	}),
	trackToTechStack: many(trackToTechStackTable),
}));
