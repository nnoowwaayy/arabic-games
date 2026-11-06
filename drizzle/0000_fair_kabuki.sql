CREATE TABLE `auth_attempts` (
	`key` text PRIMARY KEY NOT NULL,
	`count` integer NOT NULL,
	`reset_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `runs` (
	`id` text PRIMARY KEY NOT NULL,
	`game_id` text NOT NULL,
	`user_id` text,
	`guest_id` text NOT NULL,
	`deck` text NOT NULL,
	`turn` integer DEFAULT 0 NOT NULL,
	`score` integer DEFAULT 0 NOT NULL,
	`lives` integer NOT NULL,
	`difficulty` text NOT NULL,
	`status` text DEFAULT 'playing' NOT NULL,
	`daily` text,
	`created_at` text NOT NULL,
	`finished_at` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `runs_leaderboard` ON `runs` (`game_id`,`status`,`score`);--> statement-breakpoint
CREATE INDEX `runs_user` ON `runs` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `runs_guest_daily` ON `runs` (`guest_id`,`daily`);--> statement-breakpoint
CREATE UNIQUE INDEX `runs_user_daily` ON `runs` (`user_id`,`daily`);--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`password` text NOT NULL,
	`salt` text NOT NULL,
	`country` text DEFAULT 'MA' NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);