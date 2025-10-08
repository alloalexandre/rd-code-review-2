import { generateCollectionSchema } from "/imports/utils/api";
import { Example } from "..";

/**
 * Here you can define the schema for your collection.
 * You can add as many fields as you want.
 * You can also create sub-objects and arrays.
 * For more information, please refer to the SimpleSchema documentation:
 * @see https://github.com/aldeed/meteor-simple-schema
 */
export const exampleSchema = generateCollectionSchema({
	yourVariable: {
		type: String,
		label:
			"Le label doit détailler l'usage de la variable dans l'application et si possible où elle est utilisée (e.g. Le prénom de l'utilisateur utilisé dans la page de profil)",
		optional: true,
	},
	userId: {
		type: String,
		label: "L'ID de l'utilisateur propriétaire de cet élément",
		allowedValues: null, // We will set allowedValues in a later step
	},
});

Example.attachSchema(exampleSchema);
