import {
	boolean,
	integer,
	pgTable,
	primaryKey,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./user";
import { trackToCourse } from "./course";

export const track = pgTable("track", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	duration: text("duration").notNull(),
	description: text("description").notNull(),
	imageUrl: text("image_url"),
	instructor: text("instructor").notNull(),
	price: integer("price").notNull(),
	isPopular: boolean("is_popular").default(false).notNull(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id),
	createdAt: timestamp("created_at")
		.$defaultFn(() => /* @__PURE__ */ new Date())
		.notNull(),
	updatedAt: timestamp("updated_at")
		.$defaultFn(() => /* @__PURE__ */ new Date())
		.notNull(),
});

export const trackRelations = relations(track, ({ many }) => ({
	userToTrack: many(userToTrack),
  trackToCourse: many(trackToCourse),
}));

export const userToTrack = pgTable(
	"user_to_track",
	{
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		trackId: text("track_id")
			.notNull()
			.references(() => track.id, { onDelete: "cascade" }),
	},
	(t) => [primaryKey({ columns: [t.userId, t.trackId] })]
);

export const userToTrackRelations = relations(userToTrack, ({ one }) => ({
	user: one(user, {
		fields: [userToTrack.userId],
		references: [user.id],
	}),
	track: one(track, {
		fields: [userToTrack.trackId],
		references: [track.id],
	}),
}));
