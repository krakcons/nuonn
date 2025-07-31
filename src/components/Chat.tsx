import { useAppForm } from "@/components/ui/form";
import { type UIMessage, useChat } from "@ai-sdk/react";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useTranslations } from "@/lib/locale";
import { parseAssistantMessage, ChatEvaluationResponseType } from "@/lib/ai";
import { DefaultChatTransport } from "ai";
import { getChatModuleResponseFn } from "@/lib/handlers/chat";
import { useBlocker } from "@tanstack/react-router";

export const Chat = ({
	initialMessages = [],
	complete,
	moduleId,
	disabled,
	onStart,
	onChange,
	onEvaluationChange,
	onComplete,
}: {
	initialMessages?: UIMessage[];
	complete: boolean;
	moduleId: string;
	disabled?: boolean;
	onStart?: () => void;
	onChange?: (messages: UIMessage[]) => void;
	onEvaluationChange?: (
		evaluations?: ChatEvaluationResponseType["evaluations"],
	) => void;
	onComplete?: () => void;
}) => {
	const t = useTranslations("Chat");
	const [started, setStarted] = useState(false);

	const { sendMessage, status, messages, setMessages, id, error } = useChat({
		transport: new DefaultChatTransport({
			// @ts-ignore
			fetch: (_: any, options: any) => {
				const body = JSON.parse(options!.body! as string);
				return getChatModuleResponseFn({
					data: {
						...body,
						moduleId,
					},
				});
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

		onEvaluationChange?.(lastMessage?.evaluations);

		if (
			lastMessage &&
			lastMessage.evaluations.length > 0 &&
			// If cant find an error message, send onComplete
			!lastMessage.evaluations.find((e) => !e.success)
		) {
			onComplete?.();
		}
	}, [messages, status]);

	useBlocker({
		shouldBlockFn: () => false,
		enableBeforeUnload: () => status === "streaming",
	});

	return (
		<div className="flex h-full justify-start px-4 pt-4 pb-8 gap-2 flex-col-reverse w-full max-w-2xl mx-auto overflow-y-auto">
			<form.AppForm>
				<form
					onSubmit={(e) => e.preventDefault()}
					className="flex flex-col gap-4 bg-sidebar"
				>
					<form.AppField
						name="content"
						children={(field) => (
							<field.TextAreaField
								placeholder={t.placeholder}
								label=""
								className="resize-none z-20"
								disabled={complete || disabled || !!error}
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
			{error && (
				<div className="flex flex-col gap-8 py-8">
					<div className="text-center">
						<p className="text-2xl font-bold text-destructive">
							{error.message}
						</p>
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
								{m.parts.find((p) => p.type === "text")?.text}
							</div>
						);
					}

					const json = parseAssistantMessage(m);
					if (!json) return null;

					return (
						<div key={m.id}>
							<p className="whitespace-pre-line">
								{json?.content}
							</p>
						</div>
					);
				})}
			</div>
		</div>
	);
};
