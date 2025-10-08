import type { Document } from "mongodb";

/**
 * Checks if user access record exists
 */
export function validateUserAccessExists(userAccess: Document | undefined): {
	isValid: boolean;
	reason: string | null;
} {
	return {
		isValid: !!userAccess,
		reason: userAccess ? null : "User access record not found",
	};
}
