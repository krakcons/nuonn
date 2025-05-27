import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import {
	LogOutIcon,
	Moon,
	MoreVerticalIcon,
	Sun,
	SunMoon,
	UserCircleIcon,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "../ui/dialog";
import { cn } from "@/lib/utils";
import { useTranslations } from "@/lib/locale";
import { type Theme, themes, useTheme } from "@/lib/theme";
import { authClient } from "@/lib/auth.client";
import { useState } from "react";
import { useAppForm } from "@/components/ui/form";
import { useNavigate } from "@tanstack/react-router";

type UserFormType = {
	name: string;
};

export const UserForm = ({
	defaultValues,
	onSubmit,
}: {
	defaultValues?: UserFormType;
	onSubmit: (values: UserFormType) => Promise<any>;
}) => {
	const t = useTranslations("UserForm");
	const form = useAppForm({
		defaultValues: {
			name: "",
			description: "",
			completionStatus: "either",
			...defaultValues,
		} as UserFormType,
		onSubmit: ({ value }) => onSubmit(value),
	});

	return (
		<form.AppForm>
			<form.BlockNavigation />
			<form onSubmit={(e) => e.preventDefault()} className="space-y-8">
				<form.AppField name="name">
					{(field) => <field.TextField label={"Name"} />}
				</form.AppField>
				<form.SubmitButton />
			</form>
		</form.AppForm>
	);
};

const ThemeIcon = ({ theme }: { theme: Theme }) => {
	switch (theme) {
		case "light":
			return <Sun />;
		case "dark":
			return <Moon />;
		case "system":
			return <SunMoon />;
	}
};

export const UserButton = () => {
	const { theme, setTheme } = useTheme();
	const { isMobile } = useSidebar();
	const { data } = authClient.useSession();
	const [accountDialog, setAccountDialog] = useState(false);
	const t = useTranslations("UserButton");
	const tUserForm = useTranslations("UserForm");
	const navigate = useNavigate();

	const user = data?.user;
	const initials =
		user?.name[0]?.toUpperCase() ?? user?.email[0].toUpperCase() ?? "U";

	const changeTheme = () => {
		const themeIndex = themes.indexOf(theme);
		if (themeIndex === themes.length - 1) {
			setTheme(themes[0]);
		} else {
			setTheme(themes[themeIndex + 1]);
		}
	};

	if (!user) return null;

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<Avatar className="rounded-none">
								<AvatarFallback className="rounded-none bg-primary text-primary-foreground">
									{initials}
								</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-sm leading-tight">
								{user.name && (
									<span className="truncate font-medium">
										{user.name}
									</span>
								)}
								<span
									className={cn(
										"truncate text-xs",
										user.name && "text-muted-foreground",
									)}
								>
									{user.email}
								</span>
							</div>
							<MoreVerticalIcon className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={4}
					>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<Avatar className="rounded-none">
									<AvatarFallback className="rounded-none bg-primary text-primary-foreground">
										{initials}
									</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									{user.name && (
										<span className="truncate font-medium">
											{user.name}
										</span>
									)}
									<span
										className={cn(
											"truncate text-xs",
											user.name &&
												"text-muted-foreground",
										)}
									>
										{user.email}
									</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem
								onSelect={(e) => {
									e.preventDefault();
									changeTheme();
								}}
							>
								<ThemeIcon theme={theme} />
								{t.theme.label} ({t.theme[theme]})
							</DropdownMenuItem>
							<DropdownMenuItem
								onSelect={() => setAccountDialog(true)}
							>
								<UserCircleIcon />
								{t.account}
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onSelect={() =>
								authClient.signOut({
									fetchOptions: {
										onSuccess: () => {
											navigate({
												href: "/",
											});
										},
									},
								})
							}
						>
							<LogOutIcon />
							{t.signout}
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
				<Dialog
					open={accountDialog}
					onOpenChange={(open) => setAccountDialog(open)}
				>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>{tUserForm.title}</DialogTitle>
							<DialogDescription>
								{tUserForm.description}
							</DialogDescription>
						</DialogHeader>
						<UserForm
							defaultValues={{
								name: user.name ?? "",
							}}
							onSubmit={(data) =>
								authClient.updateUser({
									...data,
								})
							}
						/>
					</DialogContent>
				</Dialog>
			</SidebarMenuItem>
		</SidebarMenu>
	);
};
