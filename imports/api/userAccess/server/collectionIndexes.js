import { Meteor } from "meteor/meteor";
import { UserAccess } from "..";

Meteor.startup(async () => {
	await UserAccess.createIndexAsync({ email: 1 }, { unique: true });
});
