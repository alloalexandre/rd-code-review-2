import SimpleSchema from "meteor/aldeed:simple-schema";
import { Meteor } from "meteor/meteor";
import { ALL_ROLES } from "/imports/globals/roles";

const userSchema = new SimpleSchema({
	services: {
		type: Object,
		blackbox: true,
		label: "Les services de connexion de l'utilisateur",
	},
	emails: {
		type: Array,
		label: "Les emails de l'utilisateur",
	},
	"emails.$": {
		type: Object,
		label: "Un email de l'utilisateur",
	},
	"emails.$.address": {
		type: String,
		label: "L'email de l'utilisateur",
	},
	"emails.$.verified": {
		type: Boolean,
		label: "Un champ pour indiquer si l'email de l'utilisateur est verifié",
	},
	createdAt: {
		type: Date,
		label: "La date de création de l'utilisateur",
	},
	heartbeat: {
		type: Date,
		optional: true,
		label:
			"La dernière activité de l'utilisateur (nécessaire pour zuuk:stale-session)",
	},
	numLoginAttempts: {
		type: Number,
		label: "Le nombre de tentatives de connexion de l'utilisateur",
		defaultValue: 0,
		optional: true,
	},
	lastAttempt: {
		type: Date,
		label: "La date de la derniere tentative de connexion de l'utilisateur",
		optional: true,
	},
	info: {
		type: Object,
		optional: true,
		label: "Les infos de l'utilisateur",
	},
	firstName: {
		type: String,
		optional: true,
		label: "Le prénom de l'utilisateur",
	},
	lastName: {
		type: String,
		optional: true,
		label: "Le nom de famille de l'utilisateur",
	},
	email: {
		type: String,
		regEx: SimpleSchema.RegEx.Email,
		optional: true,
		label: "L'email de l'utilisateur",
	},
	role: {
		type: String,
		allowedValues: Object.keys(ALL_ROLES),
		optional: true,
		label: "Le role de l'utilisateur",
	},
});

Meteor.users.attachSchema(userSchema);
