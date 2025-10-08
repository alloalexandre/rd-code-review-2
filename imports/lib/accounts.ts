import { Accounts } from "meteor/accounts-base";
import { PASSWORD_STRENGTH } from "./passwordStrength";

Accounts.passwordStrength = {
	rules: {
		upperCase: PASSWORD_STRENGTH.REQUIRE_UPPERCASE,
		lowerCase: PASSWORD_STRENGTH.REQUIRE_LOWERCASE,
		digits: PASSWORD_STRENGTH.REQUIRE_DIGIT,
		specialCharacters: PASSWORD_STRENGTH.REQUIRE_SPECIAL,
	},
	strengthTextArr: ["", "Low", "Medium", "High", "Strong"],
};
