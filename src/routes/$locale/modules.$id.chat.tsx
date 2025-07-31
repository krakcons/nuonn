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
import { Check, ListTodo, Square, SquareCheck } from "lucide-react";
import { useTranslations } from "@/lib/locale";
import { ChatResponseType } from "@/lib/ai";
import { EvaluationType } from "@/lib/types/scenarios";

export const Route = createFileRoute("/$locale/modules/$id/chat")({
	component: RouteComponent,
	validateSearch: z.object({
		preview: z.boolean().optional(),
	}),
	loader: async ({ params: { id } }) => {
		const chatModule = await getModuleFn({
			data: { id },
		});
		if (!chatModule || !chatModule.scenario) {
			throw notFound();
		}
		return {
			chatModule: {
				...chatModule,
				scenario: chatModule.scenario,
			},
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

const EvaluationMenuItem = ({
	evaluation,
	responseEvaluation,
}: {
	evaluation: EvaluationType;
	responseEvaluation?: ChatResponseType["evaluations"][0];
}) => {
	const t = useTranslations("Chat");
	return (
		<SidebarMenuItem>
			<SidebarMenuButton
				isActive={responseEvaluation?.success}
				className="justify-between"
			>
				<span className="flex items-center gap-2">
					{responseEvaluation?.success ? (
						<SquareCheck className="size-4" />
					) : (
						<Square className="size-4" />
					)}
					{evaluation.name}
				</span>
				{responseEvaluation?.value && (
					<p className="text-muted-foreground">
						{responseEvaluation.value}
					</p>
				)}
			</SidebarMenuButton>
			<p className="px-2 text-xs text-muted-foreground">
				{evaluation.description}
			</p>
			<p className="px-2 text-xs text-muted-foreground">
				{t.sidebar.successValue} {evaluation.successValue}
			</p>
		</SidebarMenuItem>
	);
};

function RouteComponent() {
	const { chatModule } = Route.useLoaderData();
	const { preview = false } = Route.useSearch();
	const { sendEvent, messages: scormMessages } = useScorm();
	const [complete, setComplete] = useState(false);
	const [responseEvaluations, setResponseEvaluations] =
		useState<ChatResponseType["evaluations"]>();
	const t = useTranslations("Chat");

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
					moduleId={chatModule.id}
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
					onEvaluationChange={(evaluations) =>
						evaluations && setResponseEvaluations(evaluations)
					}
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
							style={{
								width: `${
									responseEvaluations?.length
										? 100 *
											(responseEvaluations.filter(
												(e) => e.success,
											).length /
												responseEvaluations.length)
										: 0
								}%`,
							}}
							className="h-full bg-primary"
						/>
					</div>
				</SidebarHeader>
				<SidebarContent>
					<SidebarGroup>
						<SidebarGroupLabel className="tracking-widest">
							{t.sidebar.userEvaluations}
						</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu className="gap-4">
								{chatModule.scenario?.data.user.evaluations.map(
									(s, i) => (
										<EvaluationMenuItem
											key={i}
											evaluation={s}
											responseEvaluation={responseEvaluations?.find(
												(e) => e.name === s.name,
											)}
										/>
									),
								)}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
					<SidebarGroup>
						<SidebarGroupLabel className="tracking-widest">
							{t.sidebar.personaEvaluations}
						</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu className="gap-4">
								{chatModule.scenario?.data.persona.evaluations.map(
									(s, i) => (
										<EvaluationMenuItem
											key={i}
											evaluation={s}
											responseEvaluation={responseEvaluations?.find(
												(e) => e.name === s.name,
											)}
										/>
									),
								)}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
					<SidebarGroup>
						<SidebarGroupLabel className="tracking-widest">
							{t.sidebar.instructions}
						</SidebarGroupLabel>
						<SidebarGroupContent className="px-2">
							{chatModule.scenario?.data.instructions}
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>
			</Sidebar>
		</SidebarProvider>
	);
}
