var findAPITries = 0;

function findAPI(win) {
	// Check to see if the window (win) contains the API
	// if the window (win) does not contain the API and
	// the window (win) has a parent window and the parent window
	// is not the same as the window (win)
	while ((win.API == null) && (win.parent != null) && (win.parent != win)) {
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
}

function getAPI() {
	// start by looking for the API in the current window
	var theAPI = findAPI(window);

	// if the API is null (could not be found in the current window)
	// and the current window has an opener window
	if ((theAPI == null) && (window.opener != null) && (typeof (window.opener) != "undefined")) {
		// try to find the API in the current window’s opener
		theAPI = findAPI(window.opener);
	}
	// if the API has not been found
	if (theAPI == null) {
		// Alert the user that the API Adapter could not be found
		alert("Unable to find an API adapter");
	}
	return theAPI;
}

// PostMessage Wrapper for SCORM 1.2 API
var SCORMPostMessageWrapper = (function() {
	var api = null;
	var initialized = false;

	// Initialize the wrapper and find the SCORM API
	function init() {
		if (initialized) return true;

		api = getAPI();
		if (api) {
			initialized = true;
			console.log("SCORM API found and wrapper initialized");
			return true;
		}
		console.error("Failed to initialize SCORM wrapper - API not found");
		return false;
	}

	// Handle incoming PostMessage events
	function handleMessage(event) {
		// Validate origin if needed (uncomment and modify as required)
		// if (event.origin !== "https://your-trusted-domain.com") return;
		//
		console.log("Received message:", event.data);

		if (!event.data || typeof event.data !== 'object') return;
		if (event.data.type !== 'scorm') return;

		var message = event.data;
		var response = {
			id: message.id,
			type: 'scorm-response',
			success: false,
			result: null,
			error: null
		};

		// Ensure API is available
		if (!api && !init()) {
			response.error = "SCORM API not available";
			event.source.postMessage(response, event.origin);
			return;
		}

		try {
			switch (message.method) {
				case 'LMSInitialize':
					response.result = api.LMSInitialize(message.parameter || "");
					response.success = (response.result === "true");
					break;

				case 'LMSFinish':
					response.result = api.LMSFinish(message.parameter || "");
					response.success = (response.result === "true");
					break;

				case 'LMSGetValue':
					if (!message.parameter) {
						response.error = "Parameter required for LMSGetValue";
						break;
					}
					response.result = api.LMSGetValue(message.parameter);
					response.success = true;
					break;

				case 'LMSSetValue':
					if (!message.parameter || typeof message.parameter !== 'object' ||
						!message.parameter.element || typeof message.parameter.value === 'undefined') {
						response.error = "Invalid parameters for LMSSetValue. Expected {element: string, value: string}";
						break;
					}
					response.result = api.LMSSetValue(message.parameter.element, message.parameter.value);
					response.success = (response.result === "true");
					break;

				case 'LMSCommit':
					response.result = api.LMSCommit(message.parameter || "");
					response.success = (response.result === "true");
					break;

				case 'LMSGetLastError':
					response.result = api.LMSGetLastError();
					response.success = true;
					break;

				case 'LMSGetErrorString':
					if (!message.parameter) {
						response.error = "Parameter required for LMSGetErrorString";
						break;
					}
					response.result = api.LMSGetErrorString(message.parameter);
					response.success = true;
					break;

				case 'LMSGetDiagnostic':
					if (!message.parameter) {
						response.error = "Parameter required for LMSGetDiagnostic";
						break;
					}
					response.result = api.LMSGetDiagnostic(message.parameter);
					response.success = true;
					break;

				default:
					response.error = "Unknown SCORM method: " + message.method;
					break;
			}
		} catch (e) {
			response.error = "Error calling SCORM API: " + e.message;
			console.error("SCORM API Error:", e);
		}

		// Send response back to iframe
		console.log("Sending response:", response);
		event.source.postMessage(response, event.origin);
	}

	// Public interface
	return {
		init: init,

		// Start listening for PostMessage events
		startListening: function() {
			if (!initialized && !init()) {
				console.error("Cannot start listening - SCORM wrapper not initialized");
				return false;
			}

			window.addEventListener('message', handleMessage, false);
			console.log("SCORM PostMessage wrapper is now listening for messages");
			return true;
		},

		// Stop listening for PostMessage events
		stopListening: function() {
			window.removeEventListener('message', handleMessage, false);
			console.log("SCORM PostMessage wrapper stopped listening");
		},

		// Check if API is available
		isReady: function() {
			return initialized && api !== null;
		},

		// Get direct access to API (for debugging)
		getAPI: function() {
			return api;
		}
	};
})();

// Auto-initialize and start listening when script loads
(function() {
	// Wait for DOM to be ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', function() {
			SCORMPostMessageWrapper.startListening();
		});
	} else {
		SCORMPostMessageWrapper.startListening();
	}
})();

// Make wrapper available globally
window.SCORMPostMessageWrapper = SCORMPostMessageWrapper;
