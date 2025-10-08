import type { RoleId } from "/imports/globals/roles";

/**
 * Validates user update data
 */
export function validateUserUpdateData({
	userId,
	role,
	firstName,
	lastName,
}: {
	userId: string;
	role?: RoleId;
	firstName?: string;
	lastName?: string;
}): { isValid: boolean; errors: string[] } {
	const errors = [];

	if (!userId || typeof userId !== "string" || userId.trim() === "") {
		errors.push("User ID is required");
	}

	if (
		firstName !== undefined &&
		(typeof firstName !== "string" || firstName.trim() === "")
	) {
		errors.push("First name must be a non-empty string if provided");
	}

	if (
		lastName !== undefined &&
		(typeof lastName !== "string" || lastName.trim() === "")
	) {
		errors.push("Last name must be a non-empty string if provided");
	}

	if (role !== undefined && (typeof role !== "string" || role.trim() === "")) {
		errors.push("Role must be a non-empty string if provided");
	}

	return {
		isValid: errors.length === 0,
		errors,
	};
}
