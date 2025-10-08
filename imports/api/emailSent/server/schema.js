import { generateCollectionSchema } from "/imports/utils/api";
import { EmailSent } from ".";

export const emailSentSchema = generateCollectionSchema({
	from: {
		type: String,
		label: "La personne qui envoie l'email",
	},
	to: {
		type: Array,
		label: "Les personnes qui reçoivent l'email",
	},
	"to.$": {
		type: String,
		label: "Un destinataire de l'email",
	},
	subject: {
		type: String,
		label: "Le sujet de l'email",
	},
	body: {
		type: String,
		label: "Le corps de l'email en HTML",
	},
});

EmailSent.attachSchema(emailSentSchema);
