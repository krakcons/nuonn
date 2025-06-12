import { relations, sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import * as authSchema from "./auth";
import type { ContextDataType } from "../types/contexts";
import type { PersonaDataType } from "../types/personas";
import type { ScenarioDataType } from "../types/scenarios";
import type { ModuleDataType } from "../types/modules";
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
	data: text({ mode: "json" }).$type<PersonaDataType>().notNull(),
	...dates,
});

export const scenarios = sqliteTable("scenarios", {
	id: text().primaryKey(),
	organizationId: text().notNull(),
	data: text({ mode: "json" }).$type<ScenarioDataType>().notNull(),
	...dates,
});

export const contexts = sqliteTable("contexts", {
	id: text().primaryKey(),
	organizationId: text().notNull(),
	data: text({ mode: "json" }).$type<ContextDataType>().notNull(),
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

export const modules = sqliteTable("modules", {
	id: text().primaryKey(),
	organizationId: text().notNull(),
	apiKeyId: text().notNull(),
	data: text({ mode: "json" }).$type<ModuleDataType>().notNull(),
	...dates,
});

export const tableSchemas = {
	...authSchema,
	// CONTENT
	personas,
	scenarios,
	contexts,
	apiKeys,
	modules,
};

export const relationSchemas = {};
