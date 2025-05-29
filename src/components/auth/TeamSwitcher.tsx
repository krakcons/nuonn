import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { Link, useRouter } from "@tanstack/react-router";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocale, useTranslations } from "@/lib/locale";
import { authClient } from "@/lib/auth.client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronsUpDown, Plus } from "lucide-react";
import type { Organization } from "better-auth/plugins";

export const TeamSwitcher = ({
	organizations,
	activeOrganizationId,
}: {
	organizations: Organization[];
	activeOrganizationId: string;
}) => {
	const { isMobile } = useSidebar();
	const router = useRouter();
	const locale = useLocale();
	const t = useTranslations("TeamSwitcher");

	const organization = organizations.find(
		(organization) => organization.id === activeOrganizationId,
	);

	if (!organization) return null;

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<Avatar className="rounded-lg size-8">
								<AvatarImage
									src={organization?.logo ?? undefined}
									className="rounded-lg"
								/>
								<AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
									{organization?.name.toUpperCase()[0]}
								</AvatarFallback>
							</Avatar>
							<div className="flex-1 text-left text-sm leading-tight">
								{organization?.name}
							</div>
							<ChevronsUpDown className="ml-auto" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
						align="start"
						side={isMobile ? "bottom" : "right"}
						sideOffset={4}
					>
						<DropdownMenuLabel className="text-xs text-muted-foreground">
							{t.title}
						</DropdownMenuLabel>
						{organizations?.map((organization) => (
							<DropdownMenuItem
								key={organization.id}
								onClick={() => {
									authClient.organization.setActive({
										organizationId: organization.id,
										fetchOptions: {
											onSuccess: () => {
												router.invalidate();
											},
										},
									});
								}}
								className="gap-2 p-2"
							>
								<Avatar className="rounded-md size-8">
									<AvatarImage
										src={organization?.logo ?? undefined}
										className="rounded-md"
									/>
									<AvatarFallback className="rounded-md">
										{organization?.name.toUpperCase()[0]}
									</AvatarFallback>
								</Avatar>
								<p className="truncate flex-1">
									{organization?.name}
								</p>
							</DropdownMenuItem>
						))}
						<DropdownMenuSeparator />
						{/*<DropdownMenuItem className="gap-2 p-2" asChild>
							<Link
								to="/$locale/auth/create-team"
								params={{ locale }}
							>
								<div className="flex size-6 items-center justify-center rounded-md border bg-background">
									<Settings className="size-4" />
								</div>
								<div className="font-medium text-muted-foreground">
									Team Settings
								</div>
							</Link>
						</DropdownMenuItem>*/}
						<DropdownMenuItem className="gap-2 p-2" asChild>
							<Link
								to="/$locale/auth/create-team"
								params={{ locale }}
							>
								<div className="flex size-6 items-center justify-center rounded-md border bg-background">
									<Plus className="size-4" />
								</div>
								<div className="font-medium text-muted-foreground">
									{t.create}
								</div>
							</Link>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
};
