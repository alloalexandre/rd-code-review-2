import type { RoleId } from "/imports/globals/roles";

/**
 * Checks if a role is valid within the system
 */
export function isValidRole(role: RoleId, validRoles: RoleId[]): boolean {
	return validRoles.includes(role);
}
