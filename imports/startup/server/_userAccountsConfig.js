import Handlebars from "handlebars";
import { Accounts } from "meteor/accounts-base";
import { Meteor } from "meteor/meteor";
import moment from "moment";
import { httpStatus } from "/imports/globals/httpStatus";
import { PASSWORD_POLICY } from "/imports/lib/passwordStrength";
import { METEOR_SETTINGS } from "../both/_settings";

/**
 * Updates user's login attempts and timestamp in the database.
 * @param {string} userId - Meteor user ID
 * @param {number} attempts - Number of failed login attempts
 * @returns {Promise<void>}
 */
async function updateLoginAttempts(userId, attempts) {
	await Meteor.users.updateAsync(userId, {
		$set: {
			numLoginAttempts: attempts,
			lastAttempt: moment.utc().toDate(),
		},
	});
}

/**
 * Determines if the user's previous failed attempts are expired.
 * If expired, resets the counter.
 * @param {Object} user - Meteor user object
 * @returns {Promise<number>} - Returns updated failed attempts count
 */
async function resetExpiredAttempts(user) {
	const lastAttempt = user.lastAttempt ? moment.utc(user.lastAttempt) : null;
	const now = moment.utc();

	if (
		!lastAttempt ||
		Math.abs(lastAttempt.diff(now, "minutes")) >
			PASSWORD_POLICY.MINUTES_FOR_ACCOUNT_LOCK_ON_ERROR
	) {
		await updateLoginAttempts(user._id, 0);
		return 0;
	}

	return typeof user.numLoginAttempts === "number" ? user.numLoginAttempts : 0;
}

/**
 * Handles login attempt validation and account locking.
 * See: https://v2-docs.meteor.com/api/accounts-multi.html
 *
 * @param {Object} info - Information about the login attempt
 * @param {Object} info.user - Meteor user object
 * @param {Object} info.error - Error object if login failed
 * @returns {Promise<boolean>} - Returns whether login is allowed
 * @throws {Meteor.Error} Throws if account is locked
 */
async function validateLoginAttempt(info) {
	const user = info.user;
	const error = info.error;

	if (!user) return false;

	let failedAttempts = await resetExpiredAttempts(user);

	// Lock account if too many failed attempts
	if (failedAttempts >= PASSWORD_POLICY.NUMBER_OF_FAILED_ATTEMPTS_BEFORE_LOCK) {
		throw new Meteor.Error(httpStatus[403].code, "accountLocked");
	}

	// Update failed attempts based on login success/failure
	if (error && error.error === httpStatus[403].code) {
		failedAttempts += 1;
	} else {
		failedAttempts = 0;
	}

	await updateLoginAttempts(user._id, failedAttempts);

	return !error || error.error !== httpStatus[403].code;
}

// Register login validation
Accounts.validateLoginAttempt(validateLoginAttempt);

/**
 * Customizes account-related URLs
 */
Accounts.urls.enrollAccount = (token) =>
	Meteor.absoluteUrl(`login/signup/${token}`);
Accounts.urls.resetPassword = (token) =>
	Meteor.absoluteUrl(`login/reset-password/${token}`);

// Determine environment for email sender
const { production } = METEOR_SETTINGS.public;
const emailSender = production
	? "[Application]"
	: "[Application Pré-production]";

/**
 * Generates email templates for Meteor accounts
 * @see https://v2-docs.meteor.com/api/accounts-multi.html
 */
Accounts.emailTemplates = {
	from: "no-reply@allohouston.fr",
	siteName: "Application",
	resetPassword: {
		subject: () => `${emailSender} Mot de passe oublié`,
		html: async (_user, url) => {
			// biome-ignore lint/correctness/noUndeclaredVariables: Assets can't be loaded as an ES6 module for now (see https://docs.meteor.com/api/assets.html)
			const templateSource = await Assets.getTextAsync(
				"mailTemplate/passwordReset.html",
			);
			const template = Handlebars.compile(templateSource);
			return template({ url });
		},
	},
	enrollAccount: {
		subject: () => `${emailSender} Bienvenue !`,
		html: async (_user, url) => {
			// biome-ignore lint/correctness/noUndeclaredVariables: Assets can't be loaded as an ES6 module for now (see https://docs.meteor.com/api/assets.html)
			const templateSource = await Assets.getTextAsync(
				"mailTemplate/enroll.html",
			);
			const template = Handlebars.compile(templateSource);
			return template({ url });
		},
	},
};
