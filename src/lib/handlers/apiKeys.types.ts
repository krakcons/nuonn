import { z } from "zod";

export const ApiKeySchema = z.object({
	id: z.string(),
	name: z.string(),
	key: z.string(),
	provider: z.enum(["openai"]),
	createdAt: z.date(),
	updatedAt: z.date(),
});
export type ApiKeyType = z.infer<typeof ApiKeySchema>;

export const ApiKeyFormSchema = ApiKeySchema.omit({
	updatedAt: true,
	createdAt: true,
}).extend({ id: z.string().optional() });
export type ApiKeyFormType = z.infer<typeof ApiKeyFormSchema>;
