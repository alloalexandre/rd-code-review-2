/**
 * Sanitizes and prepares user profile data for update
 */
export function sanitizeProfileData({
	firstName,
	lastName,
}: {
	firstName: string;
	lastName: string;
}): { firstName: string; lastName: string } {
	return {
		firstName: firstName.trim(),
		lastName: lastName.trim(),
	};
}
