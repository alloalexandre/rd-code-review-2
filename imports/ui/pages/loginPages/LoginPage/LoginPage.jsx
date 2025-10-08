import "./LoginPageStyle.less";

import React from "react";
import { useAuthForm } from "./hooks/useAuthForm";
import { LoginForm } from "./LoginForm/LoginForm";
import { ResetPasswordForm } from "./ResetPasswordForm/ResetPasswordForm";

export const LoginPage = () => {
	const {
		error,
		emailSent,
		isResetPassword,
		handleLogin,
		handleResetPassword,
		switchToResetPassword,
		switchToLogin,
	} = useAuthForm();

	return (
		<div className="LoginPage">
			{isResetPassword ? (
				<ResetPasswordForm
					switchToLogin={switchToLogin}
					handleResetPassword={handleResetPassword}
					error={error}
					emailSent={emailSent}
				/>
			) : (
				<LoginForm
					switchToResetPassword={switchToResetPassword}
					handleLogin={handleLogin}
					error={error}
				/>
			)}
		</div>
	);
};
