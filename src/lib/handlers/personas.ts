import { db } from "@/lib/db";
import { personas } from "@/lib/db/schema";
import { createServerFn } from "@tanstack/react-start";
import { PersonaSchema } from "@/lib/types/personas";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { protectedMiddleware } from "./auth";

export const getPersonasFn = createServerFn()
	.middleware([protectedMiddleware])
	.handler(async ({ context }) => {
		return await db.query.personas.findMany({
			where: eq(
				personas.organizationId,
				context.session.activeOrganizationId,
			),
		});
	});

export const getPersonaFn = createServerFn()
	.middleware([protectedMiddleware])
	.validator(
		z.object({
			id: z.string(),
		}),
	)
	.handler(async ({ data: { id }, context }) => {
		return await db.query.personas.findFirst({
			where: and(
				eq(personas.id, id),
				eq(
					personas.organizationId,
					context.session.activeOrganizationId,
				),
			),
		});
	});

export const deletePersonaFn = createServerFn()
	.middleware([protectedMiddleware])
	.validator(z.object({ id: z.string() }))
	.handler(async ({ data: { id }, context }) => {
		await db
			.delete(personas)
			.where(
				and(
					eq(personas.id, id),
					eq(
						personas.organizationId,
						context.session.activeOrganizationId,
					),
				),
			);
	});

export const createOrUpdatePersonaFn = createServerFn({ method: "POST" })
	.middleware([protectedMiddleware])
	.validator(PersonaSchema.extend({ id: z.string().optional() }))
	.handler(async ({ data, context }) => {
		const id = data.id ?? Bun.randomUUIDv7();
		await db
			.insert(personas)
			.values({
				id,
				data,
				organizationId: context.session.activeOrganizationId,
			})
			.onConflictDoUpdate({
				target: [personas.id],
				set: {
					data,
				},
				setWhere: eq(
					personas.organizationId,
					context.session.activeOrganizationId,
				),
			});
		return {
			id,
		};
	});
