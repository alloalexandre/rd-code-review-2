import { Accounts } from "meteor/accounts-base";
import { createMethod } from "meteor/jam:method";
import { Meteor } from "meteor/meteor";
import { isEmailVerified } from "../../utils/isEmailVerified";
import { isValidUser } from "../../utils/isValidUser";

/**
 * This method sends a reset password email if the user's email is verified.
 */
Meteor.users.methods.resetPasswordEmail = createMethod({
	name: "Meteor.users.methods.resetPasswordEmail",
	async run() {
		const userId = this.userId;

		if (!userId) {
			throw new Meteor.Error("not-authorized", "User not authorized.");
		}

		const user = await Meteor.users.findOneAsync(userId);

		if (!isValidUser(user)) {
			throw new Meteor.Error("not-found", "User not found.");
		}

		if (!isEmailVerified(user)) {
			throw new Meteor.Error(
				"email-not-verified",
				"User email is not verified.",
			);
		}

		Accounts.sendResetPasswordEmail(userId);
		return true;
	},
});
