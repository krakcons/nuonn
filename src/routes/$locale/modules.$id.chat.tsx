import { getModuleFn } from "@/lib/handlers/modules";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { useScorm } from "@/lib/scorm";
import { useEffect, useState } from "react";
import { Chat } from "@/components/Chat";

export const Route = createFileRoute("/$locale/modules/$id/chat")({
	component: RouteComponent,
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
	const { sendEvent, messages: scormMessages } = useScorm();
	const [complete, setComplete] = useState(false);

	useEffect(() => {
		sendEvent("LMSInitialize");
		sendEvent("LMSGetValue", "cmi.core.suspend_data");
		sendEvent("LMSGetValue", "cmi.core.lesson_status");
	}, []);

	const initialMessages =
		scormMessages.find(
			(m) =>
				m.event.method === "LMSGetValue" &&
				m.response &&
				m.event.parameter === "cmi.core.suspend_data",
		)?.response?.result || "[]";

	const defaultComplete =
		scormMessages.find(
			(m) =>
				m.event.method === "LMSGetValue" &&
				m.response &&
				m.event.parameter === "cmi.core.lesson_status",
		)?.response?.result === "completed";

	if (!initialMessages) {
		return <div>Loading...</div>;
	}

	return (
		<div className="p-8 h-screen max-w-2xl w-full mx-auto">
			<Chat
				initialMessages={JSON.parse(initialMessages)}
				scenarioId={chatModule.data.scenarioId}
				personaId={
					chatModule.data.personaIds[
						Math.floor(
							Math.random() * chatModule.data.personaIds.length,
						)
					]
				}
				complete={complete || defaultComplete}
				contextIds={chatModule.data.contextIds}
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
	);
}
