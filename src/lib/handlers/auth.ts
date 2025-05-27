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

export const getSessionFn = createServerFn()
	.middleware([authMiddleware])
	.handler(async ({ context }) => {
		return context;
	});
