import { type InferSelectModel, sql } from "drizzle-orm";
import {
	sqliteTable,
	primaryKey,
	text,
	integer,
} from "drizzle-orm/sqlite-core";
import type { PersonaType, ScenarioType } from "../ai";

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

// USERS //

export const users = sqliteTable("users", {
	id: text().primaryKey(),
	email: text().unique().notNull(),
	firstName: text(),
	lastName: text(),
	...dates,
});
export const sessions = sqliteTable("sessions", {
	id: text().primaryKey(),
	userId: text()
		.notNull()
		.references(() => users.id, {
			onDelete: "cascade",
		}),
	expiresAt: integer({
		mode: "timestamp",
	})
		.default(sql`(unixepoch() + 15 * 60)`)
		.notNull(),
});
export const emailVerifications = sqliteTable("email_verifications", {
	id: text().primaryKey(),
	userId: text()
		.notNull()
		.references(() => users.id, {
			onDelete: "cascade",
		}),
	code: text().notNull(),
	expiresAt: integer({
		mode: "timestamp",
	})
		.default(sql`(unixepoch() + 15 * 60)`)
		.notNull(),
});

// TEAMS //

export const teams = sqliteTable("teams", {
	id: text().primaryKey(),
	...dates,
});
export const teamTranslations = sqliteTable(
	"team_translations",
	{
		teamId: text()
			.notNull()
			.references(() => teams.id, {
				onDelete: "cascade",
			}),
		locale: localeEnum.notNull(),
		name: text().notNull(),
		logo: text(),
		favicon: text(),
		...dates,
	},
	(t) => [primaryKey({ columns: [t.teamId, t.locale] })],
);

// CONTENT //

export const personas = sqliteTable("personas", {
	id: text().primaryKey(),
	// TODO: teamId
	data: text({ mode: "json" }).$type<PersonaType>().notNull(),
	...dates,
});

export const scenarios = sqliteTable("scenarios", {
	id: text().primaryKey(),
	// TODO: teamId
	data: text({ mode: "json" }).$type<ScenarioType>().notNull(),
	...dates,
});

export const tableSchemas = {
	// USERS
	users,
	sessions,
	emailVerifications,
	// TEAMS
	teams,
	teamTranslations,
	// CONTENT
	personas,
	scenarios,
};

export const relationSchemas = {};

export type User = InferSelectModel<typeof users>;
export type Session = InferSelectModel<typeof sessions>;
