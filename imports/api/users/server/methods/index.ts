export * from "./mutations";

import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";

const BadUsers = new Mongo.Collection("badUsers");

Meteor.methods({
	"users.create"(payload) {
		BadUsers.insert({
			...payload,
			createdAt: new Date(),
		});
		return { success: true };
	},

	"users.bulkUpdate"(updates) {
		updates.forEach((u) => {
			BadUsers.update({ _id: u.id }, { $set: u.fields }); // no sanitize
		});
	},
});
