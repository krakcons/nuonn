import {
	Outlet,
	HeadContent,
	Scripts,
	createRootRouteWithContext,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";

import { useSuspenseQuery, type QueryClient } from "@tanstack/react-query";
import {
	getI18nFn,
	IntlProvider,
	rootLocaleMiddleware,
} from "@/lib/locale.tsx";
import { getThemeFn, getThemeQueryOptions } from "@/lib/theme";

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
				title: "Nuonn: AI Chat Engine",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
			{
				rel: "icon",
				href: "/logo.svg",
				type: "image/svg+xml",
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com",
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
			},
			{
				href: "https://fonts.googleapis.com/css2?family=Geist+Mono:wght@100..900&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
				rel: "stylesheet",
			},
		],
	}),
	beforeLoad: async ({ location }) => {
		// LOCALE
		return rootLocaleMiddleware({
			location,
		});
	},
	loader: async ({ context: { locale } }) => {
		return {
			// LOCALE
			i18n: await getI18nFn({
				headers: {
					locale,
				},
			}),
			// THEME
			theme: await getThemeFn(),
		};
	},
	component: RootDocument,
});

function RootDocument() {
	const {
		i18n,
		theme: { theme, systemTheme },
	} = Route.useLoaderData();

	return (
		<html className={theme === "system" ? systemTheme : theme}>
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
