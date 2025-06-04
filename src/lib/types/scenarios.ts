import { z } from "zod";

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
		goals: z.string(),
		evaluations: EvaluationSchema.array(),
	}),
	user: z.object({
		role: z.string(),
		goals: z.string(),
		evaluations: EvaluationSchema.array(),
	}),
});
export type ScenarioType = z.infer<typeof ScenarioSchema>;
