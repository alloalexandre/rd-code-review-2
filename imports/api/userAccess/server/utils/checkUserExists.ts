/**
 * Checks if a user with the given email already exists
 */
export function checkUserExists(
	existingUser: Meteor.User | undefined,
): boolean {
	return !!existingUser;
}
