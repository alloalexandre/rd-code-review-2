import { createMethod } from "meteor/jam:method";
import { Meteor } from "meteor/meteor";
import z from "zod";
import { httpStatus } from "/imports/globals/httpStatus";
import { ALL_ROLES } from "/imports/globals/roles";
import { checkRoles } from "/imports/utils/permissions";
import { Example } from "../../..";
import { getExample } from "../../queries/getExample";

/**
 * This method retrieves examples based on the user's role.
 * It ensures that only users with appropriate roles can access the data.
 * By default only logged in users can access methods with jam:method.
 *
 * In addition, we use the `checkRoles` utility to restrict access to super admins and admins only.
 *
 * As you can see, we are using the named export `getExample` from the queries file.
 *
 * @see https://www.bluelibs.com/docs/package/jam-method/
 */
Example.methods.getExample = createMethod({
	name: "Example.methods.getExample",
	schema: z.object({
		role: z.string().refine((role) => Object.keys(ALL_ROLES).includes(role)),
	}),
	before: checkRoles([
		{
			roles: [ALL_ROLES.superAdmin.id, ALL_ROLES.admin.id],
			scope: null,
		},
	]),
	async run({ role }) {
		try {
			const queryParams = { role };
			const results = await getExample(queryParams).toArray();

			return results;
		} catch (e) {
			console.error("getExample failed:", e);
			throw new Meteor.Error(httpStatus[500].code, e.message);
		}
	},
});
