import { Meteor } from "meteor/meteor";
import { Invoices } from "..";

Meteor.startup(() => {
	Invoices.rawCollection().createIndex({ amount: 1 });
	Invoices.rawCollection().createIndex({ createdAt: 1 });
});
