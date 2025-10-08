import { Meteor } from "meteor/meteor";
import { Example } from "..";

/**
 * You can add as many links as you want to your collection.
 * Here we link the `userId` field from the Example collection to the Meteor.users collection.
 *
 * The 'userId' field in the Example collection is a foreign key that references the '_id' field in the Meteor.users collection.
 *
 * We use BlueLibs Nova under the hood to manage these links.
 * For more information, please refer to the BlueLibs Nova documentation:
 * @see https://bluelibs.com/docs/package-nova/#linking-collections
 */
Example.addLinks({
	user: {
		type: "one",
		collection: Meteor.users,
		field: "userId",
	},
});
