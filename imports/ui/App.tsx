import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Meteor } from "meteor/meteor";
import i18n from "meteor/universe:i18n";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "/imports/routes/routes";
import { GlobalsWrapper } from "./components/GlobalsWrapper/GlobalsWrapper";
import { ErrorBoundaryWrapper } from "./ErrorBoundaryWrapper";
import { Providers } from "./Providers";

export const App = (): JSX.Element => {
	document.documentElement.lang = i18n.getLocale();

	return (
		<Providers>
			<BrowserRouter>
				<ErrorBoundaryWrapper>
					<GlobalsWrapper>
						<AppRoutes />
					</GlobalsWrapper>
				</ErrorBoundaryWrapper>
			</BrowserRouter>
			{Meteor.isDevelopment && <ReactQueryDevtools initialIsOpen={false} />}
		</Providers>
	);
};
