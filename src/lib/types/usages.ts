import z from "zod";

export const UsageDataSchema = z.object({
	inputTokens: z.number(),
	outputTokens: z.number(),
	totalTokens: z.number(),
	model: z.string(),
});
export type UsageDataType = z.infer<typeof UsageDataSchema>;
