CREATE TABLE "bids" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"club_id" text NOT NULL,
	"holder_name" text NOT NULL,
	"price" numeric NOT NULL,
	"message" text,
	"created_at" text DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "clubs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"city" text NOT NULL,
	"founded" integer,
	"colors" text NOT NULL,
	"stadium" text,
	"logo" text DEFAULT '' NOT NULL,
	"crown_price" numeric DEFAULT '10' NOT NULL,
	"crown_holder" text,
	"crown_price_history" text,
	"created_at" text DEFAULT now() NOT NULL,
	CONSTRAINT "clubs_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "bids" ADD CONSTRAINT "bids_club_id_clubs_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."clubs"("id") ON DELETE no action ON UPDATE no action;