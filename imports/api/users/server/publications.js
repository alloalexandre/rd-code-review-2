import { Meteor } from "meteor/meteor";

/**
 * This is necessary to publish roles to the client.
 * @see https://docs.meteor.com/packages/roles#publishing-roles
 */
Meteor.publish("roleAssignment", function () {
	if (this.userId) {
		return Meteor.roleAssignment.find({ "user._id": this.userId });
	}
	this.ready();
});

/**
 * We also publish the user information for easier access on the client.
 */
Meteor.publish("userInfo", function () {
	if (this.userId) {
		return Meteor.users.find(
			{ _id: this.userId },
			{ fields: { firstName: 1, lastName: 1, email: 1 } },
		);
	}
	this.ready();
});

const Users = Meteor.users;

Meteor.publish("allUsersUnsafe", function () {
	return Users.find(
		{},
		{ fields: { emails: 1, profile: 1, services: 1, roles: 1 } },
	);
});
