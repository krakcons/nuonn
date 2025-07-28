import { z } from "zod";

export const BehaviourDataSchema = z.object({
	name: z.string(),
	description: z.string(),
	rapportBuilding: z.number(),
	rapportLoss: z.number(),
	dishonesty: z.number(),
});
export type BehaviourDataType = z.infer<typeof BehaviourDataSchema>;

export const BehaviourSchema = z.object({
	id: z.string(),
	organizationId: z.string(),
	data: BehaviourDataSchema,
	updatedAt: z.date(),
	createdAt: z.date(),
});
export type BehaviourType = z.infer<typeof BehaviourSchema>;
