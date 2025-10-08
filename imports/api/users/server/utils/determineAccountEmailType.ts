import { isEmailVerified } from "./isEmailVerified";
import { isValidUser } from "./isValidUser";

/**
 * Determines what type of account email should be sent based on user state
 */
export function determineAccountEmailType(
	user: Partial<Meteor.User> | undefined,
): "enrollment" | "reset" | "none" {
	if (!(user && isValidUser(user))) {
		return "none";
	}

	return isEmailVerified(user) ? "reset" : "enrollment";
}
