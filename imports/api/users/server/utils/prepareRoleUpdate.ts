import type { Document } from "mongodb";
import type { RoleId } from "/imports/globals/roles";

/**
 * Prepares role data for user role update
 */
export function prepareRoleUpdate(access: Document | undefined): RoleId[] {
	if (!access?.role) {
		return [];
	}
	return [access.role];
}
