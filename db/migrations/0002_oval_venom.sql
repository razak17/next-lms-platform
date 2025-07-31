CREATE TYPE "public"."user_gender" AS ENUM('male', 'female', 'other');--> statement-breakpoint
CREATE TYPE "public"."invoice_status" AS ENUM('pending', 'paid', 'overdue');--> statement-breakpoint
CREATE TABLE "invoice" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"amount" numeric(10, 2) DEFAULT '0' NOT NULL,
	"last_name" text,
	"user_id" text NOT NULL,
	"status" "invoice_status",
	"due_date" timestamp,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "course" DROP CONSTRAINT "course_track_id_track_id_fk";
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "gender" "user_gender";--> statement-breakpoint
ALTER TABLE "invoice" ADD CONSTRAINT "invoice_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course" ADD CONSTRAINT "course_track_id_track_id_fk" FOREIGN KEY ("track_id") REFERENCES "public"."track"("id") ON DELETE no action ON UPDATE no action;