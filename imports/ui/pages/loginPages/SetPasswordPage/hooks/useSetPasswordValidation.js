import * as Yup from "yup";
import { useTranslator } from "/imports/hooks/useTranslator";
import { PASSWORD_STRENGTH } from "/imports/lib/passwordStrength";

const LOWERCASE_REGEX = /(?=.*[A-Z])/;
const UPPERCASE_REGEX = /(?=.*[a-z])/;

export function useSetPasswordValidation() {
	const t = useTranslator();

	return Yup.object({
		password: Yup.string()
			.min(
				PASSWORD_STRENGTH.MIN_LENGTH,
				t("LoginPage.passwordReset.passwordMinChar", {
					minChar: PASSWORD_STRENGTH.MIN_LENGTH,
				}),
			)
			.matches(UPPERCASE_REGEX, t("LoginPage.passwordReset.upperCaseRequired"))
			.matches(LOWERCASE_REGEX, t("LoginPage.passwordReset.lowerCaseRequired"))
			.required(t("standard.requiredField")),
		repeatedPassword: Yup.string()
			.oneOf(
				[Yup.ref("password"), undefined],
				t("LoginPage.passwordReset.passwordsMustMatch"),
			)
			.required(t("standard.requiredField")),
	});
}
