import { createMiddleware, createServerFn } from "@tanstack/react-start";
import { getHeaders } from "@tanstack/react-start/server";
import { auth } from "../auth";

export const authMiddleware = createMiddleware().server(async ({ next }) => {
	const data = await auth.api.getSession({
		headers: getHeaders() as unknown as Headers,
	});
	return next({
		context: {
			session: data?.session,
			user: data?.user,
		},
	});
});

export const protectedMiddleware = createMiddleware()
	.middleware([authMiddleware])
	.server(async ({ next, context }) => {
		if (!context.session || !context.user) {
			throw new Error("Not authenticated");
		}
		if (!context.session.activeOrganizationId) {
			throw new Error("No active organization");
		}
		return next({
			context: {
				session: {
					...context.session,
					activeOrganizationId: context.session.activeOrganizationId,
				},
				user: context.user,
			},
		});
	});

export const getSessionFn = createServerFn()
	.middleware([authMiddleware])
	.handler(async ({ context }) => {
		return context;
	});
