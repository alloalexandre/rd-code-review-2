import { PASSWORD_STRENGTH } from "../lib/passwordStrength";

export const REQUIRE_DIGIT_REGEX = /\d/;
export const REQUIRE_LOWERCASE_REGEX = /[a-z]/;
export const REQUIRE_UPPERCASE_REGEX = /[A-Z]/;
export const REQUIRE_SPECIAL_REGEX = /[^a-zA-Z0-9]/;

export const EMPTY_PASSWORD_STRENGTH = -1 as const;

type PasswordStrengthResult = {
	strength: number;
	isAtRequiredStrength: boolean;
};

/**
 * Returns an object containing the password strength and whether the password meets the required strength.
 *
 * The password strength is calculated based on the following rules:
 * - Minimum length (defined in PASSWORD_STRENGTH.MIN_LENGTH)
 * - Require digit (defined in PASSWORD_STRENGTH.REQUIRE_DIGIT)
 * - Require lowercase letter (defined in PASSWORD_STRENGTH.REQUIRE_LOWERCASE)
 * - Require uppercase letter (defined in PASSWORD_STRENGTH.REQUIRE_UPPERCASE)
 * - Require special character (defined in PASSWORD_STRENGTH.REQUIRE_SPECIAL)
 *
 * The strength is calculated as follows:
 * - If the password meets a rule, the strength is incremented by 1
 * - If the password does not meet any rule, the strength is set to -1
 * - The maximum strength is the number of enabled rules + 1 (for minimum length)
 */
export function getPasswordStrength(password: string): PasswordStrengthResult {
	if (typeof password !== "string") {
		throw new TypeError("Password must be a string");
	}

	const trimmedPassword = password.trim();
	if (!trimmedPassword) {
		return {
			strength: EMPTY_PASSWORD_STRENGTH,
			isAtRequiredStrength: false,
		};
	}

	// Define the rules with regex dynamically
	const rules = [
		{ enabled: PASSWORD_STRENGTH.REQUIRE_DIGIT, regex: REQUIRE_DIGIT_REGEX },
		{
			enabled: PASSWORD_STRENGTH.REQUIRE_LOWERCASE,
			regex: REQUIRE_LOWERCASE_REGEX,
		},
		{
			enabled: PASSWORD_STRENGTH.REQUIRE_UPPERCASE,
			regex: REQUIRE_UPPERCASE_REGEX,
		},
		{
			enabled: PASSWORD_STRENGTH.REQUIRE_SPECIAL,
			regex: REQUIRE_SPECIAL_REGEX,
		},
	].filter((rule) => rule.enabled); // Only keep enabled rules

	// Count the number of enabled rules and the max strength
	const enabledRulesCount = rules.length;
	const maxStrength = enabledRulesCount + 1; // +1 for minimum length
	let strength = 0;

	// Check each rule
	for (const rule of rules) {
		if (rule.regex.test(trimmedPassword)) {
			strength++;
		}
	}

	// Add 1 if password meets minimum length
	if (trimmedPassword.length >= PASSWORD_STRENGTH.MIN_LENGTH) {
		strength++;
	}

	return {
		strength,
		isAtRequiredStrength: strength === maxStrength,
	};
}
