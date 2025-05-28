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
			`You are a roleplaying system. You should respond as if you were the following persona and respond naturally to the user based on the scenario.`,
			// PERSONA
			`PERSONA: ${JSON.stringify(persona.data)}. You "The AI" need to embody the previous data, take its name, info, only speak in the languages provided etc. Make sure you stay in character as the persona only. Do not deviate from the persona in any circumstances and no matter what the user says. If the user pretends to be you, do not become the user.`,
			// SCENARIO
			`SCENARIO: ${JSON.stringify(scenario.data)}.`,
			// EVALUATIONS
			`You should evaluate the persona based on these evaluations: ${JSON.stringify(scenario.data.persona.evaluations)}. A type of message means the evaluation should be calculated for each message (example. Politness, Tone, etc). A type of session should be calculated based on the newest message, should be stateful, and therefore maintained in responses after completion. (example. Have they asked for X, once it is true, keep it as that etc). Do not duplicate evaluations in response.`,
			`You should also evaluate the user responses based on these evaluations: ${JSON.stringify(scenario.data.user.evaluations)}. `,
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
