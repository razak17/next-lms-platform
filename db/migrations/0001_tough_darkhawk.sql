CREATE TYPE "public"."user_role" AS ENUM('admin', 'learner');--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "role" SET DATA TYPE "public"."user_role" USING "role"::text::"public"."user_role";--> statement-breakpoint
DROP TYPE "public"."user_in_community_role";