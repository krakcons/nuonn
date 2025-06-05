import { createServerFn } from "@tanstack/react-start";
import { protectedMiddleware } from "./auth";
import { db } from "../db";
import { eq, and } from "drizzle-orm";
import { contexts } from "../db/schema";
import { ContextDataSchema } from "../types/contexts";
import { z } from "zod";

export const getContextsFn = createServerFn()
	.middleware([protectedMiddleware])
	.handler(async ({ context }) => {
		return await db.query.contexts.findMany({
			where: eq(
				contexts.organizationId,
				context.session.activeOrganizationId,
			),
		});
	});

export const getContextFn = createServerFn()
	.middleware([protectedMiddleware])
	.validator(
		z.object({
			id: z.string(),
		}),
	)
	.handler(async ({ context, data }) => {
		return await db.query.contexts.findFirst({
			where: and(
				eq(contexts.id, data.id),
				eq(
					contexts.organizationId,
					context.session.activeOrganizationId,
				),
			),
		});
	});

export const createOrUpdateContextFn = createServerFn()
	.middleware([protectedMiddleware])
	.validator(ContextDataSchema.extend({ id: z.string().optional() }))
	.handler(async ({ context, data: { id, ...data } }) => {
		const contextId = id ?? Bun.randomUUIDv7();
		await db
			.insert(contexts)
			.values({
				id: contextId,
				organizationId: context.session.activeOrganizationId,
				data,
			})
			.onConflictDoUpdate({
				target: [contexts.id],
				set: {
					data,
					updatedAt: new Date(),
				},
				setWhere: eq(
					contexts.organizationId,
					context.session.activeOrganizationId,
				),
			});
		return {
			id: contextId,
		};
	});

export const deleteContextFn = createServerFn()
	.middleware([protectedMiddleware])
	.validator(z.object({ id: z.string() }))
	.handler(async ({ context, data }) => {
		return await db
			.delete(contexts)
			.where(
				and(
					eq(contexts.id, data.id),
					eq(
						contexts.organizationId,
						context.session.activeOrganizationId,
					),
				),
			);
	});
