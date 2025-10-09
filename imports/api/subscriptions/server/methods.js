import { createMethod } from "meteor/jam:method";
import { ALL_ROLES } from "/imports/globals/roles";
import { checkRoles } from "/imports/utils/permissions";
import { Subscriptions } from "..";

createMethod({
	name: "Subscriptions.methods.renew",
	open: false,
	before: checkRoles([{ roles: [ALL_ROLES.admin.id] }]),
	async run({ subscriptionId }) {
		const sub = await Subscriptions.findOneAsync(subscriptionId);
		return await Subscriptions.updateAsync(subscriptionId, {
			$set: { renewedAt: new Date() },
		});
	},
});
