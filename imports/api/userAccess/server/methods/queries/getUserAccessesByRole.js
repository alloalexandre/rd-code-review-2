import { createMethod } from "meteor/jam:method";
import { Meteor } from "meteor/meteor";
import z from "zod";
import { httpStatus } from "/imports/globals/httpStatus";
import { ALL_ROLES } from "/imports/globals/roles";
import { hasOneOfRolesAsync } from "/imports/lib/security/server/security-server";
import { RoleZodId } from "/imports/lib/zod";
import { checkRoles } from "/imports/utils/permissions";
import { UserAccess } from "../../..";
import { prepareUserAccessQuery } from "../../utils/prepareUserAccessQuery";
import { validateRoleQuery } from "../../utils/validateRoleQuery";
import { validateUserAccessPermission } from "../../utils/validateUserAccessPermission";

UserAccess.methods.getUserAccessesByRole = createMethod({
	name: "UserAccess.methods.getUserAccessesByRole",
	schema: z.object({
		role: RoleZodId,
	}),
	before: checkRoles([
		{
			roles: [ALL_ROLES.superAdmin.id, ALL_ROLES.admin.id],
			scope: null,
		},
	]),
	async run({ role }) {
		try {
			// Validate role query
			const roleValidation = validateRoleQuery(
				role,
				Object.values(ALL_ROLES).map((r) => r.id),
			);
			if (!roleValidation.isValid) {
				throw new Meteor.Error(
					httpStatus[400].code,
					roleValidation.errors.join(", "),
				);
			}

			const userId = this.userId;

			if (!userId) {
				throw new Meteor.Error(httpStatus[401].code, "Non authentifié");
			}

			// Validate access permissions for the requested role
			const accessValidation = await validateUserAccessPermission({
				requestedRole: role,
				superAdminRoleId: ALL_ROLES.superAdmin.id,
				hasRoleFunction: async (roles) =>
					await hasOneOfRolesAsync(roles, userId),
			});

			if (!accessValidation.isValid) {
				console.error(
					"getUserAccess - Unauthorized access attempt by:",
					userId,
				);
				throw new Meteor.Error(httpStatus[403].code, "Non autorisé");
			}

			// Prepare query and execute
			const queryParams = prepareUserAccessQuery(role);
			const results = await UserAccess.grapherQueries
				.getUserAccessesByRole(queryParams)
				.toArray();

			return results;
		} catch (e) {
			console.error("getUserAccess failed:", e);
			if (e instanceof Meteor.Error) {
				throw e;
			}
			throw new Meteor.Error(httpStatus[500].code, JSON.stringify(e));
		}
	},
});
