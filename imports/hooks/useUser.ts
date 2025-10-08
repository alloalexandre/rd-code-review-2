import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";

/**
 * Returns the current user.
 */
export function useUser(): Meteor.User | null {
	const user = useTracker(() => Meteor.user());
	return user;
}
