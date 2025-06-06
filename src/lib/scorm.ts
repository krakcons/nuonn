import { useState } from "react";

type API = {
	LMSInitialize: () => boolean;
	LMSCommit: () => boolean;
	LMSGetValue: (key: string) => string;
	LMSSetValue: (key: string, value: string) => string;
	LMSGetLastError: () => number | null;
	LMSGetErrorString: (code: number) => string;
	LMSGetDiagnostic: (code: number) => string;
	LMSFinish: () => boolean;
};

declare global {
	interface Window {
		API?: API;
	}
}

type Options = {
	findAPITries?: number;
};

const getAPI = (findAPITries: number): API | null => {
	// start by looking for the API in the current window
	let theAPI = findAPI(window, findAPITries);

	// if the API is null (could not be found in the current window)
	// and the current window has an opener window
	if (
		theAPI == null &&
		window.opener != null &&
		typeof window.opener != "undefined"
	) {
		// try to find the API in the current window’s opener
		theAPI = findAPI(window.opener, findAPITries);
	}
	// if the API has not been found
	if (theAPI == null) return null;

	return theAPI;
};

const findAPI = (win: Window, findAPITries: number) => {
	// Check to see if the window (win) contains the API
	// if the window (win) does not contain the API and
	// the window (win) has a parent window and the parent window
	// is not the same as the window (win)
	while (win.API == null && win.parent != null && win.parent != win) {
		// increment the number of findAPITries
		findAPITries++;

		// Note: 7 is an arbitrary number, but should be more than sufficient
		if (findAPITries > 7) {
			alert("Error finding API -- too deeply nested.");
			return null;
		}

		// set the variable that represents the window being
		// being searched to be the parent of the current window
		// then search for the API again
		win = win.parent;
	}
	return win.API;
};

export const useScorm = (options?: Options) => {
	const { findAPITries = 5 } = options ?? {};

	const [api] = useState<API | null>(getAPI(findAPITries));

	if (!api) {
		return {
			error: "API not found",
		};
	}

	return {
		api,
	};
};
