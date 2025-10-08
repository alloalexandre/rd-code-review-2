import SimpleSchema from "meteor/aldeed:simple-schema";
import { ALL_ROLES } from "/imports/globals/roles";
import { generateCollectionSchema } from "/imports/utils/api";
import { UserAccess } from "..";

export const userAccessSchema = generateCollectionSchema({
	userId: {
		type: String,
		regEx: SimpleSchema.RegEx.Id,
		label: "L'identifiant de l'utilisateur",
		optional: true,
	},
	firstName: {
		type: String,
		label: "Le prénom de l'utilisateur",
		optional: true,
	},
	lastName: {
		type: String,
		label: "Le nom de famille de l'utilisateur",
		optional: true,
	},
	email: {
		type: String,
		label: "L'email de l'utilisateur",
		optional: true,
	},
	role: {
		type: String,
		label: "Le rôle de l'utilisateur",
		optional: true,
		allowedValues: Object.keys(ALL_ROLES),
	},
});

UserAccess.attachSchema(userAccessSchema);
