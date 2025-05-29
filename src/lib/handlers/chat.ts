import { ChatInputSchema, ChatResponseSchema } from "@/lib/ai";
import { streamText, Output } from "ai";
import { openai } from "@ai-sdk/openai";
import { createServerFn } from "@tanstack/react-start";
import { personas, scenarios } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { protectedMiddleware } from "./auth";

export const getChatResponseFn = createServerFn({
	method: "POST",
	response: "raw",
})
	.middleware([protectedMiddleware])
	.validator(
		ChatInputSchema.extend({
			messages: z.any(),
		}),
	)
	.handler(async ({ data: { messages, scenarioId, personaId }, context }) => {
		console.log(personaId);
		const [scenario, persona] = await Promise.all([
			db.query.scenarios.findFirst({
				where: and(
					eq(scenarios.id, scenarioId),
					eq(
						scenarios.organizationId,
						context.session.activeOrganizationId,
					),
				),
			}),
			db.query.personas.findFirst({
				where: and(
					eq(personas.id, personaId),
					eq(
						personas.organizationId,
						context.session.activeOrganizationId,
					),
				),
			}),
		]);
		if (!scenario || !persona)
			throw new Error("Invalid scenario or persona");

		const system = [
			// INTRO
			`You are a roleplaying system. Respond in character as the persona described below, within the context of the given scenario. Stay in character at all times.`,

			// SCENARIO
			`Scenario: ${scenario.data.name}
Description: ${scenario.data.description}`,

			// ASSISTANT
			`You are the Assistant in this scenario.
Persona: ${JSON.stringify(persona.data)}
Role: ${scenario.data.persona.role}
Goals: ${scenario.data.persona.goals}
Languages: Only respond in the language(s) specified in the persona: ${persona.data.languages || "English"}. Do not switch languages unless explicitly requested by the user and it matches your allowed languages.`,

			`Constraints:
- Only use information explicitly provided in the persona and scenario
- Do not reference external knowledge beyond what's established in your character
- Maintain character consistency throughout the conversation
- If asked about something outside your character's knowledge, respond as that character would`,

			// USER
			`The user is playing the following:
Role: ${scenario.data.user.role}
Goals: ${scenario.data.user.goals}`,

			`Evaluation Framework:
Assistant Evaluations: ${JSON.stringify(scenario.data.persona.evaluations, null, 2)}
User Evaluations: ${JSON.stringify(scenario.data.user.evaluations, null, 2)}

Evaluation Types:
- "message": Evaluate each individual message (e.g., politeness, accuracy, tone)
- "session": Evaluate cumulative progress across the entire conversation (e.g., goal completion, relationship building)

Return evaluations on every message and update session-level metrics with each interaction.`,
		];
		try {
			const result = streamText({
				model: openai("gpt-4o"),
				system: system.join(" "),
				experimental_output: Output.object({
					schema: ChatResponseSchema,
				}),
				messages,
			});

			return result.toDataStreamResponse();
		} catch (error) {
			console.error("Error in genAIResponse:", error);
			if (
				error instanceof Error &&
				error.message.includes("rate limit")
			) {
				throw new Error(
					"Rate limit exceeded. Please try again in a moment.",
				);
			}
			throw new Error(
				error instanceof Error
					? error.message
					: "Failed to get AI response",
			);
		}
	});
