import { relations } from "drizzle-orm";
import { pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";
import { track } from "./track";
import { user } from "./user";

export const techStack = pgTable("tech_stack", {
	id: text("id").primaryKey(),
	name: text("name").notNull().unique(),
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

export const techStackRelations = relations(techStack, ({ one, many }) => ({
	user: one(user, {
		fields: [techStack.userId],
		references: [user.id],
	}),
	trackToTechStack: many(trackToTechStack),
}));

// New junction table for many-to-many relationship between tracks and techStack
export const trackToTechStack = pgTable(
	"track_to_tech_stack",
	{
		trackId: text("track_id")
			.notNull()
			.references(() => track.id, { onDelete: "cascade" }),
		techStackId: text("tech_stack_id")
			.notNull()
			.references(() => techStack.id, { onDelete: "cascade" }),
		createdAt: timestamp("created_at")
			.$defaultFn(() => /* @__PURE__ */ new Date())
			.notNull(),
		updatedAt: timestamp("updated_at")
			.$defaultFn(() => /* @__PURE__ */ new Date())
			.notNull(),
	},
	(t) => ({
		pk: primaryKey({ columns: [t.trackId, t.techStackId] }),
	})
);

// Define relations for trackToTechStack
export const trackToTechStackRelations = relations(
	trackToTechStack,
	({ one }) => ({
		track: one(track, {
			fields: [trackToTechStack.trackId],
			references: [track.id],
		}),
		techStack: one(techStack, {
			fields: [trackToTechStack.techStackId],
			references: [techStack.id],
		}),
	})
);
