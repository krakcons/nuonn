import { z } from "zod";

export const StatLevelSchema = z.enum(["low", "medium", "high"]);

export const PersonaDataSchema = z.object({
	// Info
	name: z.string(),
	age: z.string().optional(),
	gender: z.string().optional(),
	sexuality: z.string().optional(),
	pronouns: z.string().optional(),
	ethnicity: z.string().optional(),
	country: z.string().optional(),
	education: z.string().optional(),
	location: z.string().optional(),
	height: z.string().optional(),
	build: z.string().optional(),
	transportation: z.string().optional(),
	disibility: z.string().optional(),
	occupation: z.string().optional(),
	relationships: z.string().optional(),
	appearance: z.string().optional(),
	religion: z.string().optional(),
	politics: z.string().optional(),
	// Stats
	intelligence: StatLevelSchema.optional(),
	memory: StatLevelSchema.optional(),
	wealth: StatLevelSchema.optional(),
	health: StatLevelSchema.optional(),
	mentalHealth: StatLevelSchema.optional(),
	// Personality
	traits: z.string().optional(),
	hobbies: z.string().optional(),
	likes: z.string().optional(),
	dislikes: z.string().optional(),
	backstory: z.string().optional(),
	behaviour: z.string().optional(),
	// Languages
	languages: z
		.object({
			name: z.string(),
			spoken: StatLevelSchema.optional(),
			written: StatLevelSchema.optional(),
		})
		.array(),
});
export type PersonaDataType = z.infer<typeof PersonaDataSchema>;

export const PersonaSchema = z.object({
	id: z.string(),
	organizationId: z.string(),
	data: PersonaDataSchema,
	updatedAt: z.date(),
	createdAt: z.date(),
});
export type PersonaType = z.infer<typeof PersonaSchema>;
