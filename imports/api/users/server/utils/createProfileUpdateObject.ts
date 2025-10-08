/**
 * Creates the update object for user profile
 */
export function createProfileUpdateObject(profileData: {
	firstName: string;
	lastName: string;
}): { $set: { firstName: string; lastName: string } } {
	return {
		$set: {
			firstName: profileData.firstName,
			lastName: profileData.lastName,
		},
	};
}
