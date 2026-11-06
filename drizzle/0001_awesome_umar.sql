CREATE TABLE `datasets` (
	`game_id` text PRIMARY KEY NOT NULL,
	`data` text NOT NULL,
	`active` integer DEFAULT 1 NOT NULL,
	`updated_at` text NOT NULL,
	`updated_by` text,
	FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `runs` ADD `snapshot` text;