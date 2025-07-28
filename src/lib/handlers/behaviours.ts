import { db } from "@/lib/db";
import { behaviours } from "@/lib/db/schema";
import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { protectedMiddleware } from "./auth";
import { BehaviourDataSchema } from "../types/behaviours";

export const getBehavioursFn = createServerFn()
	.middleware([protectedMiddleware])
	.handler(async ({ context }) => {
		return await db.query.behaviours.findMany({
			where: eq(
				behaviours.organizationId,
				context.session.activeOrganizationId,
			),
		});
	});

export const getBehaviourFn = createServerFn()
	.middleware([protectedMiddleware])
	.validator(
		z.object({
			id: z.string(),
		}),
	)
	.handler(async ({ data: { id }, context }) => {
		return await db.query.behaviours.findFirst({
			where: and(
				eq(behaviours.id, id),
				eq(
					behaviours.organizationId,
					context.session.activeOrganizationId,
				),
			),
		});
	});

export const deleteBehaviourFn = createServerFn()
	.middleware([protectedMiddleware])
	.validator(z.object({ id: z.string() }))
	.handler(async ({ data: { id }, context }) => {
		await db
			.delete(behaviours)
			.where(
				and(
					eq(behaviours.id, id),
					eq(
						behaviours.organizationId,
						context.session.activeOrganizationId,
					),
				),
			);
	});

export const createOrUpdateBehaviourFn = createServerFn({ method: "POST" })
	.middleware([protectedMiddleware])
	.validator(BehaviourDataSchema.extend({ id: z.string().optional() }))
	.handler(async ({ data: { id, ...data }, context }) => {
		const behaviourId = id ?? Bun.randomUUIDv7();
		await db
			.insert(behaviours)
			.values({
				id: behaviourId,
				data,
				organizationId: context.session.activeOrganizationId,
			})
			.onConflictDoUpdate({
				target: [behaviours.id],
				set: {
					data,
				},
				setWhere: eq(
					behaviours.organizationId,
					context.session.activeOrganizationId,
				),
			});
		return {
			id: behaviourId,
		};
	});
