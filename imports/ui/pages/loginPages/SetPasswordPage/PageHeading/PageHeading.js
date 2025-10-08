import React from "react";
import { useTranslator } from "/imports/hooks/useTranslator";

export const PageHeading = ({ isSignup }) => {
	const t = useTranslator();
	return (
		<div className="flex flex-col gap-2">
			<h1>
				{isSignup
					? t("LoginPage.createAccountTitle")
					: t("LoginPage.passwordReset.title")}
			</h1>
		</div>
	);
};
