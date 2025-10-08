import { ALL_ROLES } from "/imports/globals/roles";

/**
 * This allows to define routes for the app.
 *
 * Each route has:
 * - path: the path of the route
 * - breadcrumb: the name of the route to display in the breadcrumb
 *
 * Each route can have:
 * - allow: an array of roles that can access the route (scope is defined by group here for legacy reasons)
 * - <children>: an object of routes
 */
export const APP_ROUTES = {
	notAllowed: { path: "/not-allowed", breadcrumb: "Accès interdit" },
	notFound: { path: "/not-found", breadcrumb: "Page introuvable" },

	login: {
		path: "/login",
		breadcrumb: "Connexion",
		signup: { path: "/login/signup/:token", breadcrumb: "Inscription" },
		resetPassword: {
			path: "/login/reset-password/:token",
			breadcrumb: "Réinitialisation du mot de passe",
		},
	},

	settings: {
		path: "/settings/list",
		breadcrumb: "Settings",
		allow: [{ roles: [ALL_ROLES.admin.id], group: true }],
	},

	userManagement: {
		path: "/user-management",
		breadcrumb: "Gestion des utilisateurs",
		allow: [{ roles: [ALL_ROLES.admin.id], group: true }],
	},

	profile: {
		path: "/profile",
		breadcrumb: "Mon profil",
		allow: [{ roles: [ALL_ROLES.admin.id], group: null }],
	},

	root: { path: "/", breadcrumb: "", allow: false },
};
