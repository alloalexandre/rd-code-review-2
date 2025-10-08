import { describe, expect, it } from "vitest";
import type { RoleId } from "/imports/globals/roles";
import {
	canAssignRole,
	getAllChildrenRoles,
	getDirectChildrenRoles,
	getRolesByIds,
	transformRolesScope,
} from "../roleManagement";
import {
	getHighestRole,
	getRoleHierarchyDepth,
} from "../server/roleManagementWithGlobals";

describe("Role utilities (with mocked data)", () => {
	// Mock data
	const MOCK_ROLES_SCOPE = {
		superAdmin: ["admin"],
		admin: [],
		revoked: [],
	};

	const MOCK_ALL_ROLES = {
		superAdmin: { id: "superAdmin", label: "Super Admin" },
		admin: { id: "admin", label: "Admin" },
		revoked: { id: "revoked", label: "Revoked" },
	};

	describe("getDirectChildrenRoles", () => {
		it("returns direct children of a role", () => {
			expect(getDirectChildrenRoles("superAdmin", MOCK_ROLES_SCOPE)).toEqual([
				"admin",
			]);
			expect(getDirectChildrenRoles("admin", MOCK_ROLES_SCOPE)).toEqual([]);
			expect(
				getDirectChildrenRoles("user" as RoleId, MOCK_ROLES_SCOPE),
			).toEqual([]);
		});

		it("returns empty array for unknown role", () => {
			expect(
				getDirectChildrenRoles("unknownRole" as RoleId, MOCK_ROLES_SCOPE),
			).toEqual([]);
		});
	});

	describe("getAllChildrenRoles", () => {
		it("returns all descendant roles recursively", () => {
			expect(getAllChildrenRoles("superAdmin")).toEqual(
				expect.arrayContaining(["admin"]),
			);

			expect(getAllChildrenRoles("admin")).toEqual(expect.arrayContaining([]));

			expect(getAllChildrenRoles("revoked")).toEqual([]);
		});
	});

	describe("transformRolesScope", () => {
		it("transforms roles scope into object format", () => {
			const transformed = transformRolesScope(MOCK_ROLES_SCOPE);

			expect(transformed).toEqual({
				superAdmin: { admin: true },
				admin: null,
				revoked: null,
			});
		});
	});

	describe("getRolesByIds", () => {
		it("maps role IDs to objects with id and label", () => {
			const roles = getRolesByIds(["superAdmin", "admin"], MOCK_ALL_ROLES);
			expect(roles).toEqual([
				{ id: "superAdmin", label: "Super Admin" },
				{ id: "admin", label: "Admin" },
			]);
		});

		it("ignores invalid role IDs", () => {
			const roles = getRolesByIds(
				["superAdmin", "nonExistentRole"] as RoleId[],
				MOCK_ALL_ROLES,
			);
			expect(roles).toEqual([{ id: "superAdmin", label: "Super Admin" }]);
		});

		it("returns empty array if input is empty", () => {
			expect(getRolesByIds([], MOCK_ALL_ROLES)).toEqual([]);
		});
	});

	describe("canAssignRole", () => {
		it("allows superAdmin to assign any role", () => {
			expect(canAssignRole("superAdmin", "admin")).toBe(true);
			expect(canAssignRole("superAdmin", "superAdmin")).toBe(true);
		});

		it("does not allow a role to assign itself", () => {
			expect(canAssignRole("admin", "admin")).toBe(false);
		});

		it("allows a role to assign its children", () => {
			expect(canAssignRole("superAdmin", "admin")).toBe(true);
		});

		it("does not allow a role to assign roles outside its hierarchy", () => {
			expect(canAssignRole("admin", "superAdmin")).toBe(false);
			expect(canAssignRole("revoked", "admin")).toBe(false);
		});

		it("returns false if either role is unknown", () => {
			expect(canAssignRole("unknown" as RoleId, "admin")).toBe(false);
			expect(
				canAssignRole(
					"admin" as RoleId,
					"unknown" as Exclude<RoleId, "revoked">,
				),
			).toBe(false);
			expect(
				canAssignRole(
					"unknown" as RoleId,
					"unknown" as Exclude<RoleId, "revoked">,
				),
			).toBe(false);
		});
	});

	describe("getRoleHierarchyDepth", () => {
		it("returns the correct depth for a role", () => {
			expect(getRoleHierarchyDepth("superAdmin")).toBe(0);
			expect(getRoleHierarchyDepth("admin")).toBe(1);
			expect(getRoleHierarchyDepth("revoked")).toBe(2);
		});
	});

	describe("getHighestRole", () => {
		it("returns the highest priority role from a list", () => {
			expect(getHighestRole(["admin", "revoked"])).toBe("admin");
			expect(getHighestRole(["revoked", "admin"])).toBe("admin");
			expect(getHighestRole(["superAdmin", "admin", "revoked"])).toBe(
				"superAdmin",
			);
			expect(getHighestRole(["revoked"])).toBe(null); // revoked has no access
		});

		it("returns null if no valid roles are found", () => {
			expect(getHighestRole([])).toBe(null);
			expect(getHighestRole(["unknownRole" as RoleId])).toBe(null);
		});

		it("returns null if input is not an array", () => {
			const TEST_NUMBER = 123;

			// @ts-expect-error // testing invalid input
			expect(getHighestRole(null)).toBe(null);
			expect(getHighestRole(undefined)).toBe(null);
			// @ts-expect-error // testing invalid input
			expect(getHighestRole("admin")).toBe(null);
			// @ts-expect-error // testing invalid input
			expect(getHighestRole(TEST_NUMBER)).toBe(null);
		});
	});
});
