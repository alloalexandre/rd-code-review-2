import { getRoleIds, type Role } from "../utils/roles";

/**
 * We define all the roles here.
 *
 * Each role has:
 * - id: a unique identifier used for programmatic checks and role assignment
 * - label: a human-readable name to display in UI
 *
 * Revoked roles are roles which are revoked and thus signals that the user had a role but do not have it anymore.
 *
 * @example
 * // Example usage in UI
 * ALL_ROLES.superAdmin.label
 * // => "Super Admin"
 *
 * ALL_ROLES.admin.id
 * // => "admin"
 *
 * @example
 * // Filtering active roles (excluding revoked)
 * const activeRoles = Object.values(ALL_ROLES).filter(r => !r.id.includes("revoked"));
 * console.log(activeRoles.map(r => r.label));
 * // => ["Super Admin", "Admin"]
 */
export const ALL_ROLES = {
	superAdmin: {
		id: "superAdmin",
		label: "Super Admin",
	},
	admin: {
		id: "admin",
		label: "Admin",
	},
	revoked: {
		id: "revoked",
		label: "Révoqué",
	},
} as const;

/**
 * Defines the role hierarchy (who can assign whom).
 *
 * - Keys are **parent roles** (the ones who have permission to assign roles).
 * - Values are objects listing **child roles** that the parent can assign.
 * - If the value is `null`, it means the role cannot assign any other roles.
 *
 * This structure is required by the Meteor package `alanning:roles`
 * to properly handle role scopes and assignments.
 *
 * 👉 Think of this as the "permission tree" for role delegation.
 *
 * @see https://github.com/alanning/meteor-roles#roles-scopes
 *
 * @example
 * ROLES_SCOPE[ALL_ROLES.superAdmin.id];
 * // => { admin: true }
 * // Meaning: a Super Admin can assign the Admin role
 *
 * ROLES_SCOPE[ALL_ROLES.admin.id];
 * // => null
 * // Meaning: an Admin cannot assign any roles
 *
 * @example
 * // Checking if superAdmin can assign admin:
 * if (ROLES_SCOPE.superAdmin?.admin) {
 *   console.log("SuperAdmin can assign Admin ✅");
 * }
 */
export const ROLES_SCOPE: Record<RoleId, RoleId[] | []> = {
	[ALL_ROLES.superAdmin.id]: [ALL_ROLES.admin.id],
	[ALL_ROLES.admin.id]: [ALL_ROLES.revoked.id],
	[ALL_ROLES.revoked.id]: [],
} satisfies Record<RoleId, RoleId[] | []>;

/**
 * List here all the active roles.
 */
export const ACTIVE_ROLES_OPTIONS: Role<RoleId>[] = [
	ALL_ROLES.superAdmin,
	ALL_ROLES.admin,
];
export const ACTIVE_ROLES_IDS: RoleId[] = getRoleIds(ACTIVE_ROLES_OPTIONS);

/**
 * List here all the revoked roles. It will be used to get ids of all revoked roles in an easy way.
 */
export const REVOKED_ROLES: Role<RoleId>[] = [ALL_ROLES.revoked];
export const REVOKED_ROLES_IDS: RoleId[] = getRoleIds(REVOKED_ROLES);

export type RoleId = (typeof ALL_ROLES)[keyof typeof ALL_ROLES]["id"];
