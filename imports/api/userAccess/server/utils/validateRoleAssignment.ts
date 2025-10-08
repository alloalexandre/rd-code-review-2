import type { RoleId } from "/imports/globals/roles";

/**
 * Validates if a user can assign a specific role
 */
export function validateRoleAssignment(
	currentUserRole: RoleId,
	targetRole: RoleId,
	canAssignRoleFunction: (
		_currentUserRole: RoleId,
		_targetRole: RoleId,
	) => boolean,
): { isValid: boolean; reason: string | null } {
	if (!currentUserRole) {
		return {
			isValid: false,
			reason: "Current user role is required",
		};
	}

	if (!targetRole) {
		return {
			isValid: false,
			reason: "Target role is required",
		};
	}

	const canAssign = canAssignRoleFunction(currentUserRole, targetRole);

	return {
		isValid: canAssign,
		reason: canAssign ? null : "You cannot assign this role",
	};
}
