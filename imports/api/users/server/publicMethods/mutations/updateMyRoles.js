import { createMethod } from "meteor/jam:method";
import { Meteor } from "meteor/meteor";
import { REVOKED_ROLES_IDS } from "/imports/globals/roles";
import { updateUserRoleAsync } from "/imports/utils/users";
import { UserAccess } from "../../../../userAccess";
import { isActiveRole } from "../../utils/isActiveRole";
import { validateUserAccess } from "../../utils/validateUserAccess";

/**
 * This method updates the user's role and synchronizes it with the UserAccess collection.
 */
Meteor.users.methods.updateMyRoles = createMethod({
	name: "Meteor.users.methods.updateMyRoles",
	async run() {
		const userId = this.userId;

		if (!userId) {
			throw new Meteor.Error("Not authorized");
		}

		const [user, access] = await Promise.all([
			Meteor.users.findOneAsync(userId),
			UserAccess.findOneAsync({ userId }),
		]);

		// Validate user access
		const accessValidation = validateUserAccess(user, access);
		if (!accessValidation.isValid) {
			return false;
		}

		await updateUserRoleAsync({ access, userId });

		const activeRoleStatus = isActiveRole(access?.role, REVOKED_ROLES_IDS);
		return activeRoleStatus;
	},
});
