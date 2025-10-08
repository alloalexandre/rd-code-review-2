import { useAlert } from "@blaumaus/react-alert";
import { useQueryClient } from "@tanstack/react-query";
import { handleError, useMutationHook } from "meteor/suprakit:ui";
import * as Yup from "yup";
import { useTranslator } from "/imports/hooks/useTranslator";
import { useUserRole } from "/imports/hooks/useUserRole";
import {
	getAllChildrenRoles,
	getRolesByIds,
} from "/imports/utils/roleManagement";

export function useUpdateUser({ onClose, modalValues }) {
	const t = useTranslator();
	const alert = useAlert();
	const queryClient = useQueryClient();

	const userRole = useUserRole();

	const { mutate: updateUser } = useMutationHook(
		"UserAccess.methods.updateUserAccess",
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

	const initialValues = {
		firstName: modalValues?.firstName || "",
		lastName: modalValues?.lastName || "",
		role: modalValues?.role || "",
	};

	const validationSchema = Yup.object({
		firstName: Yup.string().required(t("standard.requiredField")),
		lastName: Yup.string().required(t("standard.requiredField")),
		role: Yup.string().required(t("standard.requiredField")),
	});

	const handleSubmit = (values) => {
		if (!modalValues?.userId) return;
		updateUser({ userId: modalValues.userId, ...values });
	};

	const roleIds = getAllChildrenRoles(userRole);
	const roleOptions = getRolesByIds(roleIds);

	return {
		initialValues,
		validationSchema,
		handleSubmit,
		roleOptions,
	};
}
