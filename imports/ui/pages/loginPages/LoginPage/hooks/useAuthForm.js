import { Accounts } from "meteor/accounts-base";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useUser } from "/imports/hooks/useUser";

export function useAuthForm() {
	const [error, setError] = useState(false);
	const [emailSent, setEmailSent] = useState(false);
	const [isResetPassword, setIsResetPassword] = useState(false);

	const navigate = useNavigate();
	const location = useLocation();
	const from = location.state?.from?.pathname || "/";

	const user = useUser();

	// Redirect if already logged in
	useTracker(() => {
		if (user) navigate(from, { replace: true });
	}, [user]);

	const handleLogin = (values, actions) => {
		actions.setSubmitting(true);
		Meteor.loginWithPassword(values.email, values.password, (err) => {
			if (err) {
				setError(true);
				actions.setSubmitting(false);
			} else {
				setError(false);
				navigate(from, { replace: true });
			}
		});
	};

	const handleResetPassword = (values, actions) => {
		actions.setSubmitting(true);
		Accounts.forgotPassword({ email: values.email }, (err) => {
			if (err) {
				setError(true);
				actions.setSubmitting(false);
			} else {
				setEmailSent(true);
				setError(false);
			}
		});
	};

	const switchToResetPassword = () => {
		setIsResetPassword(true);
		setError(false);
	};

	const switchToLogin = () => {
		setIsResetPassword(false);
		setError(false);
		setEmailSent(false);
	};

	return {
		error,
		emailSent,
		isResetPassword,
		handleLogin,
		handleResetPassword,
		switchToResetPassword,
		switchToLogin,
	};
}
