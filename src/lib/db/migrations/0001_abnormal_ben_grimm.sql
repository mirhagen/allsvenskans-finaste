ALTER TABLE "bids" ADD COLUMN "stripe_session_id" text;--> statement-breakpoint
ALTER TABLE "bids" ADD COLUMN "status" text DEFAULT 'crowned' NOT NULL;--> statement-breakpoint
ALTER TABLE "bids" ADD CONSTRAINT "bids_stripe_session_id_unique" UNIQUE("stripe_session_id");