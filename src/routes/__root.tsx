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
import { getThemeQueryOptions } from "@/lib/theme";

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
		return rootLocaleMiddleware({
			location,
		});
	},
	loader: async ({ context: { locale, queryClient } }) => {
		await queryClient.ensureQueryData(getThemeQueryOptions);

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
	const {
		data: { theme, systemTheme },
	} = useSuspenseQuery(getThemeQueryOptions);

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
