import { db } from "@/lib/db";
import { scenarios } from "@/lib/db/schema";
import { createServerFn } from "@tanstack/react-start";
import { ScenarioSchema } from "../ai";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const getScenariosFn = createServerFn().handler(async () => {
	return await db.query.scenarios.findMany();
});

export const getScenarioFn = createServerFn()
	.validator(
		z.object({
			id: z.string(),
		}),
	)
	.handler(async ({ data: { id } }) => {
		return await db.query.scenarios.findFirst({
			where: eq(scenarios.id, id),
		});
	});

export const deleteScenarioFn = createServerFn()
	.validator(z.object({ id: z.string() }))
	.handler(async ({ data: { id } }) => {
		await db.delete(scenarios).where(eq(scenarios.id, id));
	});

export const updateScenarioFn = createServerFn()
	.validator(ScenarioSchema.extend({ id: z.string().optional() }))
	.handler(async ({ data }) => {
		const id = data.id ?? Bun.randomUUIDv7();
		await db
			.insert(scenarios)
			.values({
				id,
				data,
			})
			.onConflictDoUpdate({
				target: [scenarios.id],
				set: {
					data,
				},
			});
		return {
			id,
		};
	});
