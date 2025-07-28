import { ChatPlaygroundInputSchema, ChatResponseSchema } from "@/lib/ai";
import { streamText, Output, convertToModelMessages } from "ai";
import { createOpenAI, openai } from "@ai-sdk/openai";
import { createServerFn } from "@tanstack/react-start";
import {
	behaviours,
	contexts,
	modules,
	personas,
	scenarios,
	usages,
} from "@/lib/db/schema";
import { db } from "@/lib/db";
import { eq, inArray } from "drizzle-orm";
import { z } from "zod";
import type { ScenarioType } from "../types/scenarios";
import type { PersonaType } from "../types/personas";
import type { ContextType } from "../types/contexts";
import { BehaviourType } from "../types/behaviours";

const getPrompt = ({
	scenario,
	persona,
	contexts,
	behaviour,
}: {
	scenario: ScenarioType;
	persona: PersonaType;
	contexts?: ContextType[];
	behaviour: BehaviourType;
}) =>
	[
		// INTRO
		`You are a roleplaying system. Respond as the character described below, within the context of the given scenario. Stay in character at all times.`,

		// SCENARIO
		`Scenario: ${scenario.data.name}
Description: ${scenario.data.description}`,

		// CHARACTER
		`You are the Character in this scenario.
Character: ${JSON.stringify(persona.data)}
Role: ${scenario.data.persona.role}
Goals: ${scenario.data.persona.goals}
Languages: Only respond in the language(s) specified in the character: ${persona.data.languages || "English"}. Only switch languages if you speak it.`,

		`Constraints:
- Only use information explicitly provided in the character and scenario
- Only reference knowledge thats established in your character
- Maintain character consistency throughout the conversation
- If asked about something outside your character's knowledge, respond as that character would`,

		// BEHAVIOUR
		`Here is the character behaviour: ${JSON.stringify(behaviour.data)}`,
		`You will modulate your behavior dynamically based on the character behaviour`,
		`You must distort expressions of facts about yourself and your situation proportionate to the dishonesty parameter.`,
		`You must develop rapport with the user in a manner consistent with the rapportBuilding out of 100.`,
		`You must decrease rapport with the PUT in a manner consistent with the rapportLoss out of 100.`,
		`Your willingness to share information will increase as rapport with the user increases.`,
		`You will track the current rapport value and maintain it throughout the conversation.`,

		// USER
		`The user is playing the following:
Role: ${scenario.data.user.role}
Goals: ${scenario.data.user.goals}`,

		// Context
		contexts &&
			contexts.length > 0 &&
			`Adjust the characters responses based on the following contexts:
${contexts.map(
	(c, i) => `${i}:
Type: ${c.data.type}
Name: ${c.data.name}
Description: ${c.data.description}
`,
)}
`,

		`Evaluation Framework:
Character Evaluations: ${JSON.stringify(scenario.data.persona.evaluations, null, 2)}
User Evaluations: ${JSON.stringify(scenario.data.user.evaluations, null, 2)}

Evaluation Types (based on type json field above):
- "message": Evaluate each individual message (e.g., politeness, accuracy, tone)
- "session": Evaluate cumulative progress across the entire conversation (e.g., goal completion, relationship building)

Return the state of ALL evaluations on every response (ex. if there are 3 evaluations, return all three even if they dont change) and update session-level metrics with each interaction.

Format the evaluations as a JSON object with the following fields:
- name: The name of the evaluation
- value: The value of the evaluation based on the measure
- type: The type of evaluation (message or session)
- success: Whether the evaluation was successful based on the success value (true or false)

Example:
[
{
	"name": "Politeness",
	"value": 0.8,
	"type": "message",
	"success": true
},
{
	"name": "Stress",
	"value": 45,
	"type": "session",
	"success": false
}
]
`,
	].join(" ");

export const getChatPlaygroundResponseFn = createServerFn({
	method: "POST",
	response: "raw",
})
	.validator(
		ChatPlaygroundInputSchema.extend({
			messages: z.any(),
		}),
	)
	.handler(
		async ({
			data: { messages, scenarioId, personaId, contextIds, behaviourId },
		}) => {
			const [scenario, persona, chatContexts, behaviour] =
				await Promise.all([
					db.query.scenarios.findFirst({
						where: eq(scenarios.id, scenarioId),
					}),
					db.query.personas.findFirst({
						where: eq(personas.id, personaId),
					}),
					contextIds &&
						db.query.contexts.findMany({
							where: inArray(contexts.id, contextIds),
						}),
					db.query.behaviours.findFirst({
						where: eq(behaviours.id, behaviourId),
					}),
				]);
			if (!scenario || !persona || !behaviour)
				throw new Error("Invalid scenario, persona, or behaviour");

			const prompt = getPrompt({
				scenario,
				persona,
				contexts: chatContexts,
				behaviour,
			});

			const result = streamText({
				model: openai("gpt-4o"),
				system: prompt,
				experimental_output: Output.object({
					schema: ChatResponseSchema,
				}),
				messages: convertToModelMessages(messages),
			});

			return result.toUIMessageStreamResponse();
		},
	);

export const getChatModuleResponseFn = createServerFn({
	method: "POST",
	response: "raw",
})
	.validator(
		z
			.object({
				moduleId: z.string(),
			})
			.extend({
				messages: z.any(),
			}),
	)
	.handler(async ({ data: { messages, moduleId } }) => {
		const chatModule = await db.query.modules.findFirst({
			where: eq(modules.id, moduleId),
			with: {
				apiKey: true,
			},
		});
		if (!chatModule) throw new Error("Module not found");

		const [scenario, persona, chatContexts, behaviour] = await Promise.all([
			db.query.scenarios.findFirst({
				where: eq(scenarios.id, chatModule.data.scenarioId),
			}),
			db.query.personas.findFirst({
				where: eq(personas.id, chatModule.data.personaIds[0]),
			}),
			chatModule.data.contextIds &&
				db.query.contexts.findMany({
					where: inArray(contexts.id, chatModule.data.contextIds),
				}),
			db.query.behaviours.findFirst({
				where: eq(behaviours.id, chatModule.data.behaviourIds[0]),
			}),
		]);
		if (!scenario || !persona || !behaviour)
			throw new Error("Invalid scenario, persona, or behaviour");

		const prompt = getPrompt({
			scenario,
			persona,
			contexts: chatContexts,
			behaviour,
		});

		const openai = createOpenAI({
			apiKey: chatModule.apiKey.key,
		});

		const result = streamText({
			model: openai("gpt-4o"),
			system: prompt,
			experimental_output: Output.object({
				schema: ChatResponseSchema,
			}),
			messages: convertToModelMessages(messages),
		});

		return result.toUIMessageStreamResponse({
			messageMetadata: async ({ part }) => {
				if (part.type === "finish") {
					await db.insert(usages).values({
						id: Bun.randomUUIDv7(),
						organizationId: chatModule.organizationId,
						apiKeyId: chatModule.apiKeyId,
						moduleId: chatModule.id,
						data: {
							inputTokens: part.totalUsage.inputTokens,
							outputTokens: part.totalUsage.outputTokens,
							totalTokens: part.totalUsage.totalTokens,
							model: "gpt-4o",
						},
					});
				}
			},
		});
	});
