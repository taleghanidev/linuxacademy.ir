DO $$ BEGIN
  CREATE TYPE "public"."enrollment_status" AS ENUM('PENDING_REVIEW', 'CONFIRMED', 'REJECTED');
EXCEPTION WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "course_enrollments" (
	"id" text PRIMARY KEY NOT NULL,
	"course_slug" text NOT NULL,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"note" text,
	"amount" integer NOT NULL,
	"receipt_url" text NOT NULL,
	"receipt_name" text,
	"receipt_size" integer,
	"status" "enrollment_status" DEFAULT 'PENDING_REVIEW' NOT NULL,
	"review_note" text,
	"reviewed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "course_enrollments_course_idx" ON "course_enrollments" USING btree ("course_slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "course_enrollments_status_idx" ON "course_enrollments" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "course_enrollments_email_idx" ON "course_enrollments" USING btree ("email");