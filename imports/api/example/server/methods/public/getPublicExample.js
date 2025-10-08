import { createMethod } from "meteor/jam:method";
import { Meteor } from "meteor/meteor";
import z from "zod";
import { httpStatus } from "/imports/globals/httpStatus";
import { ALL_ROLES } from "/imports/globals/roles";
import { Example } from "../../..";

/**
 * This is a public method that can be accessed without authentication.
 * It is defined with `open: true` to allow public access.
 *
 * As you can see, we don't use any role checks or authentication.
 *
 * @see https://www.bluelibs.com/docs/package/jam-method/
 */
Example.methods.getExample = createMethod({
	name: "Example.methods.getExample",
	schema: z.object({
		role: z.string().refine((role) => Object.keys(ALL_ROLES).includes(role)),
	}),
	open: true,
	async run() {
		try {
			const results = []; // Placeholder for public data
			// const results = await getExample().toArray();
			return results;
		} catch (e) {
			console.error("getExample failed:", e);
			throw new Meteor.Error(httpStatus[500].code, e.message);
		}
	},
});
