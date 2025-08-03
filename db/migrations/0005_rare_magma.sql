CREATE TABLE "learner_track" (
	"user_id" text NOT NULL,
	"track_id" varchar(30) NOT NULL,
	"created_by" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "learner_track_user_id_track_id_pk" PRIMARY KEY("user_id","track_id")
);
--> statement-breakpoint
ALTER TABLE "learner_track" ADD CONSTRAINT "learner_track_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "learner_track" ADD CONSTRAINT "learner_track_track_id_track_id_fk" FOREIGN KEY ("track_id") REFERENCES "public"."track"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "learner_track" ADD CONSTRAINT "learner_track_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
