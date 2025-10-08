import type { RoleId } from "/imports/globals/roles";

/**
 * Validates user creation data
 */
export function validateUserCreationData({
	firstName,
	lastName,
	email,
	role,
}: {
	firstName: string;
	lastName: string;
	email: string;
	role: RoleId;
}): { isValid: boolean; errors: string[] } {
	const errors = [];

	if (!firstName || typeof firstName !== "string" || firstName.trim() === "") {
		errors.push("First name is required and must be a non-empty string");
	}

	if (!lastName || typeof lastName !== "string" || lastName.trim() === "") {
		errors.push("Last name is required and must be a non-empty string");
	}

	if (!email || typeof email !== "string" || email.trim() === "") {
		errors.push("Email is required and must be a non-empty string");
	}

	if (!role || typeof role !== "string" || role.trim() === "") {
		errors.push("Role is required and must be a non-empty string");
	}

	return {
		isValid: errors.length === 0,
		errors,
	};
}
