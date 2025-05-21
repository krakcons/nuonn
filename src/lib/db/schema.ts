import { type InferSelectModel, sql } from "drizzle-orm";
import {
	jsonb,
	pgTable,
	primaryKey,
	text,
	timestamp,
} from "drizzle-orm/pg-core";

// Enums

export const localeEnum = text("locale", { enum: ["en", "fr"] });
export const roleEnum = text("role", { enum: ["owner", "member"] });

const dates = {
	createdAt: timestamp("created_at", {
		withTimezone: true,
	})
		.notNull()
		.default(sql`now()`),
	updatedAt: timestamp("updated_at", {
		withTimezone: true,
	})
		.notNull()
		.default(sql`now()`),
};

// USERS //

export const users = pgTable("users", {
	id: text("id").primaryKey(),
	email: text("email").unique().notNull(),
	firstName: text("firstName"),
	lastName: text("lastName"),
	...dates,
});
export const sessions = pgTable("sessions", {
	id: text("id").primaryKey(),
	userId: text("userId")
		.notNull()
		.references(() => users.id, {
			onDelete: "cascade",
		}),
	expiresAt: timestamp("expiresAt", {
		withTimezone: true,
		mode: "date",
	}).notNull(),
});
export const emailVerifications = pgTable("email_verifications", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => users.id, {
			onDelete: "cascade",
		}),
	code: text("code").notNull(),
	expiresAt: timestamp("expires_at", {
		withTimezone: true,
		mode: "date",
	})
		.$default(() => new Date(Date.now() + 1000 * 60 * 15))
		.notNull(),
});

// TEAMS //

export const teams = pgTable("teams", {
	id: text("id").primaryKey(),
	...dates,
});
export const teamTranslations = pgTable(
	"team_translations",
	{
		teamId: text("teamId")
			.notNull()
			.references(() => teams.id, {
				onDelete: "cascade",
			}),
		locale: localeEnum.notNull(),
		name: text("name").notNull(),
		logo: text("logo"),
		favicon: text("favicon"),
		...dates,
	},
	(t) => [primaryKey({ columns: [t.teamId, t.locale] })],
);

// CONTENT //

export const personas = pgTable("personas", {
	id: text("id").primaryKey(),
	// TODO: teamId
	json: jsonb("json").notNull(),
	...dates,
});

export const scenarios = pgTable("scenarios", {
	id: text("id").primaryKey(),
	// TODO: teamId
	json: jsonb("json").notNull(),
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
