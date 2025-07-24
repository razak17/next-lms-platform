import { generateId } from "@/lib/id";
import { relations } from "drizzle-orm";
import {
	json,
	pgTable,
	primaryKey,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";
import { track } from "./track";
import { user } from "./user";

export const course = pgTable("course", {
	id: varchar("id", { length: 30 })
		.$defaultFn(() => generateId())
		.primaryKey(), // prefix_ + nanoid (12)
	title: text("title").notNull().unique(),
	description: text("description").notNull(),
	image: json("image").$type<StoredFile | null>().default(null),
	userId: text("user_id")
		.notNull()
		.references(() => user.id),
	trackId: varchar("product_id", { length: 30 })
		.notNull()
		.references(() => track.id),
	createdAt: timestamp("created_at")
		.$defaultFn(() => /* @__PURE__ */ new Date())
		.notNull(),
	updatedAt: timestamp("updated_at")
		.$defaultFn(() => /* @__PURE__ */ new Date())
		.notNull(),
});

export const courseRelations = relations(course, ({ many }) => ({
	userToCourse: many(userToCourse),
	trackToCourse: many(trackToCourse),
}));

export const userToCourse = pgTable(
	"user_to_course",
	{
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		courseId: varchar("product_id", { length: 30 })
			.notNull()
			.references(() => course.id, { onDelete: "cascade" }),
	},
	(t) => [primaryKey({ columns: [t.userId, t.courseId] })]
);

export const userToCourseRelations = relations(userToCourse, ({ one }) => ({
	user: one(user, {
		fields: [userToCourse.userId],
		references: [user.id],
	}),
	course: one(course, {
		fields: [userToCourse.courseId],
		references: [course.id],
	}),
}));

export const trackToCourse = pgTable(
	"track_to_course",
	{
		trackId: varchar("track_id", { length: 30 })
			.notNull()
			.references(() => track.id, { onDelete: "cascade" }),
		courseId: varchar("product_id", { length: 30 })
			.notNull()
			.references(() => course.id, { onDelete: "cascade" }),
	},
	(t) => [primaryKey({ columns: [t.trackId, t.courseId] })]
);

export const trackToCourseRelations = relations(trackToCourse, ({ one }) => ({
	track: one(track, {
		fields: [trackToCourse.trackId],
		references: [track.id],
	}),
	course: one(course, {
		fields: [trackToCourse.courseId],
		references: [course.id],
	}),
}));

export type Course = typeof course.$inferSelect;
export type CourseInsert = typeof course.$inferInsert;
