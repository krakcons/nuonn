import { db } from "@/lib/db";
import { scenarios } from "@/lib/db/schema";
import { createServerFn } from "@tanstack/react-start";
import { ScenarioSchema } from "@/lib/types/scenarios";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { protectedMiddleware } from "./auth";

export const getScenariosFn = createServerFn()
	.middleware([protectedMiddleware])
	.handler(async ({ context }) => {
		return await db.query.scenarios.findMany({
			where: eq(
				scenarios.organizationId,
				context.session.activeOrganizationId,
			),
		});
	});

export const getScenarioFn = createServerFn()
	.middleware([protectedMiddleware])
	.validator(
		z.object({
			id: z.string(),
		}),
	)
	.handler(async ({ data: { id }, context }) => {
		return await db.query.scenarios.findFirst({
			where: and(
				eq(scenarios.id, id),
				eq(
					scenarios.organizationId,
					context.session.activeOrganizationId,
				),
			),
		});
	});

export const deleteScenarioFn = createServerFn()
	.middleware([protectedMiddleware])
	.validator(z.object({ id: z.string() }))
	.handler(async ({ data: { id }, context }) => {
		await db
			.delete(scenarios)
			.where(
				and(
					eq(scenarios.id, id),
					eq(
						scenarios.organizationId,
						context.session.activeOrganizationId,
					),
				),
			);
	});

export const createOrUpdateScenarioFn = createServerFn()
	.middleware([protectedMiddleware])
	.validator(ScenarioSchema.extend({ id: z.string().optional() }))
	.handler(async ({ data, context }) => {
		const id = data.id ?? Bun.randomUUIDv7();
		await db
			.insert(scenarios)
			.values({
				id,
				data,
				organizationId: context.session.activeOrganizationId,
			})
			.onConflictDoUpdate({
				target: [scenarios.id],
				set: {
					data,
				},
				setWhere: eq(
					scenarios.organizationId,
					context.session.activeOrganizationId,
				),
			});
		return {
			id,
		};
	});
