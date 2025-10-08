import { createMethod } from "meteor/jam:method";
import { Meteor } from "meteor/meteor";
import z from "zod";
import { createProfileUpdateObject } from "../../utils/createProfileUpdateObject";
import { isValidUser } from "../../utils/isValidUser";
import { sanitizeProfileData } from "../../utils/sanitizeProfileData";
import { validateProfileUpdate } from "../../utils/validateProfileUpdate";

/**
 * This method updates the first and last name of the logged-in user.
 */
Meteor.users.methods.updateInfoUser = createMethod({
	name: "Meteor.users.methods.updateInfoUser",
	schema: z.object({
		firstName: z.string(),
		lastName: z.string(),
	}),
	async run({ firstName, lastName }) {
		const userId = this.userId;

		if (!userId) {
			throw new Meteor.Error("unauthorized", "User must be logged in.");
		}

		// Validate profile data using service
		const validation = validateProfileUpdate({ firstName, lastName });
		if (!validation.isValid) {
			throw new Meteor.Error("validation-error", validation.errors.join(", "));
		}

		const user = await Meteor.users.findOneAsync(userId);

		if (!isValidUser(user)) {
			throw new Meteor.Error("not-found", "User not found.");
		}

		// Sanitize and prepare update data
		const sanitizedData = sanitizeProfileData({ firstName, lastName });
		const updateObject = createProfileUpdateObject(sanitizedData);

		const result = await Meteor.users.updateAsync(
			{ _id: userId },
			updateObject,
		);

		return result;
	},
});
