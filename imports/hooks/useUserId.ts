import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";

/**
 * Returns the current user ID.
 */
export function useUserId(): string | null {
	const { userId } = useTracker(() => ({
		userId: Meteor.userId(),
	}));
	return userId;
}
