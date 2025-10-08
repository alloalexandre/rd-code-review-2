import { Meteor } from "meteor/meteor";
import { Migrations } from "meteor/quave:migrations";
import { MIGRATION_NUMBER } from "/imports/migrations";

/**
 * This is the entry point for migrations. It will be executed on app startup.
 */
Meteor.startup(async () => {
	if (Meteor.isDevelopment) {
		// Unlock migrations in development only. Never do it in production!
		await Migrations.unlock();
	}
	await Migrations.migrateTo(MIGRATION_NUMBER);
});
