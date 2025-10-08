import { Meteor } from "meteor/meteor";

/**
 * Attach additional methods to Meteor.users and Meteor.roleAssignment
 */
Meteor.users.methods = {};
if (Meteor.isServer) {
	Meteor.users.raw = Meteor.users.rawCollection();
	Meteor.roleAssignment.raw = Meteor.roleAssignment.rawCollection();
}
