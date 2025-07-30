import { TeamSwitcher } from "@/components/auth/TeamSwitcher";
import { UserButton } from "@/components/auth/UserButton";
import { LocaleToggle } from "@/components/LocaleToggle";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupAction,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarInset,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { getOrganizationsFn, getSessionFn } from "@/lib/handlers/auth";
import { getBehavioursFn } from "@/lib/handlers/behaviours";
import { getContextsFn } from "@/lib/handlers/contexts";
import { getModulesFn } from "@/lib/handlers/modules";
import { getPersonasFn } from "@/lib/handlers/personas";
import { getScenariosFn } from "@/lib/handlers/scenarios";
import {
	locales,
	LocaleSchema,
	useLocale,
	useTranslations,
	type Locale,
} from "@/lib/locale";
import {
	createFileRoute,
	Link,
	Outlet,
	redirect,
	useNavigate,
} from "@tanstack/react-router";
import {
	Component,
	FileVideo,
	HelpCircle,
	Key,
	LayoutDashboard,
	Plus,
	Smile,
	User,
} from "lucide-react";
import { z } from "zod";

export const Route = createFileRoute("/$locale/admin")({
	component: RouteComponent,
	validateSearch: z.object({
		locale: LocaleSchema.optional(),
	}),
	beforeLoad: async () => {
		const { session, user } = await getSessionFn();
		return { session, user };
	},
	loader: async ({ context: { session, user }, params }) => {
		if (!session || !user) {
			throw redirect({
				to: "/$locale/auth/login",
				params,
			});
		}

		if (!session.activeOrganizationId) {
			throw redirect({
				to: "/$locale/auth/create-team",
				params,
			});
		}

		const [
			personas,
			behaviours,
			scenarios,
			organizations,
			contexts,
			modules,
		] = await Promise.all([
			getPersonasFn(),
			getBehavioursFn(),
			getScenariosFn(),
			getOrganizationsFn(),
			getContextsFn(),
			getModulesFn(),
		]);

		return {
			personas,
			behaviours,
			scenarios,
			organizations,
			contexts,
			user,
			modules,
			session: {
				...session,
				activeOrganizationId: session.activeOrganizationId,
			},
		};
	},
});

function RouteComponent() {
	const t = useTranslations("AdminSidebar");
	const locale = useLocale();
	const search = Route.useSearch();
	const editingLocale = search.locale ?? locale;
	const navigate = useNavigate();
	const {
		personas,
		behaviours,
		scenarios,
		organizations,
		user,
		session,
		contexts,
		modules,
	} = Route.useLoaderData();

	return (
		<div>
			<SidebarProvider>
				<Sidebar className="list-none">
					<SidebarHeader className="flex gap-2 items-center flex-row py-4">
						<TeamSwitcher
							organizations={organizations}
							activeOrganizationId={session.activeOrganizationId}
						/>
					</SidebarHeader>
					<Separator />
					<SidebarContent>
						<SidebarGroup>
							<SidebarGroupContent>
								<SidebarMenu>
									<SidebarMenuItem>
										<Link
											to="/$locale/admin"
											from={Route.fullPath}
											activeOptions={{ exact: true }}
										>
											{({ isActive }) => (
												<SidebarMenuButton
													isActive={isActive}
												>
													<LayoutDashboard />
													{t.dashboard}
												</SidebarMenuButton>
											)}
										</Link>
									</SidebarMenuItem>
								</SidebarMenu>
							</SidebarGroupContent>
						</SidebarGroup>
						<SidebarGroup>
							<SidebarGroupLabel className="flex justify-between gap-2 pr-7">
								{t.modules.title}
								<Tooltip>
									<TooltipTrigger>
										<HelpCircle className="size-4" />
									</TooltipTrigger>
									<TooltipContent>
										{t.modules.tooltip}
									</TooltipContent>
								</Tooltip>
							</SidebarGroupLabel>
							<Link
								to="/$locale/admin/modules/create"
								from={Route.fullPath}
							>
								<SidebarGroupAction>
									<Plus />
								</SidebarGroupAction>
							</Link>
							<SidebarGroupContent>
								<SidebarMenu>
									{modules.map((modules) => (
										<SidebarMenuItem key={modules.id}>
											<Link
												to="/$locale/admin/modules/$id"
												from={Route.fullPath}
												params={{ id: modules.id }}
											>
												{({ isActive }) => (
													<SidebarMenuButton
														isActive={isActive}
													>
														<Component />
														<p className="truncate">
															{modules.data.name}
														</p>
													</SidebarMenuButton>
												)}
											</Link>
										</SidebarMenuItem>
									))}
								</SidebarMenu>
							</SidebarGroupContent>
						</SidebarGroup>
						<SidebarGroup>
							<SidebarGroupLabel className="flex justify-between gap-2 pr-7">
								{t.personas.title}
								<Tooltip>
									<TooltipTrigger>
										<HelpCircle className="size-4" />
									</TooltipTrigger>
									<TooltipContent>
										{t.personas.tooltip}
									</TooltipContent>
								</Tooltip>
							</SidebarGroupLabel>
							<Link
								to="/$locale/admin/characters/create"
								from={Route.fullPath}
							>
								<SidebarGroupAction>
									<Plus />
								</SidebarGroupAction>
							</Link>
							<SidebarGroupContent>
								<SidebarMenu>
									{personas.map((persona) => (
										<SidebarMenuItem key={persona.id}>
											<Link
												to="/$locale/admin/characters/$id"
												from={Route.fullPath}
												params={{ id: persona.id }}
											>
												{({ isActive }) => (
													<SidebarMenuButton
														isActive={isActive}
													>
														<User />
														<p className="truncate">
															{persona.data.name}
														</p>
													</SidebarMenuButton>
												)}
											</Link>
										</SidebarMenuItem>
									))}
								</SidebarMenu>
							</SidebarGroupContent>
						</SidebarGroup>
						<SidebarGroup>
							<SidebarGroupLabel className="flex justify-between gap-2 pr-7">
								{t.behaviours.title}
								<Tooltip>
									<TooltipTrigger>
										<HelpCircle className="size-4" />
									</TooltipTrigger>
									<TooltipContent>
										{t.behaviours.tooltip}
									</TooltipContent>
								</Tooltip>
							</SidebarGroupLabel>
							<Link
								to="/$locale/admin/behaviours/create"
								from={Route.fullPath}
							>
								<SidebarGroupAction>
									<Plus />
								</SidebarGroupAction>
							</Link>
							<SidebarGroupContent>
								<SidebarMenu>
									{behaviours.map((behaviour) => (
										<SidebarMenuItem key={behaviour.id}>
											<Link
												to="/$locale/admin/behaviours/$id"
												from={Route.fullPath}
												params={{ id: behaviour.id }}
											>
												{({ isActive }) => (
													<SidebarMenuButton
														isActive={isActive}
													>
														<Smile />
														<p className="truncate">
															{
																behaviour.data
																	.name
															}
														</p>
													</SidebarMenuButton>
												)}
											</Link>
										</SidebarMenuItem>
									))}
								</SidebarMenu>
							</SidebarGroupContent>
						</SidebarGroup>
						<SidebarGroup>
							<SidebarGroupLabel className="flex justify-between gap-2 pr-7">
								{t.scenarios.title}
								<Tooltip>
									<TooltipTrigger>
										<HelpCircle className="size-4" />
									</TooltipTrigger>
									<TooltipContent>
										{t.scenarios.tooltip}
									</TooltipContent>
								</Tooltip>
							</SidebarGroupLabel>
							<Link
								to="/$locale/admin/scenarios/create"
								from={Route.fullPath}
							>
								<SidebarGroupAction>
									<Plus />
								</SidebarGroupAction>
							</Link>
							<SidebarGroupContent>
								<SidebarMenu>
									{scenarios.map((scenario) => (
										<SidebarMenuItem key={scenario.id}>
											<Link
												to="/$locale/admin/scenarios/$id"
												from={Route.fullPath}
												params={{ id: scenario.id }}
											>
												{({ isActive }) => (
													<SidebarMenuButton
														isActive={isActive}
													>
														<FileVideo />
														<p className="truncate">
															{scenario.data.name}
														</p>
													</SidebarMenuButton>
												)}
											</Link>
										</SidebarMenuItem>
									))}
								</SidebarMenu>
							</SidebarGroupContent>
						</SidebarGroup>
						<SidebarGroup>
							<SidebarGroupLabel className="flex justify-between gap-2 pr-7">
								{t.contexts.title}
								<Tooltip>
									<TooltipTrigger>
										<HelpCircle className="size-4" />
									</TooltipTrigger>
									<TooltipContent>
										{t.contexts.tooltip}
									</TooltipContent>
								</Tooltip>
							</SidebarGroupLabel>
							<Link
								to="/$locale/admin/contexts/create"
								from={Route.fullPath}
							>
								<SidebarGroupAction>
									<Plus />
								</SidebarGroupAction>
							</Link>
							<SidebarGroupContent>
								<SidebarMenu>
									{contexts.map((context) => (
										<SidebarMenuItem key={context.id}>
											<Link
												to="/$locale/admin/contexts/$id"
												from={Route.fullPath}
												params={{ id: context.id }}
											>
												{({ isActive }) => (
													<SidebarMenuButton
														isActive={isActive}
													>
														{context.data.type ===
														"character" ? (
															<User />
														) : (
															<FileVideo />
														)}
														<p className="truncate">
															{context.data.name}
														</p>
													</SidebarMenuButton>
												)}
											</Link>
										</SidebarMenuItem>
									))}
								</SidebarMenu>
							</SidebarGroupContent>
						</SidebarGroup>
						<SidebarGroup>
							<SidebarGroupLabel>{t.settings}</SidebarGroupLabel>
							<SidebarGroupContent>
								<SidebarMenu>
									<SidebarMenuItem>
										<Link
											to={`/$locale/admin/api-keys`}
											from={Route.fullPath}
										>
											{({ isActive }) => (
												<SidebarMenuButton
													isActive={isActive}
												>
													<Key />
													{t.apiKeys}
												</SidebarMenuButton>
											)}
										</Link>
									</SidebarMenuItem>
								</SidebarMenu>
							</SidebarGroupContent>
						</SidebarGroup>
					</SidebarContent>
					<SidebarFooter>
						<UserButton user={user} />
					</SidebarFooter>
				</Sidebar>
				<SidebarInset className="max-w-full overflow-hidden">
					<header className="p-4 flex flex-row w-full items-center justify-between">
						<SidebarTrigger />
						<div className="flex flex-row items-center gap-2">
							<Select
								value={editingLocale}
								onValueChange={(value) => {
									navigate({
										to: ".",
										search: (s) => ({
											...s,
											locale: value as Locale,
										}),
									});
								}}
							>
								<SelectTrigger className="gap-1 min-w-38">
									<p className="text-sm text-muted-foreground">
										{t.editing}
									</p>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{locales.map(({ label, value }) => (
										<SelectItem key={value} value={value}>
											{label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<LocaleToggle />
						</div>
					</header>
					<Outlet />
				</SidebarInset>
			</SidebarProvider>
		</div>
	);
}
