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
export type PersonaType = z.infer<typeof PersonaSchema>;

const EvaluationSchema = z.object({
	name: z.string(),
	description: z.string(),
	type: z.enum(["message", "session"]),
	initialValue: z.string(),
	measure: z.string(),
});

export const ScenarioSchema = z.object({
	name: z.string(),
	description: z.string(),
	persona: z.object({
		role: z.string(),
		context: z.string(),
		goals: z.string(),
		evaluations: EvaluationSchema.array(),
	}),
	user: z.object({
		role: z.string(),
		context: z.string(),
		goals: z.string(),
		evaluations: EvaluationSchema.array(),
	}),
});
export type ScenarioType = z.infer<typeof ScenarioSchema>;

export const MessageSchema = z.object({
	id: z.string(),
	role: z.enum(["user", "assistant"]),
	content: z.string(),
});

export const ChatInputSchema = z.object({
	scenarioId: z.string(),
	personaId: z.string(),
});
export type ChatInputType = z.infer<typeof ChatInputSchema>;

export const ChatResponseSchema = z.object({
	content: z.string(),
	stats: DataOutputSchema.array(),
	evaluations: DataOutputSchema.array(),
});
export type ChatResponseType = z.infer<typeof ChatResponseSchema>;
