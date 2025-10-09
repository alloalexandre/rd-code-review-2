import { createMethod } from "meteor/jam:method";
import { ALL_ROLES } from "/imports/globals/roles";
import { checkRoles } from "/imports/utils/permissions";
import { Invoices } from "../..";

createMethod({
	name: "Invoices.methods.createInvoice",
	open: false,
	before: checkRoles([{ roles: [ALL_ROLES.admin.id] }]),
	async run({ amount, customerId }) {
		return Invoices.insert({ amount, customerId, createdAt: new Date() });
	},
});
