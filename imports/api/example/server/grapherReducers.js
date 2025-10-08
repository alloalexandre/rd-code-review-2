import { Example } from "..";

/**
 * A reducer allows you to compute derived fields on your documents in a virtual way (i.e., without storing them in the database).
 *
 * It takes the current document as input and returns the computed value.
 * Make sure to define any dependencies that your reducer relies on.
 *
 * @see https://www.bluelibs.com/docs/package-nova/#reducers
 */
Example.addReducers({
	yourReducer: {
		dependency: {
			yourVariable: 1,
		},
		async reduce(doc) {
			const _yourVariable = doc.yourVariable;
			return; // Compute and return the derived value based on yourVariable
		},
	},
});
