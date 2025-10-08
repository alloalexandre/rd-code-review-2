import { Accounts } from "meteor/accounts-base";
import { createMethod } from "meteor/jam:method";
import { Meteor } from "meteor/meteor";
import z from "zod";
import { httpStatus } from "/imports/globals/httpStatus";
import { ALL_ROLES } from "/imports/globals/roles";
import { MeteorZodId } from "/imports/lib/zod";
import { checkRoles } from "/imports/utils/permissions";
import { determineAccountEmailType } from "../../utils/determineAccountEmailType";
import { isValidUser } from "../../utils/isValidUser";

/**
 * Resend account email method
 * - Sends enrollment email if not verified
 * - Sends password reset if already verified
 */
Meteor.users.methods.resendAccountEmail = createMethod({
	name: "Meteor.users.methods.resendAccountEmail",
	schema: z.object({
		userId: MeteorZodId,
	}),
	before: checkRoles([
		{ roles: [ALL_ROLES.superAdmin.id, ALL_ROLES.admin.id], scope: null },
	]),
	async run({ userId }) {
		const user = await Meteor.users.findOneAsync(userId);
		if (!isValidUser(user)) {
			throw new Meteor.Error(httpStatus[404].code, "User not found");
		}

		const emailType = determineAccountEmailType(user);
		if (emailType === "reset") {
			Accounts.sendResetPasswordEmail(userId);
		} else if (emailType === "enrollment") {
			Accounts.sendEnrollmentEmail(userId);
		}

		return true;
	},
});
