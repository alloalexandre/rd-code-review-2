import { describe, expect, it } from "vitest";
import type { RoleId } from "/imports/globals/roles";
import { determineAccountEmailType } from "../determineAccountEmailType";
import { isActiveRole } from "../isActiveRole";
import { isEmailVerified } from "../isEmailVerified";
import { isValidUser } from "../isValidUser";
import { sanitizeProfileData } from "../sanitizeProfileData";
import { validateImpersonationPermission } from "../validateImpersonationPermission";
import { validateImpersonationRequest } from "../validateImpersonationRequest";
import { validateProfileUpdate } from "../validateProfileUpdate";
import { validateUserAccess } from "../validateUserAccess";

describe("User Validation Services", () => {
	describe("isValidUser", () => {
		it("should return true for valid user", () => {
			const user = { _id: "123", name: "John" };
			expect(isValidUser(user)).toBe(true);
		});

		it("should return false for null user", () => {
			expect(isValidUser(undefined)).toBe(false);
		});

		it("should return false for user without _id", () => {
			const user = { username: "John" };
			expect(isValidUser(user)).toBe(false);
		});
	});

	describe("isEmailVerified", () => {
		it("should return true for verified email", () => {
			const user = {
				emails: [{ address: "test@example.com", verified: true }],
			};
			expect(isEmailVerified(user)).toBe(true);
		});

		it("should return false for unverified email", () => {
			const user = {
				emails: [{ address: "test@example.com", verified: false }],
			};
			expect(isEmailVerified(user)).toBe(false);
		});

		it("should return false for user without emails", () => {
			const user = {};
			expect(isEmailVerified(user)).toBe(false);
		});
	});

	describe("determineAccountEmailType", () => {
		it('should return "reset" for verified user', () => {
			const user = {
				_id: "123",
				emails: [{ address: "test@example.com", verified: true }],
			};
			expect(determineAccountEmailType(user)).toBe("reset");
		});

		it('should return "enrollment" for unverified user', () => {
			const user = {
				_id: "123",
				emails: [{ address: "test@example.com", verified: false }],
			};
			expect(determineAccountEmailType(user)).toBe("enrollment");
		});

		it('should return "none" for invalid user', () => {
			expect(determineAccountEmailType(undefined)).toBe("none");
		});
	});
});

describe("Impersonation Services", () => {
	describe("validateImpersonationPermission", () => {
		it("should allow super admin to impersonate", () => {
			const result = validateImpersonationPermission({
				isSuperAdminUser: true,
				isSuperAdminTarget: false,
				token: undefined,
			});
			expect(result.isAllowed).toBe(true);
		});

		it("should allow with token and super admin target", () => {
			const result = validateImpersonationPermission({
				isSuperAdminUser: false,
				isSuperAdminTarget: true,
				token: "valid-token",
			});
			expect(result.isAllowed).toBe(true);
		});

		it("should deny without proper permissions", () => {
			const result = validateImpersonationPermission({
				isSuperAdminUser: false,
				isSuperAdminTarget: false,
				token: undefined,
			});
			expect(result.isAllowed).toBe(false);
		});
	});

	describe("validateImpersonationRequest", () => {
		it("should validate valid request", () => {
			const result = validateImpersonationRequest({
				toUserId: "user1",
				fromUserId: "user2",
			});
			expect(result.isValid).toBe(true);
		});

		it("should reject self-impersonation", () => {
			const result = validateImpersonationRequest({
				toUserId: "user1",
				fromUserId: "user1",
			});
			expect(result.isValid).toBe(false);
			expect(result.errors).toContain("Cannot impersonate yourself");
		});
	});
});

describe("Role Management Services", () => {
	describe("isActiveRole", () => {
		it("should return true for active role", () => {
			const revokedRoles = ["revoked1", "revoked2"];
			expect(isActiveRole("active" as RoleId, revokedRoles as RoleId[])).toBe(
				true,
			);
		});

		it("should return false for revoked role", () => {
			const revokedRoles = ["revoked1", "revoked2"];
			expect(isActiveRole("revoked1" as RoleId, revokedRoles as RoleId[])).toBe(
				false,
			);
		});
	});

	describe("validateUserAccess", () => {
		it("should validate user with access", () => {
			const user = { _id: "123" };
			const access = { role: "admin" };
			const result = validateUserAccess(user, access);
			expect(result.isValid).toBe(true);
		});

		it("should reject user without access", () => {
			const user = { _id: "123" };
			const access = undefined;
			const result = validateUserAccess(user, access);
			expect(result.isValid).toBe(false);
		});
	});
});

describe("User Profile Services", () => {
	describe("sanitizeProfileData", () => {
		it("should trim profile data", () => {
			const result = sanitizeProfileData({
				firstName: "  John  ",
				lastName: "  Doe  ",
			});
			expect(result).toEqual({
				firstName: "John",
				lastName: "Doe",
			});
		});
	});

	describe("validateProfileUpdate", () => {
		it("should validate good profile data", () => {
			const result = validateProfileUpdate({
				firstName: "John",
				lastName: "Doe",
			});
			expect(result.isValid).toBe(true);
		});

		it("should reject empty names", () => {
			const result = validateProfileUpdate({
				firstName: "",
				lastName: "Doe",
			});
			expect(result.isValid).toBe(false);
			expect(result.errors.length).toBeGreaterThan(0);
		});
	});
});
