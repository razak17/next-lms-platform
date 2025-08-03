CREATE TABLE "user_course_access" (
	"user_id" text NOT NULL,
	"course_id" varchar(30) NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "user_course_access_user_id_course_id_pk" PRIMARY KEY("user_id","course_id")
);
--> statement-breakpoint
ALTER TABLE "user_course_access" ADD CONSTRAINT "user_course_access_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_course_access" ADD CONSTRAINT "user_course_access_course_id_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."course"("id") ON DELETE no action ON UPDATE no action;