import { Form } from "formik";
import { Button, FormikWrapper, Hierarchy, Type } from "meteor/suprakit:ui";
import React from "react";
import { useTranslator } from "/imports/hooks/useTranslator";
import { TextInputField } from "../TextInputField/TextInputField";

export const UserInfoForm = ({
	initialValues,
	validationSchema,
	handleSubmit,
	isPending,
	resetPassword,
}) => {
	const t = useTranslator();

	return (
		<FormikWrapper
			initialValues={initialValues}
			validationSchema={validationSchema}
			validateOnMount={true}
			onSubmit={handleSubmit}
		>
			{(formikProps) => (
				<Form className="flex w-full flex-col gap-4" noValidate={true}>
					<div className="flex flex-col items-center gap-4">
						<TextInputField
							name="lastName"
							placeholder="LoginPage.lastName"
							label="LoginPage.lastName"
						/>
						<TextInputField
							name="firstName"
							placeholder="LoginPage.firstName"
							label="LoginPage.firstName"
						/>

						<Button
							showSpinner={isPending}
							className="w-1/4"
							disabled={
								formikProps.isSubmitting ||
								!formikProps.isValid ||
								!formikProps.dirty
							}
							type={Type.Submit}
							hierarchy={Hierarchy.Primary}
							text={t("standard.save")}
						/>

						<Button
							className="w-1/4"
							type={Type.Button}
							hierarchy={Hierarchy.Tertiary}
							text={t("LoginPage.resetPassword")}
							onClick={() => resetPassword({})}
						/>
					</div>
				</Form>
			)}
		</FormikWrapper>
	);
};
