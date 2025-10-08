import type { Document } from "mongodb";

/**
 * Validates if a user has the required access and role
 */
export function validateUserAccess(
	user: Meteor.User | undefined,
	access: Document | undefined,
): { isValid: boolean; reason: string | null } {
	if (!user) {
		return {
			isValid: false,
			reason: "User not found",
		};
	}

	if (!access?.role) {
		return {
			isValid: false,
			reason: "User access or role not found",
		};
	}

	return {
		isValid: true,
		reason: null,
	};
}
