import { useAppForm } from "@/components/ui/form";
import { type Message, useChat } from "@ai-sdk/react";
import { parsePartialJson } from "@ai-sdk/ui-utils";
import { z } from "zod";
import { getChatResponseFn } from "@/lib/handlers/chat";
import { type ChatResponseType } from "@/lib/ai";
import { useEffect } from "react";
import { useTranslations } from "@/lib/locale";
import { ChevronsUpDown, Info } from "lucide-react";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "./ui/collapsible";
import { Button } from "./ui/button";

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

export const Chat = ({
	initialMessages = [],
	scenarioId,
	personaId,
	contextIds,
	instructions,
	onChange,
}: {
	initialMessages?: Message[];
	scenarioId: string;
	personaId: string;
	contextIds?: string[];
	instructions?: string;
	onChange?: (messages: Message[]) => void;
}) => {
	const t = useTranslations("Chat");

	const { append, status, messages } = useChat({
		initialMessages,
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
		} as { content: string },
		validators: {
			onSubmit: z.object({ content: z.string().min(1) }),
		},
		onSubmit: ({ value: { content }, formApi }) => {
			append(
				{
					role: "user",
					content,
				},
				{
					body: {
						personaId,
						scenarioId,
						contextIds,
					},
				},
			);
			formApi.reset();
		},
	});

	const reversedMessages = messages.slice().reverse();

	useEffect(() => {
		if (
			status !== "ready" ||
			!onChange ||
			// Require messages to change
			messages.length === initialMessages?.length
		)
			return;

		onChange(messages);
	}, [messages, status]);

	return (
		<div className="flex h-full justify-start gap-2 overflow-y-auto p-4 scroll-p-8 flex-col-reverse w-full">
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
									Instructions
								</p>
								<ChevronsUpDown className="size-4" />
							</Button>
						</CollapsibleTrigger>
						<CollapsibleContent className="pt-2 text-sm text-muted-foreground p-2">
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
			<div className="flex flex-col-reverse gap-8 py-8">
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
	);
};
