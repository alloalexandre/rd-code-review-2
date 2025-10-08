import { createMethod } from "meteor/jam:method";
import { Example } from "../../..";

/**
 * This method is a placeholder for updating an example.
 * It ensures that only users with appropriate roles can access the data.
 * By default only logged in users can access methods with jam:method.
 *
 * In addition, we use the `checkRoles` utility to restrict access to super admins and admins only.
 *
 * As you can see, we are using the named export `getExample` from the queries file.
 *
 * @see https://www.bluelibs.com/docs/package/jam-method/
 */
Example.methods.updateExample = createMethod({
	name: "Example.methods.updateExample",
	schema: null, // Define your schema here using zod
	before: null, // Define any pre-checks or role checks here
	async run(_args) {
		// Your mutation logic here
		return true;
	},
});
