import type { RoleId } from "/imports/globals/roles";

/**
 * Sanitizes user update data
 */
export function sanitizeUserUpdateData({
	role,
	firstName,
	lastName,
}: {
	role?: RoleId;
	firstName?: string;
	lastName?: string;
}): { role?: RoleId; firstName?: string; lastName?: string } {
	const sanitized: { role?: RoleId; firstName?: string; lastName?: string } =
		{};

	if (role !== undefined) {
		sanitized.role = role;
	}

	if (firstName !== undefined) {
		sanitized.firstName = firstName.trim();
	}

	if (lastName !== undefined) {
		sanitized.lastName = lastName.trim();
	}

	return sanitized;
}
