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

export function LoginForm({ handleLogin, error, switchToResetPassword }) {
	const t = useTranslator();

	return (
		<Formik
			initialValues={{ email: "", password: "" }}
			validationSchema={Yup.object({
				email: Yup.string()
					.email(t("LoginPage.emailValidationError"))
					.required(t("standard.requiredField")),
				password: Yup.string().required(t("standard.requiredField")),
			})}
			onSubmit={handleLogin}
		>
			{({ isSubmitting, isValid, dirty }) => {
				const disabled = isSubmitting || !isValid || !dirty;
				return (
					<Form className="formArea flex-flex-col gap-5" noValidate={true}>
						<div className="flex flex-col gap-2">
							<h1>{t("LoginPage.title")}</h1>
							<h2>{t("LoginPage.subTitle")}</h2>
						</div>
						<TextInput
							direction={Direction.Vertical}
							label={t("LoginPage.emailPlaceholder")}
							placeholder={t("LoginPage.emailPlaceholder")}
							name="email"
							type={Type.Text}
						/>
						<TextInput
							direction={Direction.Vertical}
							label={t("LoginPage.passwordPlaceholder")}
							placeholder={t("LoginPage.passwordPlaceholder")}
							name="password"
							type={Type.Password}
						/>
						<ErrorMessage message={error && t("LoginPage.errorMessage")} />
						<SubmitButton
							text={t("LoginPage.loginButton")}
							disabled={disabled}
						/>
						<div className="switchArea">
							<Button
								className="logoutButton"
								hierarchy={Hierarchy.Tertiary}
								text={t("LoginPage.forgotPasswordButton")}
								onClick={switchToResetPassword}
							/>
						</div>
					</Form>
				);
			}}
		</Formik>
	);
}
