import { createServerFn } from "@tanstack/react-start";
import { protectedMiddleware } from "./auth";
import { db } from "../db";
import { eq, and } from "drizzle-orm";
import { apiKeys } from "../db/schema";
import { ApiKeyFormSchema, ApiKeySchema } from "@/lib/types/apiKeys";

export const getApiKeysFn = createServerFn()
	.middleware([protectedMiddleware])
	.handler(async ({ context }) => {
		return await db.query.apiKeys.findMany({
			where: eq(
				apiKeys.organizationId,
				context.session.activeOrganizationId,
			),
		});
	});

export const createOrUpdateApiKeyFn = createServerFn()
	.middleware([protectedMiddleware])
	.validator(ApiKeyFormSchema)
	.handler(async ({ context, data }) => {
		const id = data.id ?? Bun.randomUUIDv7();
		return await db
			.insert(apiKeys)
			.values({
				...data,
				id,
				organizationId: context.session.activeOrganizationId,
			})
			.onConflictDoUpdate({
				target: [apiKeys.id],
				set: {
					key: data.key,
					provider: data.provider,
					updatedAt: new Date(),
				},
				setWhere: eq(
					apiKeys.organizationId,
					context.session.activeOrganizationId,
				),
			});
	});

export const deleteApiKeyFn = createServerFn()
	.middleware([protectedMiddleware])
	.validator(ApiKeySchema.pick({ id: true }))
	.handler(async ({ context, data }) => {
		return await db
			.delete(apiKeys)
			.where(
				and(
					eq(apiKeys.id, data.id),
					eq(
						apiKeys.organizationId,
						context.session.activeOrganizationId,
					),
				),
			);
	});
