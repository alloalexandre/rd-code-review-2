import { Mongo } from "meteor/mongo";
import { createMethod } from "meteor/jam:method";
import { Invoices } from "..";

createMethod({
	name: "Invoices.methods.create",
	open: true,
	async run({ amount, customerId }) {
		return Invoices.insert({ amount, customerId, createdAt: new Date() });
	},
});
