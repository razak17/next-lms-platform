import { relations } from "drizzle-orm";
import { pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";
import { trackTable } from "./track";
import { userTable } from "./user";

export const techStackTable = pgTable("tech_stack", {
	id: text("id").primaryKey(),
	name: text("name").notNull().unique(),
	userId: text("user_id")
		.notNull()
		.references(() => userTable.id),
	createdAt: timestamp("created_at")
		.$defaultFn(() => /* @__PURE__ */ new Date())
		.notNull(),
	updatedAt: timestamp("updated_at")
		.$defaultFn(() => /* @__PURE__ */ new Date())
		.notNull(),
});

export const techStackRelations = relations(
	techStackTable,
	({ one, many }) => ({
		user: one(userTable, {
			fields: [techStackTable.userId],
			references: [userTable.id],
		}),
		trackToTechStack: many(trackToTechStackTable),
	})
);

// New junction table for many-to-many relationship between tracks and techStack
export const trackToTechStackTable = pgTable(
	"track_to_tech_stack",
	{
		trackId: text("track_id")
			.notNull()
			.references(() => trackTable.id, { onDelete: "cascade" }),
		techStackId: text("tech_stack_id")
			.notNull()
			.references(() => techStackTable.id, { onDelete: "cascade" }),
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
	trackToTechStackTable,
	({ one }) => ({
		track: one(trackTable, {
			fields: [trackToTechStackTable.trackId],
			references: [trackTable.id],
		}),
		techStack: one(techStackTable, {
			fields: [trackToTechStackTable.techStackId],
			references: [techStackTable.id],
		}),
	})
);
