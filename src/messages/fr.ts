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
				"Les personas sont les personnages que l'IA joue dans les scénarios.",
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
};

export default fr;
