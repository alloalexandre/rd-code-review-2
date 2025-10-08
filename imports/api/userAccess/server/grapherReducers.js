import { UserAccess } from "..";

UserAccess.addReducers({
	status: {
		dependency: {
			userId: 1,
			user: {
				emails: 1,
			},
		},
		async reduce(doc) {
			const email = doc.user?.emails?.[0];
			return email?.verified ? "verified" : "pending";
		},
	},
});
