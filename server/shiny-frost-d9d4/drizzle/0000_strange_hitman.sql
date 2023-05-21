CREATE TABLE `comments` (
	`id` integer PRIMARY KEY NOT NULL,
	`author` text NOT NULL,
	`body` text NOT NULL,
	`post_slug` text NOT NULL
);
