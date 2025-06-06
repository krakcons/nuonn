import { useEffect, useRef, useState } from "react";

type API = {
	LMSInitialize: undefined;
	LMSCommit: undefined;
	LMSGetValue: string;
	LMSSetValue: { element: string; value: string };
	LMSGetLastError: undefined;
	LMSGetErrorString: string;
	LMSGetDiagnostic: string;
	LMSFinish: undefined;
};

const generateId = (): string => {
	return `scorm_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

type MessageEvent = {
	type: "scorm";
	id: string;
	method: keyof API;
	parameter?: API[keyof API];
};

type MessageResponse = {
	type: "scorm-response";
	id: string;
	success: boolean;
	result: any;
	error: string;
};

export const useScorm = () => {
	const [messages, setMessages] = useState<
		{
			event: MessageEvent;
			response: MessageResponse | null;
		}[]
	>([]);

	const sendEvent = async <T extends keyof API>(
		method: T,
		parameter?: API[T],
	) => {
		const message: MessageEvent = {
			type: "scorm",
			id: generateId(),
			method,
			parameter,
		};
		setMessages((m) =>
			m.concat({
				event: message,
				response: null,
			}),
		);
		window.parent.postMessage(message, "*");
	};

	useEffect(() => {
		window.addEventListener("message", (event) => {
			if (event.data.type !== "scorm-response") return;

			setMessages((m) =>
				m.map((m) => {
					if (m.event.id === event.data.id) {
						return {
							...m,
							response: event.data,
						};
					}
					return m;
				}),
			);
		});
	}, []);

	return {
		sendEvent,
		messages,
	};
};
