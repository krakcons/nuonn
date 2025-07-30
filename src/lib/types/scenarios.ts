import { z } from "zod";

export const EvaluationSchema = z.object({
	name: z.string(),
	description: z.string(),
	type: z.enum(["message", "session"]),
	initialValue: z.string(),
	successValue: z.string(),
	measure: z.string(),
});
export type EvaluationType = z.infer<typeof EvaluationSchema>;

export const ScenarioDataSchema = z.object({
	name: z.string(),
	description: z.string(),
	instructions: z.string().optional(),
	persona: z.object({
		role: z.string(),
		goals: z.string(),
		evaluations: EvaluationSchema.array(),
	}),
	user: z.object({
		role: z.string(),
		goals: z.string(),
		evaluations: EvaluationSchema.array(),
	}),
});
export type ScenarioDataType = z.infer<typeof ScenarioDataSchema>;

export const ScenarioSchema = z.object({
	id: z.string(),
	organizationId: z.string(),
	data: ScenarioDataSchema,
	updatedAt: z.date(),
	createdAt: z.date(),
});
export type ScenarioType = z.infer<typeof ScenarioSchema>;
