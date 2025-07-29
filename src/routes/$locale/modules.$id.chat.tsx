import { getModuleFn } from "@/lib/handlers/modules";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { useScorm } from "@/lib/scorm";
import { useEffect, useMemo, useState } from "react";
import { Chat } from "@/components/Chat";
import z from "zod";

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
		<div className="h-screen flex flex-col justify-end">
			<div className="max-h-screen">
				<Chat
					type="module"
					additionalBody={{
						moduleId: chatModule.id,
					}}
					initialMessages={
						initialMessages ? JSON.parse(initialMessages) : []
					}
					complete={complete || isComplete}
					instructions={chatModule.instructions}
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
			</div>
		</div>
	);
}
