import { describe, expect, it } from "vitest";
import { EMPTY_PASSWORD_STRENGTH, getPasswordStrength } from "../password";

/**
 * It's important to check `passwordStrength` so the below tests matches the expected behavior
 */

describe("getPasswordStrength with current PASSWORD_STRENGTH policy", () => {
	it("should return empty strength for empty password", () => {
		const result = getPasswordStrength("   ");
		expect(result).toEqual({
			strength: EMPTY_PASSWORD_STRENGTH,
			isAtRequiredStrength: false,
		});
	});

	it("should calculate full strength when lowercase + min length", () => {
		const password = "abcdef"; // lowercase + min length
		const result = getPasswordStrength(password);

		expect(result.strength).toBe(2); // 1 rule + min length
		expect(result.isAtRequiredStrength).toBe(true);
	});

	it("should calculate partial strength if too short", () => {
		const password = "abc"; // lowercase but < min length
		const result = getPasswordStrength(password);

		expect(result.strength).toBe(1); // lowercase only
		expect(result.isAtRequiredStrength).toBe(false);
	});

	it("should calculate 0 strength if no rules met and too short", () => {
		const password = "123"; // no lowercase, < min length
		const result = getPasswordStrength(password);

		expect(result.strength).toBe(0);
		expect(result.isAtRequiredStrength).toBe(false);
	});
});
