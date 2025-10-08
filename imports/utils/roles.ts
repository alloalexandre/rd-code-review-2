import type { RoleId } from "../globals/roles";

/**
 * Type representing a role with optional name, description, and permissions
 */
export interface Role<T = string> {
	id: T;
	name?: string;
	description?: string;
	permissions?: string[];
}

/**
 * Object representing a role with an optional scope
 */
export type RoleObject<T = string> = { id: T; scope?: string | null };

/**
 * Object mapping role IDs to arrays of their direct child role IDs
 */
export type RoleScopes = Record<string, string[]>;

/**
 * Object mapping role IDs to their full role objects
 */
export type AllRoles = Record<string, RoleObject>;

/**
 * Type representing the roles scope configuration
 */
export type TransformedRolesScope = Record<
	string,
	null | Record<string, boolean>
>;

/**
 * Utility function to extract ids from role objects.
 */
export function getRoleIds(
	roles: Role<RoleId> | Role<RoleId>[] | null | undefined,
): RoleId[] {
	if (!roles) return [];
	if (Array.isArray(roles)) {
		return roles.map((r) => r.id);
	}
	return [roles.id];
}
