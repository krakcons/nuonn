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

export type ChatMetadata = {
	inputTokens: number;
	outputTokens: number;
	totalTokens: number;
	model: string;
};

export const ChatResponseSchema = z.object({
	content: z.string(),
	rapport: z.number(),
});
export type ChatResponseType = z.infer<typeof ChatResponseSchema>;

export const ChatEvaluationResponseSchema = z.object({
	evaluations: DataOutputSchema.array(),
});
export type ChatEvaluationResponseType = z.infer<
	typeof ChatEvaluationResponseSchema
>;

export const parseAssistantMessage = (
	message: UIMessage,
):
	| {
			content: string;
			evaluations: ChatEvaluationResponseType["evaluations"];
	  }
	| undefined => {
	return {
		content: message.parts.find((p) => p.type === "text")?.text ?? "",
		evaluations:
			message.parts.find((p) => p.type === "data-evaluations")?.data
				.evaluations ?? [],
	};
};
