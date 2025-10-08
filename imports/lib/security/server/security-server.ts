import { Roles } from "meteor/roles";
import { ALL_ROLES, type RoleId } from "/imports/globals/roles";

/**
 * Checks if the user has the super admin role.
 *
 * @category Meteor Roles utils
 */
export async function isSuperAdmin(userId: string): Promise<boolean> {
	return await Roles.userIsInRoleAsync(userId, ALL_ROLES.superAdmin.id);
}

/**
 * Checks if the user has the admin role.
 *
 * @category Meteor Roles utils
 */
export async function isAdmin(userId: string): Promise<boolean> {
	return await Roles.userIsInRoleAsync(userId, ALL_ROLES.admin.id);
}

/**
 * Checks if a user has at least one of the specified roles, regardless of the scope.
 *
 * @category Meteor Roles utils
 */
export async function hasOneOfRolesAsync(
	roles: RoleId | RoleId[],
	userId: string,
): Promise<boolean> {
	return await Roles.userIsInRoleAsync(userId, roles);
}
