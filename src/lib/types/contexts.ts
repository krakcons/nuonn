import { z } from "zod";

export const ContextSchema = z.object({
	name: z.string(),
	description: z.string(),
	user: z.string(),
	persona: z.string(),
});
export type ContextType = z.infer<typeof ContextSchema>;
