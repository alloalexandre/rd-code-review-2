import { ROLES_SCOPE, type RoleId } from "/imports/globals/roles";
import { PRIVATE_GLOBALS } from "/imports/globals/server/globals";
import type { RoleScopes } from "../roles";

/**
 * Get the depth of a role in the hierarchy.
 * Top-level roles (no parents) have a depth of 0.
 * Each level down increases the depth by 1.
 *
 * @example
 * getRoleHierarchyDepth("superAdmin");
 * // => 0 (top-level role)
 */
export function getRoleHierarchyDepth(
	roleId: string,
	rolesScope: RoleScopes = ROLES_SCOPE,
): number {
	const parents = Object.entries(rolesScope).filter(([_parentRole, children]) =>
		children.includes(roleId),
	);

	if (parents.length === 0) {
		// No parents means this is a top-level role
		return 0;
	}

	// Find the minimum depth among all parents
	const parentDepths = parents.map(([parentRole]) =>
		getRoleHierarchyDepth(parentRole, rolesScope),
	);

	return Math.min(...parentDepths) + 1;
}

/**
 * Get the highest role from an array of user roles.
 */
export function getHighestRole(
	userRoles?: RoleId[],
): Exclude<RoleId, "revoked"> | null {
	if (!Array.isArray(userRoles) || userRoles.length === 0) {
		return null;
	}

	const validRoles: Exclude<RoleId, "revoked">[] = userRoles.filter(
		(role): role is Exclude<RoleId, "revoked"> =>
			role !== "revoked" && role in PRIVATE_GLOBALS,
	);

	if (validRoles.length === 0) {
		return null;
	}

	return validRoles.reduce((highest, currentRole) => {
		const currentDepth = getRoleHierarchyDepth(currentRole);
		const highestDepth = getRoleHierarchyDepth(highest);

		return currentDepth < highestDepth ? currentRole : highest;
	});
}
