import type { RoleId } from "/imports/globals/roles";

/**
 * Validates role query parameters
 */
export function validateRoleQuery(
	role: RoleId,
	validRoles: RoleId[],
): { isValid: boolean; errors: string[] } {
	const errors = [];

	if (!role) {
		errors.push("Role is required");
	}

	if (role && !validRoles.includes(role)) {
		errors.push("Invalid role specified");
	}

	return {
		isValid: errors.length === 0,
		errors,
	};
}
