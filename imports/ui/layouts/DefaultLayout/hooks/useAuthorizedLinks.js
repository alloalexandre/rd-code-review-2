import { getAllAuthorizedFullPathsForRoute } from "meteor/suprakit:ui";
import { ALL_ROLES } from "/imports/globals/roles";
import { useUserId } from "/imports/hooks/useUserId";
import { APP_ROUTES } from "/imports/routes/routePaths";

export const useAuthorizedLinks = (locationData) => {
	const userId = useUserId();

	const buildLink = (route, { label, displayTo, iconName }) => ({
		path: route.path,
		label,
		displayTo,
		iconName,
		highlightedByRoutes: getAllAuthorizedFullPathsForRoute(
			route,
			userId,
			locationData,
		),
	});

	return [
		buildLink(APP_ROUTES.settings, {
			label: "Paramètres",
			displayTo: [ALL_ROLES.admin.id],
			iconName: "o-cog-6-tooth",
		}),
		buildLink(APP_ROUTES.userManagement, {
			label: "Accès",
			displayTo: [ALL_ROLES.superAdmin.id, ALL_ROLES.admin.id],
			iconName: "o-key",
		}),
	];
};
