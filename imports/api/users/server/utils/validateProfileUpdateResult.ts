/**
 * Validates if profile update was successful
 */
export function validateProfileUpdateResult(
	updateResult: { modifiedCount?: number } | null,
): boolean {
	if (!updateResult?.modifiedCount) {
		return false;
	}
	return updateResult.modifiedCount > 0;
}
