import { createRouter as createTanstackRouter } from "@tanstack/react-router";
import { routerWithQueryClient } from "@tanstack/react-router-with-query";
import * as TanstackQuery from "./root-provider";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

import "./styles.css";

// Create a new router instance
export const createRouter = () => {
	const router = routerWithQueryClient(
		createTanstackRouter({
			routeTree,
			// TODO: Add a default preload strategy, needs client caching
			// defaultPreload: "intent",
			context: {
				...TanstackQuery.getContext(),
			},
			scrollRestoration: true,
			defaultPreloadStaleTime: 0,
		}),
		TanstackQuery.getContext().queryClient,
	);

	return router;
};

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof createRouter>;
	}
}
