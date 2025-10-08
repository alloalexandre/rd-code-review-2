import { Page, PageContent, PageHeader } from "meteor/suprakit:ui";
import React from "react";
import { APP_ROUTES } from "/imports/routes/routePaths";

export const SettingsPage = () => (
	<Page className={"SettingsPage"}>
		<PageHeader
			routes={APP_ROUTES}
			title={"Paramètres"}
			subTitle={"Page des paramètres généraux de l'application"}
		/>

		<PageContent>
			<h1>Réglages de l'application</h1>
			<h2>TODO</h2>
		</PageContent>
	</Page>
);
