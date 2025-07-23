CREATE TYPE "public"."user_in_community_role" AS ENUM('admin', 'learner');--> statement-breakpoint
CREATE TABLE "course" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"image_url" text,
	"user_id" text NOT NULL,
	"product_id" varchar(30) NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "course_title_unique" UNIQUE("title")
);
--> statement-breakpoint
CREATE TABLE "track_to_course" (
	"track_id" varchar(30) NOT NULL,
	"product_id" varchar(30) NOT NULL,
	CONSTRAINT "track_to_course_track_id_product_id_pk" PRIMARY KEY("track_id","product_id")
);
--> statement-breakpoint
CREATE TABLE "user_to_course" (
	"user_id" text NOT NULL,
	"product_id" varchar(30) NOT NULL,
	CONSTRAINT "user_to_course_user_id_product_id_pk" PRIMARY KEY("user_id","product_id")
);
--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"impersonated_by" text,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"first_name" text,
	"last_name" text,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"role" "user_in_community_role",
	"banned" boolean,
	"ban_reason" text,
	"ban_expires" timestamp,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "track" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"duration" text NOT NULL,
	"description" text NOT NULL,
	"image" json DEFAULT 'null'::json,
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
	"product_id" varchar(30) NOT NULL,
	CONSTRAINT "user_to_track_user_id_product_id_pk" PRIMARY KEY("user_id","product_id")
);
--> statement-breakpoint
ALTER TABLE "course" ADD CONSTRAINT "course_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course" ADD CONSTRAINT "course_product_id_track_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."track"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "track_to_course" ADD CONSTRAINT "track_to_course_track_id_track_id_fk" FOREIGN KEY ("track_id") REFERENCES "public"."track"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "track_to_course" ADD CONSTRAINT "track_to_course_product_id_course_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."course"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_to_course" ADD CONSTRAINT "user_to_course_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_to_course" ADD CONSTRAINT "user_to_course_product_id_course_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."course"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "track" ADD CONSTRAINT "track_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_to_track" ADD CONSTRAINT "user_to_track_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_to_track" ADD CONSTRAINT "user_to_track_product_id_track_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."track"("id") ON DELETE cascade ON UPDATE no action;