import { Accounts } from "meteor/accounts-base";
import { Meteor } from "meteor/meteor";
import { Migrations } from "meteor/quave:migrations";
import { Roles } from "meteor/roles";
import { UserAccess } from "/imports/api/userAccess/index";
import { ALL_ROLES } from "../globals/roles";
import { METEOR_SETTINGS } from "../startup/both/_settings";

/**
 *  This file is used to define database migrations. A migration is a set of instructions
 *  to update the database schema.
 *
 * The MIGRATION_NUMBER should be incremented each time a new migration is added.
 */

export const MIGRATION_NUMBER = 1;

Migrations.add({
	version: 1,
	name: "Create initial super admin user",

	/**
	 * Apply the migration: create a super admin user
	 */
	up: async () => {
		const superAdminPassword = METEOR_SETTINGS.private?.superAdminPassword;

		// Create the super admin user
		const superadminId = await Accounts.createUserAsync({
			username: "ALLOHOUSTON",
			email: "contact@allohouston.fr",
			password: superAdminPassword,
			profile: {
				firstName: "ALLO",
				lastName: "HOUSTON",
			},
		});

		// Mark email as verified
		await Meteor.users.updateAsync(
			{ _id: superadminId },
			{ $set: { "emails.0.verified": true } },
		);

		// Insert user access info
		await UserAccess.insertAsync({
			userId: superadminId,
			role: ALL_ROLES.superAdmin.id,
			firstName: "ALLO",
			lastName: "HOUSTON",
			email: "contact@allohouston.fr",
		});

		// Assign superAdmin role
		await Roles.addUsersToRolesAsync(superadminId, ["superAdmin"]);
	},

	/**
	 * Rollback the migration: remove all users and user access
	 */
	down: async () => {
		await Meteor.users.removeAsync({});
		await UserAccess.removeAsync({});
	},
});
