import { Confirmation, Type } from "meteor/suprakit:ui";
import React from "react";
import { useTranslator } from "/imports/hooks/useTranslator";

export const UserInfoConfirmation = ({ isModalOpen, onClose }) => {
	const t = useTranslator();

	if (!isModalOpen) return null;

	return (
		<Confirmation
			isOpen={isModalOpen}
			type={Type.Success}
			title={t("LoginPage.modalConfirmationTitle")}
			subTitle={t("LoginPage.modalConfirmationMessage")}
			confirmText={t("standard.close")}
			onConfirm={onClose}
			icon="contact"
		/>
	);
};
