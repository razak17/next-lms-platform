import {
	pgTable,
	primaryKey,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";
import { user } from "./user";
import { track } from "./track";
import { relations } from "drizzle-orm";

export const learnerTrack = pgTable(
	"learner_track",
	{
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		trackId: varchar("track_id", { length: 30 })
			.notNull()
			.references(() => track.id, { onDelete: "cascade" }),
		createdBy: text("created_by")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		createdAt: timestamp("created_at")
			.$defaultFn(() => /* @__PURE__ */ new Date())
			.notNull(),
		updatedAt: timestamp("updated_at")
			.$defaultFn(() => /* @__PURE__ */ new Date())
			.notNull(),
	},
	(t) => [primaryKey({ columns: [t.userId, t.trackId] })]
);

export const learnerTrackRelations = relations(learnerTrack, ({ one }) => ({
	user: one(user, {
		fields: [learnerTrack.userId],
		references: [user.id],
	}),
	track: one(track, {
		fields: [learnerTrack.trackId],
		references: [track.id],
	}),
	createdBy: one(user, {
		fields: [learnerTrack.createdBy],
		references: [user.id],
	}),
}));

export type LearnerTrack = typeof learnerTrack.$inferSelect;
export type LearnerTrackInsert = typeof learnerTrack.$inferInsert;
