CREATE TABLE `bids` (
	`id` text PRIMARY KEY DEFAULT lower(hex(randomblob(16))) NOT NULL,
	`club_id` text NOT NULL,
	`holder_name` text NOT NULL,
	`price` numeric NOT NULL,
	`message` text,
	`created_at` text DEFAULT datetime('now') NOT NULL,
	FOREIGN KEY (`club_id`) REFERENCES `clubs`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `clubs` (
	`id` text PRIMARY KEY DEFAULT lower(hex(randomblob(16))) NOT NULL,
	`name` text NOT NULL,
	`city` text NOT NULL,
	`founded` integer,
	`colors` text NOT NULL,
	`stadium` text,
	`crown_price` numeric DEFAULT '10' NOT NULL,
	`crown_holder` text,
	`crown_price_history` text,
	`created_at` text DEFAULT datetime('now') NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `clubs_name_unique` ON `clubs` (`name`);