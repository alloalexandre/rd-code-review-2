import { createMethod } from "meteor/jam:method";
import { Meteor } from "meteor/meteor";
import { Roles } from "meteor/roles";
import { Impersonate } from "meteor/suprakit:ui";
import z from "zod";
import { UserAccess } from "/imports/api/userAccess";
import { httpStatus } from "/imports/globals/httpStatus";
import { REVOKED_ROLES_IDS } from "/imports/globals/roles";
import { isSuperAdmin } from "/imports/lib/security/server/security-server";
import { MeteorZodId } from "/imports/lib/zod";
import { prepareRoleUpdate } from "../../utils/prepareRoleUpdate";
import { shouldReturnImpersonationResult } from "../../utils/shouldReturnImpersonationResult";
import { validateImpersonationPermission } from "../../utils/validateImpersonationPermission";
import { validateImpersonationRequest } from "../../utils/validateImpersonationRequest";
import { validateUserAccess } from "../../utils/validateUserAccess";

/**
 * Impersonation method
 * - Allows super admins to impersonate other users
 * - Handles leaving impersonation via token
 */
Meteor.users.methods.impersonate = createMethod({
	name: "Meteor.users.methods.impersonate",
	schema: z.object({
		toUser: MeteorZodId,
		fromUser: MeteorZodId.optional(),
		token: z.string().optional(),
	}),
	async run({ toUser, fromUser, token }) {
		const currentUserId = this.userId;

		if (!currentUserId) {
			throw new Meteor.Error(httpStatus[401].code, "Unauthorized");
		}

		// Validate request parameters
		const requestValidation = validateImpersonationRequest({
			toUserId: toUser,
			fromUserId: currentUserId,
		});
		if (!requestValidation.isValid) {
			throw new Meteor.Error(
				httpStatus[400].code,
				requestValidation.errors.join(", "),
			);
		}

		const isSuperAdminUser = await isSuperAdmin(currentUserId);
		const isSuperAdminTarget = await isSuperAdmin(toUser);

		// Validate permissions
		const permissionValidation = validateImpersonationPermission({
			isSuperAdminUser,
			isSuperAdminTarget,
			token,
		});
		if (!permissionValidation.isAllowed && permissionValidation.reason) {
			throw new Meteor.Error(httpStatus[403].code, permissionValidation.reason);
		}

		// Proceed with impersonation
		const result = await Impersonate.set({
			userId: currentUserId,
			toUser,
			fromUser,
			token,
		});
		this.setUserId(result.toUser);

		const user = await Meteor.users.findOneAsync(result.toUser);
		const access = await UserAccess.findOneAsync({ userId: result.toUser });

		// Validate user access
		const accessValidation = validateUserAccess(user, access);
		if (!accessValidation.isValid) {
			return false;
		}

		// Replace roles
		const roles = prepareRoleUpdate(access);
		await Roles.setUserRolesAsync(result.toUser, roles);

		// Only return result if role is not revoked
		return shouldReturnImpersonationResult(access?.role, REVOKED_ROLES_IDS)
			? result
			: false;
	},
});
