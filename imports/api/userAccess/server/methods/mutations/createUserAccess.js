import { Accounts } from "meteor/accounts-base";
import { createMethod } from "meteor/jam:method";
import { Meteor } from "meteor/meteor";
import { Roles } from "meteor/roles";
import z from "zod";
import { EMAIL_DUPLICATED_ERROR_CODE } from "/imports/globals/emails";
import { httpStatus } from "/imports/globals/httpStatus";
import { ALL_ROLES } from "/imports/globals/roles";
import { RoleZodId } from "/imports/lib/zod";
import { checkRoles } from "/imports/utils/permissions";
import { canAssignRole } from "/imports/utils/roleManagement";
import { UserAccess } from "../../..";
import { checkUserExists } from "../../utils/checkUserExists";
import { prepareRoleAssignment } from "../../utils/prepareRoleAssignment";
import { prepareUserInfo } from "../../utils/prepareUserInfo";
import { sanitizeUserCreationData } from "../../utils/sanitizeUserCreationData";
import { validateCurrentUserAccess } from "../../utils/validateCurrentUserAccess";
import { validateRoleAssignment } from "../../utils/validateRoleAssignment";
import { validateUserCreationData } from "../../utils/validateUserCreationData";

UserAccess.methods.createUserAccess = createMethod({
	name: "UserAccess.methods.createUserAccess",
	schema: z.object({
		firstName: z.string(),
		lastName: z.string(),
		email: z.email(),
		role: RoleZodId,
	}),
	before: checkRoles([
		{
			roles: [ALL_ROLES.superAdmin.id, ALL_ROLES.admin.id],
			scope: null,
		},
	]),
	async run({ role, email, ...info }) {
		// Validate input data
		const inputValidation = validateUserCreationData({ role, email, ...info });
		if (!inputValidation.isValid) {
			throw new Meteor.Error(
				httpStatus[400].code,
				inputValidation.errors.join(", "),
			);
		}

		// Sanitize input data
		const sanitizedData = sanitizeUserCreationData({ role, email, ...info });
		const userInfo = prepareUserInfo(sanitizedData);

		// permissions check
		const userId = this.userId;
		const currentAccess = await UserAccess.findOneAsync(
			{ userId },
			{ fields: { role: 1 } },
		);

		// Validate current user access
		const accessValidation = validateCurrentUserAccess(currentAccess);
		if (!accessValidation.isValid && accessValidation.reason) {
			throw new Meteor.Error(httpStatus[403].code, accessValidation.reason);
		}

		// Validate role assignment permission
		const roleValidation = validateRoleAssignment(
			currentAccess?.role,
			sanitizedData.role,
			canAssignRole,
		);
		if (!roleValidation.isValid && roleValidation.reason) {
			throw new Meteor.Error(httpStatus[403].code, roleValidation.reason);
		}

		const existingUser = await Meteor.users.findOneAsync({
			email: sanitizedData.email,
		});
		if (checkUserExists(existingUser)) {
			throw new Meteor.Error(
				EMAIL_DUPLICATED_ERROR_CODE,
				"UserManagementPage.addUserDuplicateEmailError",
			);
		}

		const userAccessId = await UserAccess.insertAsync({
			role: sanitizedData.role,
			email: sanitizedData.email,
			...userInfo,
		});
		const userIdCreated = await Accounts.createUserAsync({
			email: sanitizedData.email,
		});
		await UserAccess.updateAsync(
			{ _id: userAccessId },
			{ $set: { userId: userIdCreated } },
		);

		const roles = prepareRoleAssignment(sanitizedData.role);
		await Roles.setUserRolesAsync(userIdCreated, roles);
		await Meteor.users.updateAsync(
			{ _id: userIdCreated },
			{
				$set: {
					...userInfo,
					email: sanitizedData.email,
					role: sanitizedData.role,
				},
			},
		);
		Accounts.sendEnrollmentEmail(userIdCreated);

		return userAccessId;
	},
});
