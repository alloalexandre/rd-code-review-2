/**
 * Validates user profile update data
 */
export function validateProfileUpdate(profileData: {
	firstName: string;
	lastName: string;
}): { isValid: boolean; errors: string[] } {
	const errors = [];

	if (
		!profileData.firstName ||
		typeof profileData.firstName !== "string" ||
		profileData.firstName.trim() === ""
	) {
		errors.push("First name is required and must be a non-empty string");
	}

	if (
		!profileData.lastName ||
		typeof profileData.lastName !== "string" ||
		profileData.lastName.trim() === ""
	) {
		errors.push("Last name is required and must be a non-empty string");
	}

	return {
		isValid: errors.length === 0,
		errors,
	};
}
