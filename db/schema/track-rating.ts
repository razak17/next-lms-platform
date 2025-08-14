import {
	pgTable,
	text,
	integer,
	timestamp,
	varchar,
	primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./user";
import { track } from "./track";

export const trackRating = pgTable(
	"track_rating",
	{
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		trackId: varchar("track_id", { length: 30 })
			.notNull()
			.references(() => track.id, { onDelete: "cascade" }),
		rating: integer("rating").notNull(), // 1-5 stars
		createdAt: timestamp("created_at")
			.$defaultFn(() => new Date())
			.notNull(),
		updatedAt: timestamp("updated_at")
			.$defaultFn(() => new Date())
			.notNull(),
	},
	(t) => [primaryKey({ columns: [t.userId, t.trackId] })]
);

export const trackRatingRelations = relations(trackRating, ({ one }) => ({
	user: one(user, {
		fields: [trackRating.userId],
		references: [user.id],
	}),
	track: one(track, {
		fields: [trackRating.trackId],
		references: [track.id],
	}),
}));

export type TrackRating = typeof trackRating.$inferSelect;
export type TrackRatingInsert = typeof trackRating.$inferInsert;
