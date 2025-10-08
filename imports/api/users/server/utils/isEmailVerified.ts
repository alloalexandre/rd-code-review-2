/**
 * Checks if a user's email is verified
 */
export function isEmailVerified(
	user: Partial<Meteor.User> | undefined,
): boolean {
	return !!user?.emails?.[0]?.verified;
}
