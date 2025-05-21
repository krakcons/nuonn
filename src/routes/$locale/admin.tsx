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
	SidebarGroup,
	SidebarGroupAction,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarInset,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
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
	useNavigate,
} from "@tanstack/react-router";
import {
	FileVideo,
	LayoutDashboard,
	MessagesSquare,
	Plus,
	Users,
} from "lucide-react";
import { z } from "zod";

export const Route = createFileRoute("/$locale/admin")({
	component: RouteComponent,
	validateSearch: z.object({
		locale: LocaleSchema.optional(),
	}),
});

function RouteComponent() {
	const t = useTranslations("AdminSidebar");
	const locale = useLocale();
	const search = Route.useSearch();
	const editingLocale = search.locale ?? locale;
	const navigate = useNavigate();

	return (
		<div>
			<SidebarProvider>
				<Sidebar className="list-none">
					<SidebarHeader className="flex gap-2 items-center flex-row py-4">
						<img
							src="/logo512.png"
							alt="Nuonn Logo"
							className="h-10"
						/>
						<h1 className="text-2xl font-bold">Nuonn</h1>
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
													<MessagesSquare />
													{t.chat}
												</SidebarMenuButton>
											)}
										</Link>
									</SidebarMenuItem>
								</SidebarMenu>
							</SidebarGroupContent>
						</SidebarGroup>
						<SidebarGroup>
							<SidebarGroupLabel>{t.personas}</SidebarGroupLabel>
							<Link
								to="/$locale/admin/personas/create"
								from={Route.fullPath}
							>
								<SidebarGroupAction>
									<Plus />
								</SidebarGroupAction>
							</Link>
							<SidebarGroupContent>
								<SidebarMenu></SidebarMenu>
							</SidebarGroupContent>
						</SidebarGroup>
						<SidebarGroup>
							<SidebarGroupLabel>{t.scenarios}</SidebarGroupLabel>
							<Link
								to="/$locale/admin/scenarios/create"
								from={Route.fullPath}
							>
								<SidebarGroupAction>
									<Plus />
								</SidebarGroupAction>
							</Link>
							<SidebarGroupContent>
								<SidebarMenu></SidebarMenu>
							</SidebarGroupContent>
						</SidebarGroup>
					</SidebarContent>
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
