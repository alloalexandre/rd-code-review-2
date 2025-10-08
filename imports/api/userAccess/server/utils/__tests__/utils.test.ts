import { describe, expect, it, vi } from "vitest";
import type { RoleId } from "/imports/globals/roles";
import { checkUserExists } from "../checkUserExists";
import { isValidRole } from "../isValidRole";
import { sanitizeUserCreationData } from "../sanitizeUserCreationData";
import { sanitizeUserUpdateData } from "../sanitizeUserUpdateData";
import { validateAuthentication } from "../validateAuthentication";
import { validateCurrentUserAccess } from "../validateCurrentUserAccess";
import { validateRoleAssignment } from "../validateRoleAssignment";
import { validateRoleQuery } from "../validateRoleQuery";
import { validateRoleUpdate } from "../validateRoleUpdate";
import { validateUserAccessExists } from "../validateUserAccessExists";
import { validateUserAccessPermission } from "../validateUserAccessPermission";
import { validateUserCreationData } from "../validateUserCreationData";
import { validateUserUpdateData } from "../validateUserUpdateData";

describe("UserAccess Services", () => {
	describe("User Creation Services", () => {
		describe("validateUserCreationData", () => {
			it("should validate complete user data", () => {
				const userData = {
					firstName: "John",
					lastName: "Doe",
					email: "john.doe@example.com",
					role: "admin" as RoleId,
				};
				const result = validateUserCreationData(userData);
				expect(result.isValid).toBe(true);
			});

			it("should reject missing required fields", () => {
				const userData = {
					firstName: "",
					lastName: "Doe",
					email: "john.doe@example.com",
					role: "admin" as RoleId,
				};
				const result = validateUserCreationData(userData);
				expect(result.isValid).toBe(false);
				expect(result.errors).toContain(
					"First name is required and must be a non-empty string",
				);
			});
		});

		describe("sanitizeUserCreationData", () => {
			it("should trim and lowercase email", () => {
				const userData = {
					firstName: "  John  ",
					lastName: "  Doe  ",
					email: "  JOHN.DOE@EXAMPLE.COM  ",
					role: "admin" as RoleId,
				};
				const result = sanitizeUserCreationData(userData);
				expect(result).toEqual({
					firstName: "John",
					lastName: "Doe",
					email: "john.doe@example.com",
					role: "admin",
				});
			});
		});

		describe("checkUserExists", () => {
			it("should return true for existing user", () => {
				const existingUser = { _id: "123", email: "test@example.com" };
				expect(checkUserExists(existingUser)).toBe(true);
			});

			it("should return false for null user", () => {
				expect(checkUserExists(undefined)).toBe(false);
			});
		});
	});

	describe("Role Assignment Services", () => {
		describe("validateRoleAssignment", () => {
			it("should allow valid role assignment", () => {
				const mockCanAssignRole = vi.fn().mockReturnValue(true);
				const result = validateRoleAssignment(
					"superAdmin",
					"admin",
					mockCanAssignRole,
				);
				expect(result.isValid).toBe(true);
				expect(mockCanAssignRole).toHaveBeenCalledWith("superAdmin", "admin");
			});

			it("should reject invalid role assignment", () => {
				const mockCanAssignRole = vi.fn().mockReturnValue(false);
				const result = validateRoleAssignment(
					"user" as RoleId,
					"admin" as RoleId,
					mockCanAssignRole,
				);
				expect(result.isValid).toBe(false);
				expect(result.reason).toBe("You cannot assign this role");
			});

			it("should reject missing current role", () => {
				const mockCanAssignRole = vi.fn();
				const result = validateRoleAssignment(
					"" as RoleId,
					"admin" as RoleId,
					mockCanAssignRole,
				);
				expect(result.isValid).toBe(false);
				expect(result.reason).toBe("Current user role is required");
			});
		});

		describe("validateRoleUpdate", () => {
			it("should pass validation when no role change", () => {
				const mockCanAssignRole = vi.fn();
				const result = validateRoleUpdate({
					currentUserRole: "admin",
					newRole: undefined,
					canAssignRoleFunction: mockCanAssignRole,
				});
				expect(result.isValid).toBe(true);
			});
		});

		describe("isValidRole", () => {
			it("should validate role against valid roles list", () => {
				const validRoles = ["admin", "user", "superAdmin"] as RoleId[];
				expect(isValidRole("admin", validRoles)).toBe(true);
				expect(isValidRole("invalid" as RoleId, validRoles)).toBe(false);
			});
		});
	});

	describe("User Update Services", () => {
		describe("validateUserUpdateData", () => {
			it("should validate complete update data", () => {
				const updateData = {
					userId: "123",
					role: "admin" as RoleId,
					firstName: "John",
					lastName: "Doe",
				};
				const result = validateUserUpdateData(updateData);
				expect(result.isValid).toBe(true);
			});

			it("should reject missing userId", () => {
				const updateData = {
					userId: "",
					role: "admin" as RoleId,
				};
				const result = validateUserUpdateData(updateData);
				expect(result.isValid).toBe(false);
				expect(result.errors).toContain("User ID is required");
			});
		});

		describe("sanitizeUserUpdateData", () => {
			it("should sanitize only provided fields", () => {
				const updateData = {
					role: "admin" as RoleId,
					firstName: "  John  ",
				};
				const result = sanitizeUserUpdateData(updateData);
				expect(result).toEqual({
					role: "admin",
					firstName: "John",
				});
			});
		});

		describe("validateUserAccessExists", () => {
			it("should validate existing user access", () => {
				const userAccess = { _id: "123", role: "admin" };
				const result = validateUserAccessExists(userAccess);
				expect(result.isValid).toBe(true);
			});

			it("should reject null user access", () => {
				const result = validateUserAccessExists(undefined);
				expect(result.isValid).toBe(false);
				expect(result.reason).toBe("User access record not found");
			});
		});
	});

	describe("Access Control Services", () => {
		describe("validateUserAccessPermission", () => {
			it("should allow super admin to view super admin users", async () => {
				const mockHasRole = vi.fn().mockResolvedValue(true);
				const result = await validateUserAccessPermission({
					requestedRole: "superAdmin",
					superAdminRoleId: "superAdmin",
					hasRoleFunction: mockHasRole,
				});
				expect(result.isValid).toBe(true);
			});

			it("should deny non-super admin from viewing super admin users", async () => {
				const mockHasRole = vi.fn().mockResolvedValue(false);
				const result = await validateUserAccessPermission({
					requestedRole: "superAdmin",
					superAdminRoleId: "superAdmin",
					hasRoleFunction: mockHasRole,
				});
				expect(result.isValid).toBe(false);
			});

			it("should allow viewing non-super admin roles", async () => {
				const mockHasRole = vi.fn();
				const result = await validateUserAccessPermission({
					requestedRole: "admin",
					superAdminRoleId: "superAdmin",
					hasRoleFunction: mockHasRole,
				});
				expect(result.isValid).toBe(true);
			});
		});

		describe("validateRoleQuery", () => {
			it("should validate valid role query", () => {
				const validRoles = ["admin", "user"] as RoleId[];
				const result = validateRoleQuery("admin", validRoles);
				expect(result.isValid).toBe(true);
			});

			it("should reject invalid role query", () => {
				const validRoles = ["admin", "user"] as RoleId[];
				const result = validateRoleQuery("invalid" as RoleId, validRoles);
				expect(result.isValid).toBe(false);
			});
		});
	});

	describe("Authentication Services", () => {
		describe("validateAuthentication", () => {
			it("should validate authenticated user", () => {
				const result = validateAuthentication("validUserId");
				expect(result.isValid).toBe(true);
			});

			it("should reject unauthenticated user", () => {
				const result = validateAuthentication(null);
				expect(result.isValid).toBe(false);
				expect(result.reason).toBe("User must be authenticated");
			});
		});

		describe("validateCurrentUserAccess", () => {
			it("should validate user with access and role", () => {
				const currentAccess = { _id: "123", role: "admin" };
				const result = validateCurrentUserAccess(currentAccess);
				expect(result.isValid).toBe(true);
			});

			it("should reject user without access", () => {
				const result = validateCurrentUserAccess(undefined);
				expect(result.isValid).toBe(false);
				expect(result.reason).toBe("Current user access not found");
			});

			it("should reject user without role", () => {
				const currentAccess = { _id: "123" };
				const result = validateCurrentUserAccess(currentAccess);
				expect(result.isValid).toBe(false);
				expect(result.reason).toBe("Current user has no assigned role");
			});
		});
	});
});
