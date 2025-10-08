import "./SetPasswordPage.less";

import { Form, Formik } from "formik";
import { Button, Direction, TextInput, Theme, Type } from "meteor/suprakit:ui";
import React from "react";
import { useTranslator } from "/imports/hooks/useTranslator";
import { PASSWORD_STRENGTH } from "/imports/lib/passwordStrength";
import { useSetPassword } from "./hooks/useSetPassword";
import { useSetPasswordValidation } from "./hooks/useSetPasswordValidation";
import { PageHeading } from "./PageHeading/PageHeading";

export const SetPasswordPage = () => {
	const t = useTranslator();
	const { isSignupPage, handleSubmit } = useSetPassword();
	const validationSchema = useSetPasswordValidation();

	return (
		<div className="SetPasswordPage">
			<Formik
				initialValues={{ password: "", repeatedPassword: "" }}
				validationSchema={validationSchema}
				onSubmit={handleSubmit}
			>
				{({ isSubmitting, isValid, dirty }) => (
					<Form className="formArea flex-flex-col gap-10">
						<PageHeading isSignup={isSignupPage} />

						<p className="passwordRulesArea">
							{t("LoginPage.passwordReset.passwordRules", {
								minChar: PASSWORD_STRENGTH.MIN_LENGTH,
							})}
						</p>

						<TextInput
							direction={Direction.Vertical}
							placeholder={t("LoginPage.passwordReset.newPassword")}
							label={t("LoginPage.passwordReset.newPassword")}
							name="password"
							type={Type.Password}
						/>

						<TextInput
							direction={Direction.Vertical}
							placeholder={t("LoginPage.passwordReset.repeatPassword")}
							label={t("LoginPage.passwordReset.repeatPassword")}
							name="repeatedPassword"
							type={Type.Password}
						/>

						<div className="submitArea">
							<Button
								type={Type.Submit}
								theme={Theme.Dark}
								disabled={isSubmitting || !isValid || !dirty}
								text={t("LoginPage.passwordReset.resetPasswordButton")}
							/>
						</div>
					</Form>
				)}
			</Formik>
		</div>
	);
};
