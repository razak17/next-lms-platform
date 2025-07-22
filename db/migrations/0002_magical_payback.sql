CREATE TYPE "public"."user_in_community_role" AS ENUM('admin', 'learner');--> statement-breakpoint
CREATE TABLE "course" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"image_url" text,
	"user_id" text NOT NULL,
	"track_id" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "course_title_unique" UNIQUE("title")
);
--> statement-breakpoint
CREATE TABLE "track_to_course" (
	"track_id" text NOT NULL,
	"course_id" text NOT NULL,
	CONSTRAINT "track_to_course_track_id_course_id_pk" PRIMARY KEY("track_id","course_id")
);
--> statement-breakpoint
CREATE TABLE "user_to_course" (
	"user_id" text NOT NULL,
	"course_id" text NOT NULL,
	CONSTRAINT "user_to_course_user_id_course_id_pk" PRIMARY KEY("user_id","course_id")
);
--> statement-breakpoint
CREATE TABLE "track" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"duration" text NOT NULL,
	"description" text NOT NULL,
	"image_url" text,
	"instructor" text NOT NULL,
	"price" integer NOT NULL,
	"is_popular" boolean DEFAULT false NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_to_track" (
	"user_id" text NOT NULL,
	"track_id" text NOT NULL,
	CONSTRAINT "user_to_track_user_id_track_id_pk" PRIMARY KEY("user_id","track_id")
);
--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "role" SET DATA TYPE "public"."user_in_community_role" USING "role"::"public"."user_in_community_role";--> statement-breakpoint
ALTER TABLE "course" ADD CONSTRAINT "course_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course" ADD CONSTRAINT "course_track_id_track_id_fk" FOREIGN KEY ("track_id") REFERENCES "public"."track"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "track_to_course" ADD CONSTRAINT "track_to_course_track_id_track_id_fk" FOREIGN KEY ("track_id") REFERENCES "public"."track"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "track_to_course" ADD CONSTRAINT "track_to_course_course_id_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."course"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_to_course" ADD CONSTRAINT "user_to_course_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_to_course" ADD CONSTRAINT "user_to_course_course_id_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."course"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "track" ADD CONSTRAINT "track_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_to_track" ADD CONSTRAINT "user_to_track_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_to_track" ADD CONSTRAINT "user_to_track_track_id_track_id_fk" FOREIGN KEY ("track_id") REFERENCES "public"."track"("id") ON DELETE cascade ON UPDATE no action;