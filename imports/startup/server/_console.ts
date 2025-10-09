import consoleStamp from "console-stamp";
import { Meteor } from "meteor/meteor";

/**
 * This is used to add timestamps to the console logs.
 */
if (Meteor.isProduction) {
	consoleStamp(console, { format: "yyyy-mm-dd HH:MM:ss.l" });
}

console.log("DEV DEBUG: All users list", Meteor.users.find().fetch());
