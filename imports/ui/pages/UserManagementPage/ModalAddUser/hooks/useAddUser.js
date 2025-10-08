import { useAlert } from "@blaumaus/react-alert";
import { useQueryClient } from "@tanstack/react-query";
import { handleError, useMutationHook } from "meteor/suprakit:ui";
import * as Yup from "yup";
import { ACTIVE_ROLES_OPTIONS } from "/imports/globals/roles";
import { useTranslator } from "/imports/hooks/useTranslator";

export function useAddUser({ onClose }) {
	const t = useTranslator();
	const alert = useAlert();
	const queryClient = useQueryClient();

	const { mutate: createUser } = useMutationHook(
		"UserAccess.methods.createUserAccess",
		{
			onSuccess: async () => {
				alert.success(t("standard.success"));
				await queryClient.invalidateQueries({
					queryKey: ["UserAccess.methods.getUserAccessesByRole"],
				});
				onClose();
			},
			onError: handleError(alert, t),
		},
	);

	const initialValues = { firstName: "", lastName: "", email: "", role: "" };

	const validationSchema = Yup.object({
		firstName: Yup.string().required(t("standard.requiredField")),
		lastName: Yup.string().required(t("standard.requiredField")),
		email: Yup.string()
			.email(t("standard.emailValidationError"))
			.required(t("standard.requiredField")),
		role: Yup.string().required(t("standard.requiredField")),
	});

	const handleSubmit = (values) => {
		createUser(values);
	};

	return {
		initialValues,
		validationSchema,
		handleSubmit,
		roleOptions: ACTIVE_ROLES_OPTIONS,
	};
}
