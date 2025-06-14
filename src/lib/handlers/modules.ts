import { db } from "@/lib/db";
import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { protectedMiddleware } from "./auth";
import { modules, scenarios } from "../db/schema";
import { ModuleDataSchema } from "../types/modules";

export const getModulesFn = createServerFn()
	.middleware([protectedMiddleware])
	.handler(async ({ context }) => {
		return await db.query.modules.findMany({
			where: eq(
				modules.organizationId,
				context.session.activeOrganizationId,
			),
		});
	});

export const getModuleFn = createServerFn()
	.validator(
		z.object({
			id: z.string(),
		}),
	)
	.handler(async ({ data: { id } }) => {
		const courseModule = await db.query.modules.findFirst({
			where: eq(modules.id, id),
		});
		if (!courseModule) {
			return null;
		}
		const scenario = await db.query.scenarios.findFirst({
			where: eq(scenarios.id, courseModule.data.scenarioId),
		});
		return { ...courseModule, instructions: scenario?.data.instructions };
	});

export const deleteModuleFn = createServerFn()
	.middleware([protectedMiddleware])
	.validator(z.object({ id: z.string() }))
	.handler(async ({ data: { id }, context }) => {
		await db
			.delete(modules)
			.where(
				and(
					eq(modules.id, id),
					eq(
						modules.organizationId,
						context.session.activeOrganizationId,
					),
				),
			);
	});

export const createOrUpdateModuleFn = createServerFn()
	.middleware([protectedMiddleware])
	.validator(
		ModuleDataSchema.extend({
			id: z.string().optional(),
			apiKeyId: z.string(),
		}),
	)
	.handler(async ({ data: { id, apiKeyId, ...data }, context }) => {
		const moduleId = id ?? Bun.randomUUIDv7();
		await db
			.insert(modules)
			.values({
				id: moduleId,
				data,
				apiKeyId,
				organizationId: context.session.activeOrganizationId,
			})
			.onConflictDoUpdate({
				target: [modules.id],
				set: {
					data,
				},
				setWhere: eq(
					modules.organizationId,
					context.session.activeOrganizationId,
				),
			});
		return {
			id: moduleId,
		};
	});
