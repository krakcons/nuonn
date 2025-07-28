CREATE TABLE `behaviours` (
	`id` text PRIMARY KEY NOT NULL,
	`organizationId` text NOT NULL,
	`data` text NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `usages` (
	`id` text PRIMARY KEY NOT NULL,
	`organizationId` text NOT NULL,
	`apiKeyId` text NOT NULL,
	`moduleId` text NOT NULL,
	`data` text NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL
);
