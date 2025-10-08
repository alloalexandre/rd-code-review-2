import type { RoleId } from "/imports/globals/roles";

/**
 * Determines if a user role is active (not revoked)
 */
export function isActiveRole(role: RoleId, revokedRoleIds: RoleId[]): boolean {
	return !revokedRoleIds.includes(role);
}
