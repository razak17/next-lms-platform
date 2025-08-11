import { generateId } from "@/lib/id";
import { StoredFile } from "@/types";
import { relations } from "drizzle-orm";
import {
	boolean,
	decimal,
	integer,
	json,
	pgTable,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";
import { Course, course } from "./course";
import { learnerTrack } from "./learner-track";
import { user } from "./user";

export const track = pgTable("track", {
	id: varchar("id", { length: 30 })
		.$defaultFn(() => generateId())
		.primaryKey(), // prefix_ + nanoid (12)
	name: text("name").notNull(),
	duration: text("duration").notNull(),
	description: text("description").notNull(),
	image: json("image").$type<StoredFile | null>().default(null),
	instructor: text("instructor").notNull(),
	price: decimal("price", { precision: 10, scale: 2 }).notNull().default("0"),
	isPopular: boolean("is_popular").default(false).notNull(),
	rating: integer("rating").notNull().default(0),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	createdAt: timestamp("created_at")
		.$defaultFn(() => /* @__PURE__ */ new Date())
		.notNull(),
	updatedAt: timestamp("updated_at")
		.$defaultFn(() => /* @__PURE__ */ new Date())
		.notNull(),
});

export const trackRelations = relations(track, ({ many, one }) => ({
	user: one(user, {
		fields: [track.userId],
		references: [user.id],
	}),
	courses: many(course),
	learnerTrack: many(learnerTrack),
}));

export type Track = typeof track.$inferSelect;
export type TrackInsert = typeof track.$inferInsert;
export type TrackWithCourses = Track & {
	courses: Course[];
};
