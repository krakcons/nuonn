import {
	Outlet,
	HeadContent,
	Scripts,
	createRootRouteWithContext,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";

import type { QueryClient } from "@tanstack/react-query";
import {
	getI18nFn,
	IntlProvider,
	rootLocaleMiddleware,
} from "@/lib/locale.tsx";

interface MyRouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "Nuonn",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),
	beforeLoad: async ({ location }) => {
		return rootLocaleMiddleware({
			location,
		});
	},
	loader: async ({ context: { locale } }) => {
		const i18n = await getI18nFn({
			headers: {
				locale,
			},
		});

		return {
			i18n,
		};
	},
	component: RootDocument,
});

function RootDocument() {
	const { i18n } = Route.useLoaderData();
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<IntlProvider i18n={i18n}>
					<Outlet />
				</IntlProvider>
				<Scripts />
			</body>
		</html>
	);
}
