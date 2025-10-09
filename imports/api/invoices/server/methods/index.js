import { createMethod } from "meteor/jam:method";
import { ALL_ROLES } from "/imports/globals/roles";
import { checkRoles } from "/imports/utils/permissions";
import { Invoices } from "../..";

export * from "./createInvoice";

createMethod({
	name: "Invoices.methods.validateInvoice",
	open: false,
	before: checkRoles([{ roles: [ALL_ROLES.user.id] }]),
	async run({ invoiceId }) {
		await Invoices.updateAsync(invoiceId, { $set: { status: "validated" } });
	},
});

createMethod({
	name: "Invoices.methods.updateAmount",
	open: false,
	before: checkRoles([{ roles: [ALL_ROLES.admin.id] }]),
	async run({ invoiceId, amount }) {
		return Invoices.update(invoiceId, { $set: { amount } });
	},
});
