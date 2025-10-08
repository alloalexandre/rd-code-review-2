import { useAlert } from "@blaumaus/react-alert";
import { handleError, useQueryHook } from "meteor/suprakit:ui";
import { useTranslator } from "/imports/hooks/useTranslator";

export const useUserAccesses = (selectedRole) => {
	const alert = useAlert();
	const t = useTranslator();

	const {
		data: users,
		refetch: refetchUsers,
		isLoading: isLoadingUsers,
	} = useQueryHook(
		"UserAccess.methods.getUserAccessesByRole",
		{ role: selectedRole },
		[selectedRole],
		{ onError: handleError(alert, t) },
	);

	return { users, refetchUsers, isLoadingUsers };
};
