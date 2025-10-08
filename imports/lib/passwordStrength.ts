/**
 * This module is used to set the password strength policy.
 *
 * See https://github.com/cdolek/useraccounts-password-strength
 */

export const PASSWORD_POLICY = {
	NUMBER_OF_FAILED_ATTEMPTS_BEFORE_LOCK: 5,
	MINUTES_FOR_ACCOUNT_LOCK_ON_ERROR: 30,
} as const;

export const PASSWORD_STRENGTH = {
	MIN_LENGTH: 6,
	REQUIRE_DIGIT: false,
	REQUIRE_LOWERCASE: true,
	REQUIRE_UPPERCASE: false,
	REQUIRE_SPECIAL: false,
} as const;
