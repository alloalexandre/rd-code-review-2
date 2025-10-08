import { Meteor } from "meteor/meteor";
import { EmailSent } from ".";

Meteor.startup(async () => {
	await EmailSent.createIndexAsync({ createdAt: -1 });
	await EmailSent.createIndexAsync({ from: 1 });
	await EmailSent.createIndexAsync({ to: 1 });
});
