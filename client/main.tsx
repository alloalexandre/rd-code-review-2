import "/imports/startup/both";
import "/imports/startup/client";

import { Meteor } from "meteor/meteor";
import React from "react";
import { createRoot } from "react-dom/client";
import { Helmet } from "react-helmet";
import { App } from "/imports/ui/App";

Meteor.startup(() => {
	const container = document.getElementById("react-target");
	if (!container) {
		throw new Error('Element with id "react-target" not found');
	}
	const root = createRoot(container);
	root.render(
		<>
			<Helmet>
				<title>Nom de l'application</title>
				<meta name="description" content="Description de l'application" />
				<link rel="shortcut icon" href="/favicon.png" />

				<meta http-equiv="content-type" content="text/html;charset=utf-8" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0,user-scalable=no"
				/>

				{/* Icomoon */}
				<link
					rel="stylesheet"
					href="https://i.icomoon.io/public/dc40e70968/ALLOHOUSTONV2/style.css"
				/>

				{/* Google Fonts */}
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link
					rel="preconnect"
					href="https://fonts.gstatic.com"
					crossOrigin="anonymous"
				/>
				<link
					href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
					rel="stylesheet"
				/>
			</Helmet>
			<App />
		</>,
	);
});
