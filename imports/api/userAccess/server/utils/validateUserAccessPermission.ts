import type { RoleId } from "/imports/globals/roles";

/**
 * Validates if a user can access user data for a specific role
 */
export async function validateUserAccessPermission({
	requestedRole,
	superAdminRoleId,
	hasRoleFunction,
}: {
	requestedRole: RoleId;
	superAdminRoleId: RoleId;
	hasRoleFunction: (roles: RoleId[]) => Promise<boolean>;
}): Promise<{ isValid: boolean; reason: string | null }> {
	// Super admin role requires super admin permission
	if (requestedRole === superAdminRoleId) {
		const hasSuperAdminRole = await hasRoleFunction([superAdminRoleId]);

		return {
			isValid: hasSuperAdminRole,
			reason: hasSuperAdminRole
				? null
				: "Super admin role required to view super admin users",
		};
	}

	// For other roles, basic admin permission is sufficient
	return {
		isValid: true,
		reason: null,
	};
}
