import { ApplicationLayout, MenuLink } from "meteor/suprakit:ui";
import React from "react";
import { useLocationData } from "/imports/hooks/useLocationData";
import { useAuthorizedLinks } from "./hooks/useAuthorizedLinks";

export const DefaultLayout = ({ showHelpScoutButton = true }) => {
	const locationData = useLocationData();
	const bottomMenuLinks = useAuthorizedLinks(locationData);

	return (
		<ApplicationLayout
			showHelpScoutButton={showHelpScoutButton}
			topLinks={
				<>
					{/*<MenuSection*/}
					{/*    label={"Exemple de section"}*/}
					{/*    closedLabel={"Cont."}*/}
					{/*    displayTo={[ALL_ROLES.admin.id]}*/}
					{/*/>*/}
					{/*<MenuLink*/}
					{/*    path={APP_ROUTES.page1.path}*/}
					{/*    label={"Page 1"}*/}
					{/*    displayTo={[ALL_ROLES.admin.id]}*/}
					{/*    iconName={"o-flag"}*/}
					{/*    highlightedByRoutes={getAllAuthorizedFullPathsForRoute(APP_ROUTES.page1, Meteor.userId(), locationData)}*/}
					{/*    rememberLastVisitedRoute={true}*/}
					{/*/>*/}
				</>
			}
			bottomLinks={bottomMenuLinks.map((link) => (
				<MenuLink key={link.path} {...link} />
			))}
		/>
	);
};
