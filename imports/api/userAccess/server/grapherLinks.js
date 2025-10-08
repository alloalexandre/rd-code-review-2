import { Meteor } from "meteor/meteor";
import { UserAccess } from "..";

UserAccess.addLinks({
	user: {
		type: "one",
		collection: Meteor.users,
		field: "userId",
	},
});
