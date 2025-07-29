import { useAppForm } from "@/components/ui/form";
import { type UIMessage, useChat } from "@ai-sdk/react";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useTranslations } from "@/lib/locale";
import { Check, ChevronsUpDown, Info } from "lucide-react";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "./ui/collapsible";
import { Button } from "./ui/button";
import { parseAssistantMessage } from "@/lib/ai";
import { DefaultChatTransport } from "ai";
import {
	getChatModuleResponseFn,
	getChatPlaygroundResponseFn,
} from "@/lib/handlers/chat";
import { ScrollArea } from "./ui/scroll-area";

export const Chat = ({
	initialMessages = [],
	instructions,
	complete,
	type,
	additionalBody,
	disabled,
	onStart,
	onChange,
	onComplete,
}: {
	initialMessages?: UIMessage[];
	instructions?: string;
	complete: boolean;
	type: "module" | "playground";
	additionalBody?: Record<string, any>;
	disabled?: boolean;
	onStart?: () => void;
	onChange?: (messages: UIMessage[]) => void;
	onComplete?: () => void;
}) => {
	const t = useTranslations("Chat");
	const [started, setStarted] = useState(false);

	const { sendMessage, status, messages, setMessages, id } = useChat({
		transport: new DefaultChatTransport({
			// @ts-ignore
			fetch: (_: any, options: any) => {
				const body = JSON.parse(options!.body! as string);
				if (type === "module") {
					return getChatModuleResponseFn({
						data: {
							...body,
							...additionalBody,
						},
					});
				} else {
					return getChatPlaygroundResponseFn({
						data: {
							...body,
							...additionalBody,
						},
					});
				}
			},
		}),
	});

	useEffect(() => {
		setMessages(initialMessages);
	}, [id]);

	const form = useAppForm({
		defaultValues: {
			content: "",
		} as { content: string },
		validators: {
			onSubmit: z.object({ content: z.string().min(1) }),
		},
		onSubmit: ({ value: { content }, formApi }) => {
			if (!started) {
				setStarted(true);
				onStart?.();
			}
			sendMessage({
				text: content,
			});
			formApi.reset();
		},
	});

	const reversedMessages = messages.slice().reverse();

	useEffect(() => {
		if (status !== "ready") return;

		onChange?.(messages);

		const parsedMessages = messages
			.map((m) => parseAssistantMessage(m))
			.filter(Boolean);

		const lastMessage = parsedMessages.find(
			(_, i) => i === parsedMessages.length - 1,
		);
		if (
			lastMessage &&
			lastMessage.evaluations.length > 0 &&
			// If cant find an error message, send onComplete
			!lastMessage.evaluations.find((e) => !e.success)
		) {
			onComplete?.();
		}
	}, [messages, status]);

	return (
		<ScrollArea className="h-full">
			<div className="flex h-full justify-start p-4 gap-2 flex-col-reverse w-full max-w-2xl mx-auto">
				{instructions && (
					<div className="border flex flex-col gap-2">
						<Collapsible defaultOpen>
							<CollapsibleTrigger asChild>
								<Button
									variant="ghost"
									size="sm"
									className="w-full flex items-center justify-between"
								>
									<p className="flex items-center gap-2">
										<Info className="size-4" />
										{t.instructions}
									</p>
									<ChevronsUpDown className="size-4" />
								</Button>
							</CollapsibleTrigger>
							<CollapsibleContent className="pt-2 text-sm text-muted-foreground p-2 whitespace-pre-line">
								{instructions}
							</CollapsibleContent>
						</Collapsible>
					</div>
				)}
				<form.AppForm>
					<form
						onSubmit={(e) => e.preventDefault()}
						className="flex flex-col gap-4"
					>
						<form.AppField
							name="content"
							children={(field) => (
								<field.TextAreaField
									placeholder={t.placeholder}
									label=""
									className="resize-none z-20"
									disabled={complete || disabled}
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
				{complete && (
					<div className="flex flex-col gap-8 py-8">
						<div className="text-center">
							<p className="text-2xl font-bold">{t.completed}</p>
						</div>
					</div>
				)}
				<div className="flex flex-col-reverse gap-8 py-8">
					{reversedMessages.map((m) => {
						if (m.role === "user") {
							return (
								<div
									key={m.id}
									className="self-end bg-blue-500 text-white px-3 py-2 sm:max-w-[70%] max-w-[90%] whitespace-pre-line"
								>
									{
										m.parts.find((p) => p.type === "text")
											?.text
									}
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
								{json.evaluations &&
									json.evaluations.length > 0 && (
										<div className="border px-3 py-2 flex flex-col gap-2">
											{json.rapport && (
												<p className="flex items-center gap-2">
													Rapport ({json.rapport})
												</p>
											)}
											{json.evaluations &&
												json.evaluations.map((s, i) => (
													<p
														key={i}
														className="flex items-center gap-2"
													>
														{s.success && (
															<Check className="size-4" />
														)}
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
		</ScrollArea>
	);
};
