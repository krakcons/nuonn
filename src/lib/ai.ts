import { z } from "zod";

export const DataSchema = z.object({
	name: z.string(),
	description: z.string(),
	value: z.string(),
});

export const DataOutputSchema = z.object({
	name: z.string(),
	value: z.string(),
	type: z.enum(["message", "session", "stat"]),
});

export const StatLevelSchema = z.enum(["low", "medium", "high"]);

export const PersonaSchema = z.object({
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
	languages: z
		.object({
			name: z.string(),
			spoken: StatLevelSchema.optional(),
			written: StatLevelSchema.optional(),
		})
		.array(),
	religion: z.object({
		name: z.string(),
		commitment: StatLevelSchema.optional(),
	}),
	politics: z.object({
		name: z.string(),
		commitment: StatLevelSchema.optional(),
	}),
	// Stats
	intelligence: StatLevelSchema.optional(),
	appearance: StatLevelSchema.optional(),
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
});

export const ScenarioSchema = z.object({
	persona: z.object({
		role: z.string(),
		context: z.string(),
		goals: z.string(),
		stats: DataSchema.array(),
	}),
	user: z.object({
		role: z.string(),
		context: z.string(),
		evaluations: DataSchema.extend({
			type: z.enum(["session", "message"]),
		}).array(),
	}),
});

export const MessageSchema = z.object({
	id: z.string(),
	role: z.enum(["user", "assistant"]),
	content: z.string(),
});

export const AssistantInputSchema = z.object({
	model: z.enum(["gpt-4o", "gpt-4o-mini"]),
	persona: PersonaSchema,
	scenario: ScenarioSchema,
});
export type AssistantInputType = z.infer<typeof AssistantInputSchema>;

export const AssistantResponseSchema = z.object({
	content: z.string(),
	stats: DataOutputSchema.array(),
	evaluations: DataOutputSchema.array(),
});
export type AssistantResponseType = z.infer<typeof AssistantResponseSchema>;
