import type { RoleId } from "/imports/globals/roles";

/**
 * Sanitizes user creation data
 */
export function sanitizeUserCreationData({
	firstName,
	lastName,
	email,
	role,
}: {
	firstName: string;
	lastName: string;
	email: string;
	role: RoleId;
}): { firstName: string; lastName: string; email: string; role: RoleId } {
	return {
		firstName: firstName.trim(),
		lastName: lastName.trim(),
		email: email.trim().toLowerCase(),
		role,
	};
}
