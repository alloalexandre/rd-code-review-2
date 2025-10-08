import { ALL_ROLES, ROLES_SCOPE, type RoleId } from "/imports/globals/roles";
import type {
	AllRoles,
	RoleObject,
	RoleScopes,
	TransformedRolesScope,
} from "./roles";

/**
 * Get the direct children of a role (one level down in the hierarchy).
 *
 * 👉 Use this when you want to know which roles a given role can assign **immediately**.
 * It does NOT include deeper descendants.
 *
 * @example
 * // SuperAdmin can directly assign AdminInterlud
 * getDirectChildrenRoles("superAdmin");
 * // => ["adminInterlud"]
 *
 * // AdminOrganization can directly assign ManagerOrganization and UserOrganization
 * getDirectChildrenRoles("adminOrganization");
 * // => ["managerOrganization", "userOrganization"]
 */
export function getDirectChildrenRoles(
	roleId: RoleId,
	scopes: RoleScopes = ROLES_SCOPE,
): RoleId[] {
	return (scopes[roleId] as RoleId[]) || [];
}

/**
 * Get all descendant roles of a role (recursive, all levels down).
 *
 * 👉 Use this when you want to enforce permissions or check if a role is
 * allowed to assign **any role lower than them in the hierarchy**, not just immediate children.
 *
 * @example
 * // SuperAdmin can assign AdminInterlud directly,
 * // and indirectly User (via AdminInterlud),
 * // so both appear in the result
 * getAllChildrenRoles("superAdmin");
 * // => ["adminInterlud", "user"]
 *
 * // AdminPublicAdministration can assign Manager and Agent
 * // (Manager can assign Agent, so Agent is also included)
 * getAllChildrenRoles("adminPublicAdministration");
 * // => ["managerPublicAdministration", "agentPublicAdministration"]
 */
export function getAllChildrenRoles(roleId: RoleId | undefined): RoleId[] {
	const visited = new Set<RoleId>();
	const stack = [roleId];

	if (!(roleId && roleId in ALL_ROLES)) {
		return [];
	}

	if (roleId === ALL_ROLES.superAdmin.id) {
		visited.add(roleId);
	}

	while (stack.length > 0) {
		const current = stack.pop();

		if (!current) continue;

		const children = getDirectChildrenRoles(current);

		for (const child of children) {
			if (!visited.has(child)) {
				visited.add(child);
				stack.push(child);
			}
		}
	}

	return Array.from(visited);
}

/**
 * Transforms the ROLES_SCOPE object into a more easily readable format.
 * It will return an object where each key is a role and its value is either null (if the role has no children) or an object where each key is a child role and each value is true.
 *
 * @example
 * transformRolesScope();
 * // => {
 * //   superAdmin: { admin: true },
 * //   admin: null,
 * //   revoked: null
 * // }
 */
export function transformRolesScope(
	scopes: RoleScopes = ROLES_SCOPE,
): TransformedRolesScope {
	/** @type {Record<string, null|Record<string, boolean>>} */
	const result: TransformedRolesScope = {};

	for (const [role, children] of Object.entries(scopes)) {
		if (children.length === 0) {
			result[role] = null;
		} else {
			result[role] = children.reduce(
				(acc: Record<string, boolean>, child: string) => {
					acc[child] = true;
					return acc;
				},
				{},
			);
		}
	}

	return result;
}

/**
 * Map an array of role IDs to their full role objects (id + label).
 *
 * @example
 * getRolesByIds(["superAdmin", "admin"]);
 * // => [
 * //   { id: "superAdmin", label: "Super Admin" },
 * //   { id: "admin", label: "Admin" }
 * // ]
 *
 * @example
 * getRolesByIds(["revoked"]);
 * // => [
 * //   { id: "revoked", label: "Révoqué" }
 * // ]
 */
export function getRolesByIds(
	roleIds: RoleId[],
	roles: AllRoles = ALL_ROLES,
): RoleObject[] {
	return roleIds.map((id) => roles[id]).filter(Boolean);
}

/**
 * Checks if a user with the given current role can assign the given target role.
 *
 * If the current role is the same as the target role, it returns false (cannot assign itself the same role).
 * Otherwise, it checks if the target role is a descendant of the current role in the role hierarchy.
 *
 * @example
 * canAssignRole("superAdmin", "adminInterlud");
 * // => true
 *
 * canAssignRole("adminInterlud", "superAdmin");
 * // => false
 */
export function canAssignRole(
	currentRole: RoleId,
	targetRole: Exclude<RoleId, "revoked">,
): boolean {
	// Super Admin can assign any role
	if (currentRole === ALL_ROLES.superAdmin.id) return true;

	// Cannot assign the same role to itself
	if (currentRole === targetRole) return false;

	// Admin can assign Admin and its children, but not Super Admin
	if (currentRole === ALL_ROLES.admin.id) {
		const adminAssignableRoles = getAllChildrenRoles(ALL_ROLES.admin.id).concat(
			ALL_ROLES.admin.id,
		);
		return adminAssignableRoles.includes(targetRole);
	}

	// For other roles, check if targetRole is a child
	const assignableRoles = getAllChildrenRoles(currentRole);
	return assignableRoles.includes(targetRole);
}
