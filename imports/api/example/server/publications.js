import { Meteor } from "meteor/meteor";

/**
 * We can publish things to the client using Meteor.publish.
 * @see https://docs.meteor.com/packages/roles#publishing-roles
 */
Meteor.publish("examplePublication", function () {
	// You can add custom logic here to filter what is published.
	// For example, you might want to check the user's roles or permissions.
	// if (Roles.userIsInRole(this.userId, ['admin'])) {
	//   return Example.find({});
	// } else {
	//   return Example.find({ public: true });
	// }
	this.ready();
});
