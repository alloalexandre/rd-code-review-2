/**
 * Validates if a user object exists and has required properties
 */
export function isValidUser(user: Partial<Meteor.User> | undefined): boolean {
	return Boolean(user?._id);
}
