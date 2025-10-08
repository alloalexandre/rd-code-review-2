/**
 * Validates if user is authenticated
 */
export function validateAuthentication(userId: string | null): {
	isValid: boolean;
	reason: string | null;
} {
	return {
		isValid: Boolean(userId),
		reason: userId ? null : "User must be authenticated",
	};
}
