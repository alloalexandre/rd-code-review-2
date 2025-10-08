/**
 * Prepares user info object for database operations
 */
export function prepareUserInfo({
	firstName,
	lastName,
}: {
	firstName: string;
	lastName: string;
}): { firstName: string; lastName: string } {
	return {
		firstName,
		lastName,
	};
}
