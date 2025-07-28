import { z } from "zod";

export const ModuleDataSchema = z.object({
	name: z.string(),
	description: z.string().optional(),
	referrers: z.string().array(),
	scenarioId: z.string(),
	contextIds: z.string().array(),
	personaIds: z.string().array().min(1),
	behaviourIds: z.string().array().min(1),
});
export type ModuleDataType = z.infer<typeof ModuleDataSchema>;

export const ModuleSchema = z.object({
	id: z.string(),
	organizationId: z.string(),
	apiKeyId: z.string(),
	data: ModuleDataSchema,
	updatedAt: z.date(),
	createdAt: z.date(),
});
export type ModuleType = z.infer<typeof ModuleSchema>;
