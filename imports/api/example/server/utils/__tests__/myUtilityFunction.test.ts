/**
 * This is a test file for the 'myUtilityFunction' utility function.
 *
 * We use Vitest as our testing framework.
 * @see https://vitest.dev/
 */

import { describe, expect, it } from "vitest";
import { myUtilityFunction } from "../myUtilityFunction";

describe("myUtilityFunction", () => {
	it("should return the expected string", () => {
		const result = myUtilityFunction();
		expect(result).toBe("This is a utility function");
	});
});
