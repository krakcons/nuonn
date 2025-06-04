CREATE TABLE `api_keys` (
	`id` text PRIMARY KEY NOT NULL,
	`organizationId` text NOT NULL,
	`name` text NOT NULL,
	`key` text NOT NULL,
	`provider` text NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL
);
