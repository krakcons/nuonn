import { db } from "@/lib/db";
import { personas } from "@/lib/db/schema";
import { createServerFn } from "@tanstack/react-start";
import { PersonaSchema } from "../ai";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const getPersonasFn = createServerFn().handler(async () => {
	return await db.query.personas.findMany();
});

export const getPersonaFn = createServerFn()
	.validator(
		z.object({
			id: z.string(),
		}),
	)
	.handler(async ({ data: { id } }) => {
		return await db.query.personas.findFirst({
			where: eq(personas.id, id),
		});
	});

export const deletePersonaFn = createServerFn()
	.validator(z.object({ id: z.string() }))
	.handler(async ({ data: { id } }) => {
		await db.delete(personas).where(eq(personas.id, id));
	});

export const updatePersonaFn = createServerFn({ method: "POST" })
	.validator(PersonaSchema.extend({ id: z.string().optional() }))
	.handler(async ({ data }) => {
		const id = data.id ?? Bun.randomUUIDv7();
		await db
			.insert(personas)
			.values({
				id,
				data,
			})
			.onConflictDoUpdate({
				target: [personas.id],
				set: {
					data,
				},
			});
		return {
			id,
		};
	});
