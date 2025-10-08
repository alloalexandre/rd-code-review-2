import "meteor/aldeed:collection2/dynamic";

import SimpleSchema from "meteor/aldeed:simple-schema";
import { METEOR_SETTINGS } from "./_settings";

/**
 * Enables debug mode for SimpleSchema when debug mode is enabled using settings.
 */
if (METEOR_SETTINGS.public.debug === true) {
	SimpleSchema.debug = true;
}

/**
 * Collection2 extends Mongo.Collection to automatically validate documents against schemas.
 * Calling Collection2.load() ensures that dynamic schema features are enabled.
 * @see https://github.com/Meteor-Community-Packages/meteor-collection2
 */

// biome-ignore lint/correctness/noUndeclaredVariables: This is done as is in the documentation
Collection2.load();
