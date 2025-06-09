CREATE TABLE `contexts` (
	`id` text PRIMARY KEY NOT NULL,
	`organizationId` text NOT NULL,
	`data` text NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `modules` (
	`id` text PRIMARY KEY NOT NULL,
	`organizationId` text NOT NULL,
	`apiKeyId` text NOT NULL,
	`data` text NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL
);
