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
