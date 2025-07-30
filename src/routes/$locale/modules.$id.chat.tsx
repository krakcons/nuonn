import { getModuleFn } from "@/lib/handlers/modules";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { useScorm } from "@/lib/scorm";
import { useEffect, useMemo, useState } from "react";
import { Chat } from "@/components/Chat";
import z from "zod";
import {
	Sidebar,
	SidebarInset,
	SidebarProvider,
	SidebarMenu,
	SidebarMenuItem,
	SidebarHeader,
	SidebarMenuButton,
	SidebarContent,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarGroupContent,
	useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Check, ListTodo } from "lucide-react";

export const Route = createFileRoute("/$locale/modules/$id/chat")({
	component: RouteComponent,
	validateSearch: z.object({
		preview: z.boolean().optional(),
	}),
	loader: async ({ params: { id } }) => {
		const chatModule = await getModuleFn({
			data: { id },
		});
		if (!chatModule) {
			throw notFound();
		}
		return {
			chatModule,
		};
	},
});

const SidebarIcon = () => {
	const { toggleSidebar } = useSidebar();
	return (
		<Button
			size="icon"
			onClick={() => toggleSidebar()}
			className="absolute top-4 right-4"
		>
			<ListTodo className="size-4" />
		</Button>
	);
};

function RouteComponent() {
	const { chatModule } = Route.useLoaderData();
	const { preview = false } = Route.useSearch();
	const { sendEvent, messages: scormMessages } = useScorm();
	const [complete, setComplete] = useState(false);

	useEffect(() => {
		sendEvent("LMSInitialize");
		sendEvent("LMSGetValue", "cmi.core.suspend_data");
		sendEvent("LMSGetValue", "cmi.core.lesson_status");
	}, []);

	const { initialMessages, isComplete, isLoading } = useMemo(() => {
		const data = scormMessages.find(
			(m) =>
				m.event.method === "LMSGetValue" &&
				m.response &&
				m.event.parameter === "cmi.core.suspend_data",
		);
		const initialMessages = data?.response?.result;
		const isComplete =
			scormMessages.find(
				(m) =>
					m.event.method === "LMSGetValue" &&
					m.response &&
					m.event.parameter === "cmi.core.lesson_status",
			)?.response?.result === "completed";
		return {
			data,
			isLoading: preview ? false : !data,
			initialMessages,
			isComplete,
		};
	}, [scormMessages]);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<SidebarProvider>
			<SidebarInset className="relative">
				<SidebarIcon />
				<Chat
					additionalBody={{
						moduleId: chatModule.id,
					}}
					initialMessages={
						initialMessages ? JSON.parse(initialMessages) : []
					}
					complete={complete || isComplete}
					onChange={(messages) => {
						sendEvent("LMSSetValue", {
							element: "cmi.core.suspend_data",
							value: JSON.stringify(messages),
						});
					}}
					onComplete={() => {
						setComplete(true);
						sendEvent("LMSSetValue", {
							element: "cmi.core.lesson_status",
							value: "completed",
						});
					}}
				/>
			</SidebarInset>
			<Sidebar side="right" variant="sidebar">
				<SidebarHeader>
					<h4>{chatModule.scenario?.data.name}</h4>
					<div className="bg-zinc-300 h-4 overflow-hidden">
						<div
							style={{ width: `${100 * 0.75}%` }}
							className="h-full bg-primary"
						/>
					</div>
				</SidebarHeader>
				<SidebarContent>
					<SidebarGroup>
						<SidebarGroupLabel>USER EVALUATIONS</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{chatModule.scenario?.data.user.evaluations.map(
									(s, i) => (
										<SidebarMenuItem key={i}>
											<SidebarMenuButton
												isActive={true}
												className="justify-between"
											>
												{s.name}
												<Check />
											</SidebarMenuButton>
										</SidebarMenuItem>
									),
								)}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
					<SidebarGroup>
						<SidebarGroupLabel>
							PERSONA EVALUATIONS
						</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{chatModule.scenario?.data.persona.evaluations.map(
									(s, i) => (
										<SidebarMenuItem key={i}>
											<SidebarMenuButton isActive={false}>
												{s.name}
											</SidebarMenuButton>
										</SidebarMenuItem>
									),
								)}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
					<SidebarGroup>
						<SidebarGroupLabel>INSTRUCTIONS</SidebarGroupLabel>
						<SidebarGroupContent className="px-2">
							{chatModule.scenario?.data.instructions}
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>
			</Sidebar>
		</SidebarProvider>
	);
}
