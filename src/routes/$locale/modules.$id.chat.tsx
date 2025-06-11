import { getModuleFn } from "@/lib/handlers/modules";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { useScorm } from "@/lib/scorm";
import { useEffect } from "react";
import { Chat } from "@/components/Chat";
import { getScenarioFn } from "@/lib/handlers/scenarios";
import { scenarios } from "@/lib/db/schema";

export const Route = createFileRoute("/$locale/modules/$id/chat")({
	component: RouteComponent,
	loader: async ({ params: { id } }) => {
		const chatModule = await getModuleFn({
			data: { id },
		});
		if (!chatModule) throw notFound();
		const scenario = await getScenarioFn({
			data: { id: chatModule.data.scenarioId },
		});
		if (!scenario) throw notFound();
		return {
			chatModule,
			scenario,
		};
	},
});

function RouteComponent() {
	const { chatModule, scenario } = Route.useLoaderData();
	const { sendEvent, messages: scormMessages } = useScorm();

	useEffect(() => {
		sendEvent("LMSInitialize");
		sendEvent("LMSGetValue", "cmi.core.suspend_data");
	}, []);

	const initialMessages =
		scormMessages.find(
			(m) => m.event.method === "LMSGetValue" && m.response,
		)?.response?.result ?? "[]";

	if (!initialMessages) {
		return <div>Loading...</div>;
	}

	return (
		<div className="p-8 h-screen">
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
				contextIds={chatModule.data.contextIds}
				instructions={scenario.data.instructions}
				onChange={(messages) => {
					sendEvent("LMSSetValue", {
						element: "cmi.core.suspend_data",
						value: JSON.stringify(messages),
					});
				}}
			/>
		</div>
	);
}
