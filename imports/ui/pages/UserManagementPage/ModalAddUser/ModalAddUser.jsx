import { Form } from "formik";
import {
	Button,
	FormikWrapper,
	Hierarchy,
	ModalContent,
	ModalFooter,
	ModalHeader,
	SelectInput,
	TextInput,
	Type,
} from "meteor/suprakit:ui";
import React from "react";
import { useTranslator } from "/imports/hooks/useTranslator";
import { useAddUser } from "./hooks/useAddUser";

export const ModalAddUser = ({ onClose }) => {
	const t = useTranslator();
	const { initialValues, validationSchema, handleSubmit, roleOptions } =
		useAddUser({ onClose });

	return (
		<>
			<ModalHeader title={t("UserManagementPage.form.createTitle")} />
			<FormikWrapper
				initialValues={initialValues}
				validationSchema={validationSchema}
				onSubmit={handleSubmit}
			>
				{(formikProps) => {
					const disabled =
						formikProps.isSubmitting ||
						!formikProps.isValid ||
						!formikProps.dirty;

					return (
						<Form className="ModalAddUser">
							<ModalContent>
								<TextInput
									className="w-full"
									name="firstName"
									type={Type.Text}
									label={t("UserManagementPage.form.firstName")}
									placeholder={t("UserManagementPage.form.firstName")}
								/>
								<TextInput
									name="lastName"
									type={Type.Text}
									className="w-full"
									label={t("UserManagementPage.form.lastName")}
									placeholder={t("UserManagementPage.form.lastName")}
								/>
								<TextInput
									name="email"
									type={Type.Text}
									className="w-full"
									label={t("UserManagementPage.form.email")}
									placeholder={t("UserManagementPage.form.email")}
								/>
								<SelectInput
									name="role"
									className="w-full"
									options={roleOptions}
									label={t("UserManagementPage.form.role")}
									placeholder={t("UserManagementPage.form.role")}
								/>
							</ModalContent>
							<ModalFooter>
								<Button
									className="w-full"
									hierarchy={Hierarchy.Secondary}
									text={t("standard.cancel")}
									onClick={onClose}
								/>
								<Button
									className="w-full"
									text={t("UserManagementPage.addUser")}
									type={Type.Submit}
									disabled={disabled}
									onClick={formikProps.submitForm}
								/>
							</ModalFooter>
						</Form>
					);
				}}
			</FormikWrapper>
		</>
	);
};
