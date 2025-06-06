import { Page } from "@/components/Page";
import { getModuleFn } from "@/lib/handlers/modules";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { useAppForm } from "@/components/ui/form";
import { type Message, useChat } from "@ai-sdk/react";
import { parsePartialJson } from "@ai-sdk/ui-utils";
import { z } from "zod";
import { getChatResponseFn } from "@/lib/handlers/chat";
import {
	ChatInputSchema,
	type ChatInputType,
	type ChatResponseType,
} from "@/lib/ai";
import { useScorm } from "@/lib/scorm";
import { useEffect } from "react";

export const Route = createFileRoute("/$locale/modules/$id/play")({
	component: RouteComponent,
	loader: async ({ params: { id } }) => {
		const chatModule = await getModuleFn({
			data: { id },
		});
		if (!chatModule) throw notFound();
		return Promise.all([chatModule]);
	},
});

const parseAssistantMessage = (
	message: Message,
): ChatResponseType | undefined => {
	const parsedMessage = parsePartialJson(message.content);

	const { value, state } = parsedMessage as {
		value: ChatResponseType | null;
		state: string;
	};

	if (value && ["repaired-parse", "successful-parse"].includes(state)) {
		return value;
	}

	return undefined;
};

const Chat = ({
	initialMessages,
	scenarioId,
	personaIds,
	contextIds,
	onChange,
}: {
	initialMessages?: Message[];
	scenarioId: string;
	personaIds: string[];
	contextIds: string[];
	onChange?: (messages: Message[]) => void;
}) => {
	const { append, status, messages } = useChat({
		initialMessages: initialMessages ?? [],
		// @ts-ignore
		fetch: (_, options) => {
			const body = JSON.parse(options!.body! as string);
			return getChatResponseFn({
				data: body,
			});
		},
	});
	const form = useAppForm({
		defaultValues: {
			content: "",
			scenarioId,
			personaId:
				personaIds[Math.floor(Math.random() * personaIds.length)],
			contextIds,
		} as ChatInputType & { content: string },
		validators: {
			onSubmit: ChatInputSchema.extend({ content: z.string().min(1) }),
		},
		onSubmit: ({ value: { content, ...body }, formApi }) => {
			append(
				{
					role: "user",
					content,
				},
				{
					body,
				},
			);
			formApi.reset();
		},
	});

	const reversedMessages = messages.slice().reverse();

	useEffect(() => {
		if (status !== "ready" || !onChange) return;
		onChange(messages);
	}, [messages, status]);

	return (
		<Page>
			<div className="flex h-[calc(100svh-100px)] justify-start p-4 gap-8 overflow-y-auto scroll-p-8 flex-col-reverse">
				<form.AppForm>
					<form
						onSubmit={(e) => e.preventDefault()}
						className="flex flex-col max-w-2xl gap-4 w-full mx-auto"
					>
						<form.AppField
							name="content"
							children={(field) => (
								<field.TextAreaField
									placeholder="Enter your response"
									label=""
									className="resize-none"
									onKeyDown={(e) => {
										if (e.key === "Enter" && !e.shiftKey) {
											e.preventDefault();
											console.log("submit", status);
											if (status === "ready")
												form.handleSubmit();
										}
									}}
								/>
							)}
						/>
					</form>
				</form.AppForm>
				<div className="flex max-w-2xl mx-auto w-full flex-col-reverse gap-8">
					{reversedMessages.map((m) => {
						if (m.role === "user") {
							return (
								<div
									key={m.id}
									className="self-end bg-blue-500 text-white px-3 py-2 sm:max-w-[70%] max-w-[90%] whitespace-pre-line"
								>
									{m.content}
								</div>
							);
						}

						const json = parseAssistantMessage(m);
						if (!json) return null;

						return (
							<div
								key={m.id}
								className="self-start flex-col flex gap-2"
							>
								<p className="whitespace-pre-line">
									{json?.content}
								</p>
								{((json.stats && json.stats.length > 0) ||
									(json.evaluations &&
										json.evaluations.length > 0)) && (
									<div className="border px-3 py-2 flex flex-col gap-2">
										{json.stats &&
											json.stats.map((s, i) => (
												<p key={i}>
													{s.name} ({s.value})
												</p>
											))}
										{json.evaluations &&
											json.evaluations.map((s, i) => (
												<p key={i}>
													{s.name} ({s.value})
												</p>
											))}
									</div>
								)}
							</div>
						);
					})}
				</div>
			</div>
		</Page>
	);
};

function RouteComponent() {
	const [chatModule] = Route.useLoaderData();
	const { sendEvent, messages: scormMessages } = useScorm();

	useEffect(() => {
		sendEvent("LMSInitialize");
		sendEvent("LMSGetValue", "cmi.core.suspend_data");
	}, []);

	const initialMessages = scormMessages.find(
		(m) => m.event.method === "LMSGetValue" && m.response,
	)?.response?.result;

	if (!initialMessages) {
		return <div>Loading...</div>;
	}

	return (
		<Chat
			initialMessages={JSON.parse(initialMessages)}
			scenarioId={chatModule.data.scenarioId}
			personaIds={chatModule.data.personaIds}
			contextIds={chatModule.data.contextIds}
			onChange={(messages) => {
				sendEvent("LMSSetValue", {
					element: "cmi.core.suspend_data",
					value: JSON.stringify(messages),
				});
			}}
		/>
	);
}
