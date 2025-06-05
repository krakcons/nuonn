import { createServerFn } from "@tanstack/react-start";
import { protectedMiddleware } from "./auth";
import { db } from "../db";
import { eq, and } from "drizzle-orm";
import { apiKeys, modules } from "../db/schema";
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
		const moduleList = await db.query.modules.findMany({
			where: and(
				eq(
					modules.organizationId,
					context.session.activeOrganizationId,
				),
				eq(modules.apiKeyId, data.id),
			),
		});

		if (moduleList.length > 0) {
			throw new Error(
				`Cannot delete API key, it is in use by ${moduleList.length} module(s)`,
			);
		}

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
