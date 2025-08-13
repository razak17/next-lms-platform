CREATE TABLE "purchase" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"pricePaidInCents" integer NOT NULL,
	"trackDetails" jsonb NOT NULL,
	"user_id" text NOT NULL,
	"track_id" varchar(30) NOT NULL,
	"stripeSessionId" text NOT NULL,
	"refundedAt" timestamp with time zone,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "purchase_stripeSessionId_unique" UNIQUE("stripeSessionId")
);
--> statement-breakpoint
ALTER TABLE "purchase" ADD CONSTRAINT "purchase_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase" ADD CONSTRAINT "purchase_track_id_track_id_fk" FOREIGN KEY ("track_id") REFERENCES "public"."track"("id") ON DELETE no action ON UPDATE no action;