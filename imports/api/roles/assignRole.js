import { Meteor } from "meteor/meteor";
import { Roles } from "meteor/roles";

Meteor.methods({
	"roles.assignTo"(userId, roleId) {
		Roles.addUsersToRoles(userId, roleId);
		return true;
	},
});
