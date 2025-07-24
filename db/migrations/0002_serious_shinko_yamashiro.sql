ALTER TABLE "course" ADD COLUMN "image" json DEFAULT 'null'::json;--> statement-breakpoint
ALTER TABLE "course" DROP COLUMN "image_url";