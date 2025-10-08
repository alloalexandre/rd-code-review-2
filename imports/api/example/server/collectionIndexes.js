import { Meteor } from "meteor/meteor";
import { Example } from "/packages/suprakit-ui/src/ui/Breadcrumb/Breadcrumb.stories";

/**
 * This allows us to create indexes on the collection.
 *
 * An index is a data structure that improves the speed of data retrieval operations on a database table at the cost of additional writes and storage space.
 * Indexes are used to quickly locate data without having to search every row in a database table every time a database table is accessed.
 *
 * For example, if you frequently query the `Example` collection by the `userId` field, creating an index on that field can significantly speed up those queries.
 *
 * Here, we create an index on the `userId` field to ensure that each user can only have one associated document in the `Example` collection.
 * This is enforced by the `unique: true` option, which prevents duplicate entries for the same `userId`.
 *
 * For more information on MongoDB indexes, please refer to the official:
 * @see https://docs.mongodb.com/manual/indexes/
 */
Meteor.startup(async () => {
	await Example.createIndexAsync({ userId: 1 }, { unique: true });
});
