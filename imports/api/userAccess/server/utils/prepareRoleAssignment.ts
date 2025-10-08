import type { RoleId } from "/imports/globals/roles";

/**
 * Prepares role data for user assignment
 */
export function prepareRoleAssignment(role: RoleId): RoleId[] {
	return [role];
}
