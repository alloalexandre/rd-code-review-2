import { useAlert } from "@blaumaus/react-alert";
import { handleError, useMutationHook } from "meteor/suprakit:ui";
import { useState } from "react";
import { useTranslator } from "/imports/hooks/useTranslator";

export const useUserInfoMutations = () => {
	const t = useTranslator();
	const alert = useAlert();
	const [isModalOpen, setIsModalOpen] = useState(false);

	const { mutate: updateUserInfo, isPending } = useMutationHook(
		"Meteor.users.methods.updateInfoUser",
		{
			onSuccess: () => alert.success(t("standard.success")),
			onError: handleError(alert, t),
		},
	);

	const { mutate: resetPassword } = useMutationHook(
		"Meteor.users.methods.resetPasswordEmail",
		{
			onSuccess: () => setIsModalOpen(true),
			onError: handleError(alert, t),
		},
	);

	return {
		updateUserInfo,
		resetPassword,
		isPending,
		isModalOpen,
		setIsModalOpen,
	};
};
