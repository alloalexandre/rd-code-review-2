import { AHMongoCollection } from "/imports/lib/allohoustonCollection";

/**
 * EmailSent collection allows to keep track of emails sent in the app.
 */
export const EmailSent = new AHMongoCollection("_EmailSent");
