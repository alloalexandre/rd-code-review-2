/**
 * Validates impersonation request parameters
 */
export function validateImpersonationRequest({
	toUserId,
	fromUserId,
}: {
	toUserId: string;
	fromUserId: string;
}): { isValid: boolean; errors: string[] } {
	const errors = [];

	if (!toUserId || typeof toUserId !== "string") {
		errors.push("Target user ID is required");
	}

	if (!fromUserId || typeof fromUserId !== "string") {
		errors.push("Source user ID is required");
	}

	if (toUserId === fromUserId) {
		errors.push("Cannot impersonate yourself");
	}

	return {
		isValid: errors.length === 0,
		errors,
	};
}
