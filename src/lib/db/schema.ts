import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import type { PersonaType, ScenarioType } from "../ai";
import * as authSchema from "./auth";
export * from "./auth";

// Enums

export const localeEnum = text("locale", { enum: ["en", "fr"] });
export const roleEnum = text("role", { enum: ["owner", "member"] });

const dates = {
	createdAt: integer({
		mode: "timestamp",
	})
		.notNull()
		.default(sql`(unixepoch())`),
	updatedAt: integer({
		mode: "timestamp",
	})
		.notNull()
		.default(sql`(unixepoch())`),
};

// CONTENT //

export const personas = sqliteTable("personas", {
	id: text().primaryKey(),
	organizationId: text().notNull(),
	data: text({ mode: "json" }).$type<PersonaType>().notNull(),
	...dates,
});

export const scenarios = sqliteTable("scenarios", {
	id: text().primaryKey(),
	organizationId: text().notNull(),
	data: text({ mode: "json" }).$type<ScenarioType>().notNull(),
	...dates,
});

export const apiKeys = sqliteTable("api_keys", {
	id: text().primaryKey(),
	organizationId: text().notNull(),
	name: text().notNull(),
	key: text().notNull(),
	provider: text({ enum: ["openai"] }).notNull(),
	...dates,
});

export const tableSchemas = {
	...authSchema,
	// CONTENT
	personas,
	scenarios,
	apiKeys,
};

export const relationSchemas = {};
