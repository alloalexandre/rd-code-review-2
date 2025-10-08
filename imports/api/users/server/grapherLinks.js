import { Meteor } from "meteor/meteor";
import { addLinksFunction } from "/imports/startup/both/_mongoExtension";

/**
 * We need to bind because Meteor.roleAssignment is not an AHMongoCollection.
 * So here, one user can have one role.
 */
addLinksFunction.bind(Meteor.roleAssignment)({
	user: {
		type: "one",
		collection: Meteor.users,
		field: "user._id",
	},
});

/**
 * We need to bind because Meteor.users is not an AHMongoCollection.
 * So here, one user can have one role.
 */
addLinksFunction.bind(Meteor.users)({
	roles: {
		type: "one",
		collection: Meteor.roleAssignment,
		inversedBy: "user",
	},
});
