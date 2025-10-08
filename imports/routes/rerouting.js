import { ALL_ROLES } from "/imports/globals/roles";
import { APP_ROUTES } from "./routePaths";

/**
 * This is the default rerouting configuration.
 * Rerouting means redirecting the user to a different page depending on its role after login.
 */
export const DEFAULT_REROUTING = [
	{
		role: ALL_ROLES.admin.id,
		redirectTo: {
			path: APP_ROUTES.settings.path,
			params: {},
			searchParams: {},
		},
	},
];
