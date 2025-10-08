/**
 * Prepares update objects for database operations
 */
export function prepareUpdateObject(sanitizedData: {
	[key: string]: unknown;
}): { $set: { [key: string]: unknown } } {
	return {
		$set: sanitizedData,
	};
}
