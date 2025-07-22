import type { Messages } from "@/lib/locale";

const fr: Messages = {
	// Common
	Actions: {
		title: "Actes",
		delete: "Supprimer",
		create: "Créer",
		cancel: "Annuler",
		continue: "Continuer",
	},
	Form: {
		optional: "En option",
		submit: "Soumettre",
		suggestedImageSize: "Taille de l'image suggérée :",
		otherSettings: "Autres paramètres",
		blockNavigation: {
			title: "Quitter sans sauvegarder?",
			description:
				"Vos modifications n'ont pas été sauvegardés. Si vous quittez, vous perdrez vos modifications.",
			confirm: "Confirmer",
			cancel: "Annuler",
		},
		accepts: "Accepte :",
	},
	Errors: {
		title: "Quelque chose s'est mal passé !",
		tryAgain: "Essayer à nouveau",
		goBack: "Retourner",
		NotFound: {
			title: "404",
			message: "La page que vous recherchez n'existe pas.",
			home: "Accueil",
		},
	},
	Table: {
		name: "Nom",
		status: "Statut",
		empty: "Aucun résultat.",
		filter: "Filtrer les résultats...",
		sort: {
			asc: "Croissant",
			desc: "Décroissant",
			hide: "Cacher",
		},
		rowsPerPage: "Lignes par page",
		page: "Page",
		of: "de",
		goToFirstPage: "Aller à la première page",
		goToPreviousPage: "Aller à la page précédente",
		goToNextPage: "Aller à la page suivante",
		goToLastPage: "Aller à la dernière page",
	},
	// Auth
	OTP: {
		subject: "Code de vérification de l'e-mail",
		content: "Voici votre code de vérification :",
	},
	AuthLoginForm: {
		email: {
			label: "E-mail",
		},
	},
	AuthLogin: {
		title: "Se connecter",
		description:
			"Entrez votre email ci-dessous et soumettez pour vous connecter",
	},
	AuthVerifyEmail: {
		title: "Vérification de l'email",
		description:
			"Entrez le code que nous vous avons envoyé pour vérifier votre email",
	},
	AuthVerifyEmailForm: {
		code: {
			label: "Code",
		},
	},
	TeamSwitcher: {
		title: "Équipes",
		create: "Créer une équipe",
	},
	TeamForm: {
		name: "Nom",
		logo: "Logo",
		create: {
			title: "Créer une équipe",
			description: "Entrez les informations de votre équipe ci-dessous.",
		},
	},
	UserForm: {
		title: "Compte",
		description: "Gérez les paramètres de votre compte.",
		name: "Nom",
	},
	UserButton: {
		theme: {
			label: "Thème",
			light: "Clair",
			dark: "Sombre",
			system: "Système",
		},
		account: "Compte",
		signout: "Se déconnecter",
	},
	// Custom
	AdminSidebar: {
		dashboard: "Tableau de bord",
		personas: {
			title: "Personnages",
			tooltip:
				"Les personnages sont le rôle que joue l'IA dans les scénarios.",
		},
		scenarios: {
			title: "Scénarios",
			tooltip:
				"Les scénarios sont l'environnement dans lequel la personne et l'utilisateur interagissent. (ex. une ligne d'assistance, un caissier)",
		},
		contexts: {
			title: "Contextes",
			tooltip:
				"Le contexte derrière un scénario. (ex. un client en colère, un appelant frénétique)",
		},
		modules: {
			title: "Modules",
			tooltip:
				"Les modules sont un cours exportable basé sur un scénario, des personnages et des contextes.",
		},
		editing: "Édition",
		chat: "Test de Discussion",
		settings: "Paramètres",
		apiKeys: "Clés API",
	},
	Home: {
		title: "Moteur de Chat IA",
		description:
			"Nuonn est un outil de création de chats pour les scénarios de communication IA et les évaluations.",
		getStarted: "Commencer",
	},
	Chat: {
		random: "Aléatoire",
		instructions: "Instructions",
		completed: "Vous avez terminé avec succès ce scénario.",
		scenario: {
			title: "Scénario",
			description: "Sélectionner un scénario",
		},
		context: {
			title: "Contextes",
			description: "Sélectionner les contextes",
		},
		persona: {
			title: "Caractère",
			description: "Sélectionnez le personnage",
		},
		placeholder: "Tapez votre message ici...",
	},
	Module: {
		edit: "Modifier ce module",
		export: "Exporter",
		preview: "Aperçu",
		toast: "Module mis à jour avec succès",
		deleteToast: "Module supprimé avec succès",
		tabs: {
			info: "Renseignements",
			usage: "Utilisation",
		},
		usage: {
			title: "Jetons et données sur les coûts",
			description:
				"Affiche l'utilisation des jetons et des coûts du module par jour",
			cost: "Coût",
			tokens: "Jetons",
		},
	},
	ModuleCreate: {
		title: "Créer un Module",
		description:
			"Créer un nouveau module qui peut être utilisé comme cours",
		toast: "Module créé avec succès",
	},
	ModuleForm: {
		name: "Nom",
		description: "Descriptif",
		apiKey: {
			label: "Clé API",
			placeholder: "Sélectionner une clé API",
		},
		scenario: {
			label: "Scénario",
			placeholder: "Sélectionner un scénario",
		},
		contexts: {
			label: "Contextes",
			placeholder: "Sélectionner les contextes",
		},
		personas: {
			label: "Personnages",
			placeholder: "Sélectionnez les personnages",
		},
	},
	Persona: {
		edit: "Modifier ce personnage",
		toast: "Personnage mis à jour avec succès",
		deleteToast: "Personnage supprimé avec succès",
	},
	PersonaCreate: {
		title: "Créer un personnage",
		description:
			"Créez un nouveau personnage qui peut être utilisé dans un scénario",
		toast: "Personnage créé avec succès",
	},
	PersonaForm: {
		statOptions: {
			low: "Faible",
			medium: "Moyen",
			high: "Élevé",
		},
		name: "Nom",
		age: "Âge",
		gender: "Genre",
		sexuality: "Sexualité",
		pronouns: "Pronoms",
		ethnicity: "Origine ethnique",
		country: "Pays",
		education: "Éducation",
		location: "Localisation",
		height: "Taille",
		build: "Corpulence",
		transportation: "Transport",
		disibility: "Handicap(s)",
		occupation: "Profession",
		relationships: "Relations",
		appearance: "Apparence",
		religion: "Religion",
		politics: "Politique",
		intelligence: "Intelligence",
		memory: "Mémoire",
		wealth: "Richesse",
		health: "Santé",
		mentalHealth: "Santé mentale",
		personality: "Personnalité",
		traits: "Traits",
		hobbies: "Loisirs",
		likes: "Aime",
		dislikes: "N'aime pas",
		backstory: "Histoire personnelle",
		behaviour: "Comportement",
		languages: {
			title: "Langues",
			description: "Décrivez les langues que le personnage peut parler.",
			name: "Nom",
			spoken: "Parlé",
			written: "Écrit",
		},
	},
	Context: {
		edit: "Modifier ce contexte",
		toast: "Contexte mis à jour avec succès",
		deleteToast: "Contexte supprimé avec succès",
	},
	ContextCreate: {
		title: "Créer un Contexte",
		description:
			"Créer un nouveau contexte qui peut être utilisé dans un scénario",
		toast: "Contexte créé avec succès",
	},
	ContextForm: {
		name: "Nom",
		description: "Descriptif",
		type: {
			title: "Type",
			character: "Caractère",
			scenario: "Scénario",
		},
	},
	Scenario: {
		edit: "Modifier ce scénario",
		toast: "Scénario mis à jour avec succès",
		deleteToast: "Scénario supprimé avec succès",
	},
	ScenarioCreate: {
		title: "Créer un Scénario",
		description:
			"Créer un nouveau scénario qui peut être utilisé dans un module",
		toast: "Scénario créé avec succès",
	},
	ScenarioForm: {
		name: "Nom",
		description: "Descriptif",
		role: "Rôle",
		goals: "Objectifs",
		evaluation: "Évaluation",
		instructions: {
			label: "Instructions",
			description: "Instructions du scénario à montrer à l'utilisateur.",
		},
		user: {
			title: "Utilisateur",
			description: "Décrire le rôle de l'utilisateur dans le scénario",
		},
		userEvaluations: {
			title: "Évaluations de l'utilisateur",
			description:
				"Décrire les évaluations qui doivent être suivies pour l'utilisateur",
		},
		persona: {
			title: "Caractère",
			description: "Décrivez le rôle du personnage dans le scénario",
		},
		personaEvaluations: {
			title: "Évaluations de la personnalité",
			description:
				"Describe the evaluations that should be tracked for the character",
		},
		evaluationType: {
			title: "Taper",
			description:
				"Le type d'évaluation. Message est un seul message (ex. Politesse) et Session est évaluée sur tous les messages (ex. Conversation)",
			message: "Message",
			session: "Session",
		},
		evaluationMeasure: {
			title: "Mesure",
			description:
				"Comment l'évaluation est mesurée (ex. Vrai/Faux, 0-100, 1-10)",
		},
		initialValue: {
			title: "Valeur initiale",
			description: "La valeur initiale de l'évaluation (ex. 0, faux)",
		},
		successValue: {
			title: "Valeur de réussite",
			description:
				"La valeur qui représente le succès (ex. Vrai, 1, >70)",
		},
	},
	ApiKey: {
		title: "Clé API",
		description: "Gérer vos clés API",
		table: {
			name: "Nom",
			key: "Clé",
			provider: "Fournisseur",
			actions: "Actions",
		},
		deleteToast: "Clé API supprimée avec succès",
	},
	ApiKeyCreate: {
		title: "Créer une Clé API",
		description:
			"Ajouter une nouvelle clé API d'IA pour utilisation dans les modules.",
		toast: "Clé API créée avec succès",
	},
	ApiKeyForm: {
		name: "Nom",
		key: "Clé",
		provider: "Fournisseur",
	},
};

export default fr;
