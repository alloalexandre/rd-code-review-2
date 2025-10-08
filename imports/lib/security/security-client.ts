import { Roles } from "meteor/roles";
import { ALL_ROLES, type RoleId } from "/imports/globals/roles";

/**
 * Checks if a user has the super admin role.
 */
export function isSuperAdmin(userId: string): boolean {
	return Roles.userIsInRole(userId, ALL_ROLES.superAdmin.id);
}

/**
 * Checks if a user has the admin role.
 */
export function isAdmin(userId: string): boolean {
	return Roles.userIsInRole(userId, ALL_ROLES.admin.id);
}

/**
 * Checks if a user has at least one of the specified roles.
 */
export function hasOneOfRoles(
	roles: RoleId | RoleId[],
	userId: string,
): boolean {
	const finalRoles = Array.isArray(roles) ? roles : [roles];
	return finalRoles.some((role) => Roles.userIsInRole(userId, role));
}
