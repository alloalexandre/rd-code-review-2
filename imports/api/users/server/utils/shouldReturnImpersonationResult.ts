import type { RoleId } from "/imports/globals/roles";

/**
 * Determines if an impersonation result should be returned based on role status
 */
export function shouldReturnImpersonationResult(
	role: RoleId,
	revokedRoleIds: RoleId[],
): boolean {
	return !revokedRoleIds.includes(role);
}
