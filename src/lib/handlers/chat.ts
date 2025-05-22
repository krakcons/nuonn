import { ChatInputSchema, ChatResponseSchema } from "@/lib/ai";
import { streamText, Output } from "ai";
import { openai } from "@ai-sdk/openai";
import { createServerFn } from "@tanstack/react-start";
import { personas, scenarios } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const getChatResponseFn = createServerFn({
	method: "POST",
	response: "raw",
})
	.validator(
		ChatInputSchema.extend({
			messages: z.any(),
		}),
	)
	.handler(async ({ data: { messages, scenarioId, personaId } }) => {
		const [scenario, persona] = await Promise.all([
			db.query.scenarios.findFirst({
				where: eq(scenarios.id, scenarioId),
			}),
			db.query.personas.findFirst({
				where: eq(personas.id, personaId),
			}),
		]);
		if (!scenario || !persona)
			throw new Error("Invalid scenario or persona");

		const system = [
			// INTRO
			`You are a roleplaying system. You should respond as if you were the following persona and respond naturally to the user based on the scenario.`,
			// PERSONA
			`The persona you should become is defined here: ${persona.data}. Make sure you stay in character.`,
			// SCENARIO
			`You should respond in context of this specific scenario ${JSON.stringify(scenario.data)}.`,
			// STATS
			`The character you are portraying should maintain and manage personal stats like a video game: ${JSON.stringify(scenario.data.persona.stats)}. Use previous messages to see where your stats are and adjust them according to the messages from users (ex: Mood could be a stat and if the user says something to offend you, you can lower mood)`,
			// EVALUATIONS
			`You should also evaluate the user responses based on these evaluations: ${JSON.stringify(scenario.data.user.evaluations)}. A type of message means the evaluation should be calculated for each user message (example. Politness, Tone, etc). A type of session should be calculated based on the newest user message, should be stateful, and therefore maintained in responses after completion. (example. Has the user asked for X, once it is true, keep it as that etc). Do not duplicate evaluations in response.`,
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
