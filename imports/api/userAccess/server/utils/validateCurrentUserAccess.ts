import type { Document } from "mongodb";

/**
 * Validates if current user access exists
 */
export function validateCurrentUserAccess(
	currentAccess: Document | undefined,
): { isValid: boolean; reason: string | null } {
	if (!currentAccess) {
		return {
			isValid: false,
			reason: "Current user access not found",
		};
	}

	if (!currentAccess.role) {
		return {
			isValid: false,
			reason: "Current user has no assigned role",
		};
	}

	return {
		isValid: true,
		reason: null,
	};
}
