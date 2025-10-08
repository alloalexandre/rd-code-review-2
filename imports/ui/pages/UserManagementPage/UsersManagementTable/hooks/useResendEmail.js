import { useAlert } from "@blaumaus/react-alert";
import { handleError, useMutationHook } from "meteor/suprakit:ui";
import { useTranslator } from "/imports/hooks/useTranslator";

export function useResendEmail() {
	const t = useTranslator();
	const alert = useAlert();

	return useMutationHook("Meteor.users.methods.resendAccountEmail", {
		onSuccess: () => alert.success(t("standard.sent")),
		onError: handleError(alert, t),
	});
}
