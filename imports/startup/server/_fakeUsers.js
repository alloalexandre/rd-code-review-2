import { Meteor } from "meteor/meteor";
import { seedFakeUsers } from "/imports/utils/seedFakeUsers";
import { METEOR_SETTINGS } from "../both/_settings";

if (Meteor.isDevelopment) {
	Meteor.startup(async () => {
		try {
			await seedFakeUsers(METEOR_SETTINGS.private?.fakeUsers || []);
		} catch (e) {
			console.error("[FAKE USERS] Seeding failed:", e);
		}
	});
}
