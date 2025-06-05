import { z } from "zod";

export const ContextDataSchema = z.object({
	name: z.string(),
	description: z.string(),
	user: z.string(),
	persona: z.string(),
});
export type ContextDataType = z.infer<typeof ContextDataSchema>;

export const ContextSchema = z.object({
	id: z.string(),
	organizationId: z.string(),
	data: ContextDataSchema,
	updatedAt: z.date(),
	createdAt: z.date(),
});
export type ContextType = z.infer<typeof ContextSchema>;
