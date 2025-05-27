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
	// Custom
	AdminSidebar: {
		dashboard: "Dashboard",
		personas: "Personas",
		scenarios: "Scenarios",
		editing: "Editing",
		chat: "Chat",
	},
};

export default fr;
