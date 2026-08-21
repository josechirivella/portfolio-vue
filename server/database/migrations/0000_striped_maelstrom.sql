CREATE TABLE `post_likes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`post_slug` text NOT NULL,
	`user_hash` text NOT NULL,
	`like_count` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `post_slug_idx` ON `post_likes` (`post_slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `unique_user_post` ON `post_likes` (`post_slug`,`user_hash`);