const en = {
	// Common
	Actions: {
		title: "Actions",
		delete: "Delete",
		create: "Create",
		cancel: "Cancel",
		continue: "Continue",
	},
	Errors: {
		title: "Something went wrong!",
		tryAgain: "Try Again",
		goBack: "Go Back",
		NotFound: {
			title: "404",
			message: "The page you are looking for does not exist.",
			home: "Home",
		},
	},
	Form: {
		optional: "Optional",
		submit: "Submit",
		suggestedImageSize: "Suggested image size:",
		otherSettings: "Other settings",
		blockNavigation: {
			title: "Leave without saving?",
			description:
				"Your changes have not been saved. If you leave, you will lose your changes.",
			confirm: "Confirm",
			cancel: "Cancel",
		},
		accepts: "Accepts:",
	},
	Table: {
		empty: "No results.",
		filter: "Filter results...",
		sort: {
			asc: "Asc",
			desc: "Desc",
			hide: "Hide",
		},
		name: "Name",
		status: "Status",
		rowsPerPage: "Rows per page",
		page: "Page",
		of: "of",
		goToFirstPage: "Go to first page",
		goToPreviousPage: "Go to previous page",
		goToNextPage: "Go to next page",
		goToLastPage: "Go to last page",
	},
	// Auth
	OTP: {
		subject: "Email Verification Code",
		content: "Here is your verification code:",
	},
	AuthLoginForm: {
		email: {
			label: "Email",
		},
	},
	AuthLogin: {
		title: "Login",
		description: "Enter your email below and submit to login",
	},
	AuthVerifyEmail: {
		title: "Verify Email",
		description: "Enter the code we sent you to verify your email",
	},
	AuthVerifyEmailForm: {
		code: {
			label: "Code",
		},
	},
	TeamSwitcher: {
		title: "Teams",
		create: "Create team",
	},
	TeamForm: {
		name: "Name",
		logo: "Logo",
		create: {
			title: "Create Team",
			description: "Enter the details of your team below.",
		},
	},
	UserForm: {
		title: "Account",
		description: "Manage your account settings.",
		name: "Name",
	},
	UserButton: {
		theme: {
			label: "Theme",
			light: "Light",
			dark: "Dark",
			system: "System",
		},
		account: "Account",
		signout: "Sign out",
	},
	// Custom
	AdminSidebar: {
		dashboard: "Dashboard",
		personas: {
			title: "Characters",
			tooltip: "Characters are the role the AI plays in the scenarios.",
		},
		behaviours: {
			title: "Behaviours",
			tooltip:
				"Behaviours are the AI's adjustable personality including rapport and dishonesty.",
		},
		scenarios: {
			title: "Scenarios",
			tooltip:
				"Scenarios are the environment the character and user are interacting in. (ex. a helpline, cashier)",
		},
		contexts: {
			title: "Contexts",
			tooltip:
				"The context behind a scenario. (ex. an angry customer, a frantic caller)",
		},
		modules: {
			title: "Modules",
			tooltip:
				"Modules are an exportable course based on a scenario, characters, and contexts.",
		},
		editing: "Editing",
		chat: "Chat Playground",
		settings: "Settings",
		apiKeys: "API Keys",
	},
	Home: {
		title: "AI Chat Engine",
		description:
			"Nuonn is a chat creation tool for AI communication scenarios and evaluations.",
		getStarted: "Get Started",
	},
	Chat: {
		random: "Random",
		instructions: "Instructions",
		completed: "You have successfully completed this scenario.",
		title: "Chat Playground",
		description: "Create and test a custom module configuration",
		scenario: {
			title: "Scenario",
			description: "Select scenario",
		},
		context: {
			title: "Contexts",
			description: "Select contexts",
		},
		persona: {
			title: "Character",
			description: "Select character",
		},
		behaviour: {
			title: "Behaviour",
			description: "Select behaviour",
		},
		placeholder: "Type your message here...",
	},
	Module: {
		edit: "Edit this module",
		export: "Export",
		preview: "Preview",
		toast: "Module updated successfully",
		deleteToast: "Module deleted successfully",
		tabs: {
			info: "Information",
			usage: "Usage",
		},
		usage: {
			title: "Usage Data",
			description: "Shows the token and cost usage of the module by day",
			cost: "Total Cost",
			tokens: "Total Tokens",
			averageCost: "Average Cost",
			averageTokens: "Average Tokens",
		},
	},
	ModuleCreate: {
		title: "Create Module",
		description: "Create a new module that can be used as a course",
		toast: "Module created successfully",
	},
	ModuleForm: {
		name: "Name",
		description: "Description",
		apiKey: {
			label: "API Key",
			placeholder: "Select an API Key",
		},
		scenario: { label: "Scenario", placeholder: "Select a Scenario" },
		contexts: { label: "Contexts", placeholder: "Select the contexts" },
		personas: {
			label: "Characters",
			placeholder: "Select the characters",
		},
		behaviours: {
			label: "Character Behaviours",
			placeholder: "Select the character behaviours",
		},
	},
	Persona: {
		edit: "Edit this character",
		toast: "Character updated successfully",
		deleteToast: "Character deleted successfully",
	},
	PersonaCreate: {
		title: "Create Character",
		description: "Create a new character that can be used in a scenario",
		toast: "Character created successfully",
	},
	PersonaForm: {
		statOptions: {
			low: "Low",
			medium: "Medium",
			high: "High",
		},
		name: "Name",
		age: "Age",
		gender: "Gender",
		sexuality: "Sexuality",
		pronouns: "Pronouns",
		ethnicity: "Ethnicity",
		country: "Country",
		education: "Education",
		location: "Location",
		height: "Height",
		build: "Build",
		transportation: "Transportation",
		disibility: "Disibility(s)",
		occupation: "Occupation",
		relationships: "Relationships",
		appearance: "Appearance",
		religion: "Religion",
		politics: "Politics",
		intelligence: "Intelligence",
		memory: "Memory",
		wealth: "Wealth",
		health: "Health",
		mentalHealth: "Mental Health",
		personality: "Personality",
		traits: "Traits",
		hobbies: "Hobbies",
		likes: "Likes",
		dislikes: "Dislikes",
		backstory: "Backstory",
		behaviour: "Behaviour",
		languages: {
			title: "Languages",
			description: "Describe the languages the character can speak",
			name: "Name",
			spoken: "Spoken",
			written: "Written",
		},
	},
	Context: {
		edit: "Edit this context",
		toast: "Context updated successfully",
		deleteToast: "Context deleted successfully",
	},
	ContextCreate: {
		title: "Create Context",
		description: "Create a new context that can be used in a scenario",
		toast: "Context created successfully",
	},
	ContextForm: {
		name: "Name",
		description: "Description",
		type: {
			title: "Type",
			character: "Character",
			scenario: "Scenario",
		},
	},
	Scenario: {
		edit: "Edit this scenario",
		toast: "Scenario updated successfully",
		deleteToast: "Scenario deleted successfully",
	},
	ScenarioCreate: {
		title: "Create Scenario",
		description: "Create a new scenario that can be used in a module",
		toast: "Scenario created successfully",
	},
	ScenarioForm: {
		name: "Name",
		description: "Description",
		role: "Role",
		goals: "Goals",
		evaluation: "Evaluation",
		instructions: {
			label: "Instructions",
			description:
				"Instructions of the scenario to be shown to the user.",
		},
		user: {
			title: "User",
			description: "Describe the users role in the scenario",
		},
		userEvaluations: {
			title: "User Evaluations",
			description:
				"Describe the evaluations that should be tracked for the user",
		},
		persona: {
			title: "Character",
			description: "Describe the character's role in the scenario",
		},
		personaEvaluations: {
			title: "Character Evaluations",
			description:
				"Describe the evaluations that should be tracked for the character",
		},
		evaluationType: {
			title: "Type",
			description:
				"The type of evaluation. Message is a single message (ex. Politeness) and Session is evaluated on all of messages (ex. Conversation)",
			message: "Message",
			session: "Session",
		},
		evaluationMeasure: {
			title: "Measure",
			description:
				"How the evaluation is measured (ex. True/False, 0-100, 1-10)",
		},
		initialValue: {
			title: "Initial Value",
			description: "The initial value of the evaluation (ex. 0, false)",
		},
		successValue: {
			title: "Success Value",
			description: "The value that represents success (ex. True, 1, >70)",
		},
	},
	Behaviour: {
		edit: "Edit this behaviour",
		toast: "Behaviour updated successfully",
		deleteToast: "Behaviour deleted successfully",
	},
	BehaviourForm: {
		name: "Name",
		description: "Description",
		rapportBuilding: "Rapport Building",
		rapportLoss: "Rapport Loss",
		dishonesty: "Dishonesty",
	},
	BehaviourCreate: {
		title: "Create Behaviour",
		description:
			"Create a new behaviour that can be used in a scenario for a character",
		toast: "Behaviour created successfully",
	},
	ApiKey: {
		title: "API Key",
		description: "Manage your API keys",
		table: {
			name: "Name",
			key: "Key",
			provider: "Provider",
			actions: "Actions",
		},
		deleteToast: "API Key deleted successfully",
	},
	ApiKeyCreate: {
		title: "Create API Key",
		description: "Add a new AI API key for use within modules.",
		toast: "API Key created successfully",
	},
	ApiKeyForm: {
		name: "Name",
		key: "Key",
		provider: "Provider",
	},
};

export default en;
