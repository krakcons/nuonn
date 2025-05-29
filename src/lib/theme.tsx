import {
	queryOptions,
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { useLoaderData, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie } from "@tanstack/react-start/server";
import { z } from "zod";

// Edit to fit your needs (warning: system theme causes flash on initial load when not default, due to non blocking)
const DEFAULT_THEME: Theme = "light";

// Types and constants
export const themes = ["light", "dark", "system"] as const;
export const themeSchema = z.enum(themes);

export type Theme = "light" | "dark" | "system";
export type SystemTheme = "dark" | "light";

// Persistence
export const getThemeFn = createServerFn({ method: "GET" }).handler(() => {
	return {
		theme: (getCookie("theme") as Theme | undefined) ?? DEFAULT_THEME,
		systemTheme:
			(getCookie("systemTheme") as SystemTheme | undefined) ??
			DEFAULT_THEME,
	};
});

export const setThemeFn = createServerFn({ method: "POST" })
	.validator(
		z.object({
			theme: z.enum(["light", "dark", "system"]),
			systemTheme: z.enum(["dark", "light"]),
		}),
	)
	.handler(({ data: { theme, systemTheme } }) => {
		setCookie("theme", theme, {
			httpOnly: true,
			sameSite: "lax",
		});
		setCookie("systemTheme", systemTheme, {
			httpOnly: true,
			sameSite: "lax",
		});
	});

export const getThemeQueryOptions = queryOptions({
	queryKey: ["theme"],
	queryFn: getThemeFn,
});

export const useTheme = () => {
	const router = useRouter();

	const {
		theme: { theme, systemTheme },
	} = useLoaderData({ from: "__root__" });

	const updateTheme = useMutation({
		mutationFn: setThemeFn,
		onSuccess: () => {
			router.invalidate();
		},
	});

	const changeTheme = () => {
		const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
			.matches
			? "dark"
			: "light";
		const themeIndex = themes.indexOf(theme);
		if (themeIndex === themes.length - 1) {
			updateTheme.mutate({
				data: { theme: themes[0], systemTheme },
			});
		} else {
			updateTheme.mutate({
				data: { theme: themes[themeIndex + 1], systemTheme },
			});
		}
	};

	return {
		theme,
		systemTheme,
		changeTheme,
	};
};
