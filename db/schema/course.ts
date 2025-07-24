import { generateId } from "@/lib/id";
import { relations } from "drizzle-orm";
import {
	json,
	pgTable,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";
import { track } from "./track";
import { user } from "./user";
import { StoredFile } from "@/types";

export const course = pgTable("course", {
	id: varchar("id", { length: 30 })
		.$defaultFn(() => generateId())
		.primaryKey(), // prefix_ + nanoid (12)
	title: text("title").notNull().unique(),
	description: text("description").notNull(),
	image: json("image").$type<StoredFile | null>().default(null),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
  trackId: varchar("track_id", { length: 30 })
    .notNull()
    .references(() => track.id, { onDelete: "cascade" }),
	createdAt: timestamp("created_at")
		.$defaultFn(() => /* @__PURE__ */ new Date())
		.notNull(),
	updatedAt: timestamp("updated_at")
		.$defaultFn(() => /* @__PURE__ */ new Date())
		.notNull(),
});

export const courseRelations = relations(course, ({ one }) => ({
  user: one(user, {
    fields: [course.userId],
    references: [user.id],
  }),
  track: one(track, {
    fields: [course.trackId],
    references: [track.id],
  }),
}));


export type Course = typeof course.$inferSelect;
export type CourseInsert = typeof course.$inferInsert;
