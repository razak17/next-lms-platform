import { relations } from "drizzle-orm";
import { pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";
import { track } from "./track";
import { user } from "./user";

export const course = pgTable("course", {
	id: text("id").primaryKey(),
	title: text("title").notNull().unique(),
	description: text("description").notNull(),
	imageUrl: text("image_url"),
	userId: text("user_id")
		.notNull()
		.references(() => user.id),
	trackId: text("track_id")
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
		courseId: text("course_id")
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
		trackId: text("track_id")
			.notNull()
			.references(() => track.id, { onDelete: "cascade" }),
		courseId: text("course_id")
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
