/**
 * This is a test file for the 'myBusinessFunction' business logic function.
 */

import { describe, expect, it } from "vitest";
import { myBusinessFunction } from "../myBusinessFunction";

describe("myBusinessFunction", () => {
	it("should return the expected string", () => {
		const result = myBusinessFunction();
		expect(result).toBe("Client-side business logic executed on the server");
	});
});
