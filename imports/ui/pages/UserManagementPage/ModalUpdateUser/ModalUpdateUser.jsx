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
import { useUpdateUser } from "./hooks/useUpdateUser";

export const ModalUpdateUser = ({ onClose, modalValues }) => {
	const t = useTranslator();
	const { initialValues, validationSchema, handleSubmit, roleOptions } =
		useUpdateUser({ onClose, modalValues });

	if (!modalValues) {
		return null;
	}

	return (
		<>
			<ModalHeader title={t("UserManagementPage.form.updateTitle")} />
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
						<Form className="ModalUpdateUser">
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
									text={t("UserManagementPage.modifyUser")}
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
