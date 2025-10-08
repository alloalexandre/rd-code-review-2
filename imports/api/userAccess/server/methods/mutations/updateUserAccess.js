import { createMethod } from "meteor/jam:method";
import { Meteor } from "meteor/meteor";
import z from "zod";
import { httpStatus } from "/imports/globals/httpStatus";
import { ALL_ROLES } from "/imports/globals/roles";
import { MeteorZodId, RoleZodId } from "/imports/lib/zod";
import { checkRoles } from "/imports/utils/permissions";
import { canAssignRole } from "/imports/utils/roleManagement";
import { updateUserRoleAsync } from "/imports/utils/users";
import { UserAccess } from "../../..";
import { prepareUpdateObject } from "../../utils/prepareUpdateObject";
import { sanitizeUserUpdateData } from "../../utils/sanitizeUserUpdateData";
import { validateCurrentUserAccess } from "../../utils/validateCurrentUserAccess";
import { validateRoleAssignment } from "../../utils/validateRoleAssignment";
import { validateUserAccessExists } from "../../utils/validateUserAccessExists";
import { validateUserUpdateData } from "../../utils/validateUserUpdateData";

UserAccess.methods.updateUserAccess = createMethod({
	name: "UserAccess.methods.updateUserAccess",
	schema: z.object({
		userId: MeteorZodId,
		role: RoleZodId,
		firstName: z.string().optional(),
		lastName: z.string().optional(),
	}),
	before: checkRoles([
		{
			roles: [ALL_ROLES.superAdmin.id, ALL_ROLES.admin.id],
			scope: null,
		},
	]),
	async run({ userId, role, ...updates }) {
		try {
			// Validate input data
			const inputValidation = validateUserUpdateData({
				userId,
				role,
				...updates,
			});
			if (!inputValidation.isValid) {
				throw new Meteor.Error(
					httpStatus[400].code,
					inputValidation.errors.join(", "),
				);
			}

			// Sanitize update data
			const sanitizedUpdates = sanitizeUserUpdateData({ role, ...updates });

			const currentUserId = this.userId;
			const currentAccess = await UserAccess.findOneAsync(
				{ userId: currentUserId },
				{ fields: { role: 1 } },
			);

			// Validate current user access
			const accessValidation = validateCurrentUserAccess(currentAccess);
			if (!accessValidation.isValid && accessValidation.reason) {
				throw new Meteor.Error(httpStatus[403].code, accessValidation.reason);
			}

			// Validate role assignment if role is being updated
			if (role) {
				const roleValidation = validateRoleAssignment(
					currentAccess?.role,
					role,
					canAssignRole,
				);
				if (!roleValidation.isValid && roleValidation.reason) {
					throw new Meteor.Error(httpStatus[403].code, roleValidation.reason);
				}
			}

			const userAccess = await UserAccess.findOneAsync({ userId });
			const userAccessValidation = validateUserAccessExists(userAccess);
			if (!userAccessValidation.isValid && userAccessValidation.reason) {
				throw new Meteor.Error(
					httpStatus[404].code,
					userAccessValidation.reason,
				);
			}

			// Prepare update objects
			const updateObject = prepareUpdateObject(sanitizedUpdates);

			await UserAccess.updateAsync({ userId }, updateObject);
			await Meteor.users.updateAsync({ _id: userId }, updateObject);
			await updateUserRoleAsync({ access: userAccess, userId });

			return true;
		} catch (e) {
			console.error("updateUserAccess failed:", e);
			if (e instanceof Meteor.Error) {
				throw e;
			}
			throw new Meteor.Error(httpStatus[500].code, JSON.stringify(e));
		}
	},
});
