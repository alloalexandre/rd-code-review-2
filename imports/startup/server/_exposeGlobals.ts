import { createMethod } from "meteor/jam:method";
import { Meteor } from "meteor/meteor";
import { Roles } from "meteor/roles";
import { httpStatus } from "/imports/globals/httpStatus";
import type { RoleId } from "/imports/globals/roles";
import {
	PRIVATE_GLOBALS,
	type PrivateGlobals,
} from "/imports/globals/server/globals";
import { setGlobals } from "/imports/utils/globals";
import { getAllChildrenRoles } from "/imports/utils/roleManagement";
import { getHighestRole } from "/imports/utils/server/roleManagementWithGlobals";

setGlobals(PRIVATE_GLOBALS);

/**
 * This meteor method exposes globals from the server.
 *
 * No before hook is needed as access is controlled within the method.
 *
 * @returns {PRIVATE_GLOBALS} The global variables of the application.
 */
createMethod({
	name: "Global.methods.getGlobals",
	open: false, // need to be logged in
	async run(): Promise<PrivateGlobals> {
		const userId = this.userId;

		if (!userId) {
			throw new Meteor.Error(
				httpStatus[401].code,
				"Unauthorized: You must be logged in to access globals",
			);
		}

		const userRoles = (await Roles.getRolesForUserAsync(userId)) as RoleId[];
		const userRole = getHighestRole(userRoles);

		if (!(userRole && PRIVATE_GLOBALS?.[userRole])) {
			throw new Meteor.Error(
				httpStatus[403].code,
				"Forbidden: Insufficient permissions to access globals",
			);
		}

		// Return the full PRIVATE_GLOBALS structure,
		// but only include data the user has access to
		const result = {} as PrivateGlobals;

		// Add user's role globals
		if (PRIVATE_GLOBALS[userRole]) {
			// biome-ignore lint/suspicious/noExplicitAny: We want to assign dynamically and override readonly
			(result as any)[userRole] = PRIVATE_GLOBALS[userRole];
		}

		// Add child roles globals
		const childrenRoles = getAllChildrenRoles(userRole);
		for (const childRole of childrenRoles) {
			if (childRole === "revoked") {
				continue;
			}
			if (PRIVATE_GLOBALS?.[childRole]) {
				// biome-ignore lint/suspicious/noExplicitAny: We want to assign dynamically and override readonly
				(result as any)[childRole] = PRIVATE_GLOBALS[childRole];
			}
		}

		return result;
	},
});
