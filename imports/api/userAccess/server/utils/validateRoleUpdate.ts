import type { RoleId } from "/imports/globals/roles";
import { validateRoleAssignment } from "./validateRoleAssignment";

/**
 * Validates role update permissions
 */
export function validateRoleUpdate({
	currentUserRole,
	newRole,
	canAssignRoleFunction,
}: {
	currentUserRole: RoleId;
	newRole?: RoleId;
	canAssignRoleFunction: (role: RoleId) => boolean;
}): { isValid: boolean; reason: string | null } {
	// If no role change, validation passes
	if (!newRole) {
		return {
			isValid: true,
			reason: null,
		};
	}

	return validateRoleAssignment(
		currentUserRole,
		newRole,
		canAssignRoleFunction,
	);
}
