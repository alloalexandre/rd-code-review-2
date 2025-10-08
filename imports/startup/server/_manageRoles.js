import { Meteor } from "meteor/meteor";
import { Roles } from "meteor/roles";
import { transformRolesScope } from "/imports/utils/roleManagement";

/**
 * This file is used to define roles and their hierarchy.
 * See `/imports/globals/roles` for role definitions
 */

Meteor.startup(async () => {
	await createRoles(transformRolesScope());
});

/**
 * Recursively creates roles from a nested object.
 * If a parent is provided, each role will be added to the parent.
 * If a role already exists, an error will be ignored and the role will not be recreated.
 *
 * @param {Object} roles - A nested object of roles.
 * @param {string|null} parent - The parent role to add each role to.
 */
async function createRoles(roles, parent = null) {
	const tasks = Object.entries(roles).map(async ([roleName, children]) => {
		try {
			await Roles.createRoleAsync(roleName);
		} catch {
			console.warn(`Role "${roleName}" already exists`);
		}

		if (parent) {
			try {
				await Roles.addRolesToParentAsync(roleName, parent);
			} catch (err) {
				console.warn(
					`Failed to add role "${roleName}" to parent "${parent}":`,
					err,
				);
			}
		}

		// Recursively create child roles in parallel
		if (children) {
			await createRoles(children, roleName);
		}
	});

	await Promise.all(tasks);
}
