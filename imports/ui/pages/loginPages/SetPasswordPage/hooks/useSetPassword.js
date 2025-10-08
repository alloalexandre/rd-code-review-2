import { useAlert } from "@blaumaus/react-alert";
import { Accounts } from "meteor/accounts-base";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslator } from "/imports/hooks/useTranslator";
import { APP_ROUTES } from "/imports/routes/routePaths";

export function useSetPassword() {
	const { token } = useParams();
	const { pathname } = useLocation();
	const navigate = useNavigate();
	const alert = useAlert();
	const t = useTranslator();

	const isSignupPage = pathname.includes("signup");

	const handleSubmit = (values) => {
		if (!token) {
			console.error("No token provided");
			return;
		}

		Accounts.resetPassword(token, values.password, (err) => {
			if (err) {
				console.error("Can't reset password", err);
				alert.error(t("standard.error"));
			} else {
				navigate(APP_ROUTES.root.path);
			}
		});
	};

	return {
		isSignupPage,
		handleSubmit,
	};
}
