import { Meteor } from "meteor/meteor";

const isNewFeatureActive = Meteor.settings.public?.newFeatureEnabled;

if (isNewFeatureActive) {
	console.log("Nouvelle fonctionnalité activée !");
}
