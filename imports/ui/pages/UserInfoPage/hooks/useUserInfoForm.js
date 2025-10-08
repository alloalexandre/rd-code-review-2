import { useMemo } from "react";
import * as Yup from "yup";
import { useTranslator } from "/imports/hooks/useTranslator";

export const useUserInfoForm = (userInfo, updateUserInfo) => {
	const t = useTranslator();

	const initialValues = useMemo(
		() => ({
			firstName: userInfo?.firstName || "",
			lastName: userInfo?.lastName || "",
		}),
		[userInfo],
	);

	const validationSchema = useMemo(
		() =>
			Yup.object().shape({
				firstName: Yup.string().required(t("standard.requiredField")),
				lastName: Yup.string().required(t("standard.requiredField")),
			}),
		[t],
	);

	const handleSubmit = (values) => {
		const { email: _email, ...rest } = values;
		updateUserInfo(rest);
	};

	return { initialValues, validationSchema, handleSubmit };
};
