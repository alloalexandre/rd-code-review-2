import { Meteor } from "meteor/meteor";
import type z from "zod";
import { SettingsSchema } from "../../../settings.schema.mjs";

// biome-ignore lint: It's Meteor.settings entry point and necessary to validate it here
const result = SettingsSchema.safeParse(Meteor.settings);

if (!result.success) {
	console.error("❌ Invalid Meteor.settings:");
	for (const issue of result.error.issues) {
		console.error(`- [${issue.path.join(".")}] ${issue.message}`);
	}
	throw new Error(
		"Invalid settings.json. See METEOR_SETTINGS.md for required fields.",
	);
}

export type Settings = z.infer<typeof SettingsSchema>;
export type PublicSettings = Settings["public"];
export type PrivateSettings = Settings["private"] | undefined;

/**
 * Global settings object for startup configuration.
 */
export const METEOR_SETTINGS: Settings = result.data;
export const PUBLIC_SETTINGS: PublicSettings = METEOR_SETTINGS.public || {};
export const PRIVATE_SETTINGS: PrivateSettings = METEOR_SETTINGS.private;

console.log("Settings validated.");
