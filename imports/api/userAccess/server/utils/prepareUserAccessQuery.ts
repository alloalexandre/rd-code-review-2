import type { RoleId } from "/imports/globals/roles";

/**
 * Prepares query parameters for user access retrieval
 */
export function prepareUserAccessQuery(role: RoleId): { role: RoleId } {
	return { role };
}
