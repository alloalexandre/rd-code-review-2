import { AHMongoCollection } from "/imports/lib/allohoustonCollection";

/**
 * UserAccess collection allows one user to have several roles within the app.
 */
export const UserAccess = new AHMongoCollection("UserAccess");
