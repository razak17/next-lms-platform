ALTER TABLE "invoice" ALTER COLUMN "status" SET DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE "invoice" ALTER COLUMN "status" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "invoice" ADD COLUMN "details" text;--> statement-breakpoint
ALTER TABLE "invoice" ADD COLUMN "learner_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "invoice" ADD CONSTRAINT "invoice_learner_id_user_id_fk" FOREIGN KEY ("learner_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoice" DROP COLUMN "last_name";