import { parsePartialJson } from "@ai-sdk/ui-utils";
import type { UIMessage } from "ai";
import { z } from "zod";

export const DataSchema = z.object({
	name: z.string(),
	description: z.string(),
	value: z.string(),
});

export const DataOutputSchema = z.object({
	name: z.string(),
	value: z.string(),
	type: z.enum(["message", "session"]),
	role: z.enum(["user", "persona"]),
	success: z.boolean(),
});

export const MessageSchema = z.object({
	id: z.string(),
	role: z.enum(["user", "assistant"]),
	content: z.string(),
});

export const ChatPlaygroundInputSchema = z.object({
	scenarioId: z.string({ error: "Scenario is required" }),
	personaId: z.string({ error: "Persona is required" }),
	behaviourId: z.string({ error: "Behaviour is required" }),
	contextIds: z.string().array().optional(),
});
export type ChatPlaygroundInputType = z.infer<typeof ChatPlaygroundInputSchema>;

export const ChatResponseSchema = z.object({
	content: z.string(),
	evaluations: DataOutputSchema.array(),
	rapport: z.number(),
});
export type ChatResponseType = z.infer<typeof ChatResponseSchema>;

export const parseAssistantMessage = (
	message: UIMessage,
): ChatResponseType | undefined => {
	const text = message.parts.find((p) => p.type === "text")?.text;
	const parsedMessage = parsePartialJson(text);

	const { value, state } = parsedMessage as {
		value: ChatResponseType | null;
		state: string;
	};

	if (value && ["repaired-parse", "successful-parse"].includes(state)) {
		return value;
	}

	return undefined;
};
