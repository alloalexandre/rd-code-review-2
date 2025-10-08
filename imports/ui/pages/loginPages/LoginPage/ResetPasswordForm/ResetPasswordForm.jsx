import { Form, Formik } from "formik";
import {
	Button,
	Direction,
	Hierarchy,
	TextInput,
	Type,
} from "meteor/suprakit:ui";
import React from "react";
import * as Yup from "yup";
import { useTranslator } from "/imports/hooks/useTranslator";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import { SubmitButton } from "../SubmitButton/SubmitButton";

export function ResetPasswordForm({
	error,
	handleResetPassword,
	emailSent,
	switchToLogin,
}) {
	const t = useTranslator();

	return (
		<Formik
			initialValues={{ email: "" }}
			validationSchema={Yup.object({
				email: Yup.string()
					.email(t("LoginPage.emailValidationError"))
					.required(t("standard.requiredField")),
			})}
			onSubmit={handleResetPassword}
		>
			{({ isSubmitting, isValid, dirty }) => {
				const disabled = isSubmitting || !isValid || !dirty;
				return (
					<Form className="formArea" noValidate={true}>
						<h1>{t("LoginPage.passwordReset.title")}</h1>
						<TextInput
							direction={Direction.Vertical}
							className="textInput"
							placeholder={t("LoginPage.emailPlaceholder")}
							name="email"
							type={Type.Text}
							required={true}
						/>
						<ErrorMessage
							message={error && t("LoginPage.passwordReset.incorrectEmail")}
						/>
						<SubmitButton
							text={t("LoginPage.passwordReset.emailButton")}
							disabled={disabled}
						/>
						{emailSent && (
							<div className="emailSent">
								{t("LoginPage.passwordReset.emailSent")}
							</div>
						)}
						<div className="switchArea">
							<Button
								className="logoutButton"
								hierarchy={Hierarchy.Tertiary}
								text={t("LoginPage.passwordReset.returnToLogin")}
								onClick={switchToLogin}
							/>
						</div>
					</Form>
				);
			}}
		</Formik>
	);
}
