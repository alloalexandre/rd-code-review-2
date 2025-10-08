/** biome-ignore-all lint/suspicious/noExplicitAny: This is necessary to ensure flexibility */
import { Meteor } from "meteor/meteor";
import { Logger } from "meteor/ostrio:logger";
import { LoggerFile } from "meteor/ostrio:loggerfile";
import _ from "underscore";
import { METEOR_SETTINGS } from "./_settings";

// Initialize Logger
const appLog: Logger = new Logger();

const PAD_DIGITS = 3;

// Initialize LoggerFile
const logFile: LoggerFile = new LoggerFile(appLog, {
	fileNameFormat: (time: Date) => {
		// Log per month: {prefix}-YYYY-MM.log
		const month = String(time.getMonth() + 1).padStart(2, "0");
		return `${METEOR_SETTINGS.public.logPrefix}-${time.getFullYear()}-${month}.log`;
	},
	format: (
		time: Date,
		_level: unknown,
		message: string,
		data: unknown,
		userId: string | Mongo.ObjectID,
	) => {
		const sqlTime = `${time.getUTCFullYear()}-${String(time.getUTCMonth() + 1).padStart(2, "0")}-${String(time.getUTCDate()).padStart(2, "0")} ${String(time.getUTCHours()).padStart(2, "0")}:${String(time.getUTCMinutes()).padStart(2, "0")}:${String(time.getUTCSeconds()).padStart(2, "0")},${String(time.getUTCMilliseconds()).padStart(PAD_DIGITS, "0")}`;
		const user = Meteor.users.findOne(userId);

		let email = "NULL";
		if (user?.emails?.[0]?.address) {
			email = user.emails[0].address;
		} else if (user?.services?.openid?.email) {
			email = user.services.openid.email;
		}

		return `UTCTIME ${sqlTime} ${email} ${message} ${data}\r\n`;
	},
	path: METEOR_SETTINGS.public.absoluteLogPath, // Use absolute storage path
});

// Enable LoggerFile
logFile.enable({
	enable: true,
	client: false, // this allows to call only, but it cannot execute on the client
	server: true, // execute calls from client on server (RPC)
});

/**
 * Compute the difference between two objects.
 *
 * This function takes three arguments:
 *  - `data`: The current object.
 *  - `previous`: The previous object.
 *  - `excludedFields`: An array of field names to exclude from the comparison.
 *
 * Returns an object with the same keys as `data`, but with each value being an object containing two properties:
 *  - `original`: The value of the key in the `previous` object, or an empty string if the key was not present.
 *  - `modified`: The value of the key in the `data` object.
 *
 * If the key is not present in either object, or if the value is the same in both objects, the key will not be present in the returned object.
 */
const computeDifference = (
	data: Record<string, any>,
	previous: Record<string, any>,
	excludedFields: string[] = [],
): Record<string, { original: any; modified: any }> => {
	const result: Record<string, { original: any; modified: any }> = {};

	const processKey = (key: string): void => {
		const currentValue = data[key];
		const previousValue = previous?.[key];

		if (excludedFields.includes(key)) {
			return;
		}

		if (
			Array.isArray(currentValue) &&
			_.difference(currentValue, previousValue || []).length
		) {
			result[key] = { original: previousValue, modified: currentValue };
		} else if (
			currentValue &&
			typeof currentValue === "object" &&
			previousValue
		) {
			const subResult = computeDifference(
				currentValue,
				previousValue,
				excludedFields,
			);
			if (Object.keys(subResult).length) {
				result[key] = { original: previousValue, modified: subResult };
			}
		} else if (currentValue !== previousValue) {
			result[key] = { original: previousValue, modified: currentValue };
		}
	};

	for (const key of Object.keys(data)) {
		processKey(key);
	}

	return result;
};

/**
 * Log a database modification event
 */
export const logDatabaseModification = (
	title: string,
	data: Record<string, any> | null,
	userId: string,
	previous: Record<string, any> | null = null,
	fieldNames: Array<string> | null = null,
): void => {
	if (!Meteor.isServer) return; // only log on server

	if (previous === null) {
		// CREATE
		appLog.info(title, JSON.stringify(data), userId);
	} else if (data === null) {
		// DELETE
		appLog.info(title, JSON.stringify(previous), userId);
	} else {
		// UPDATE
		const modifierSet = fieldNames ? _.pick(data, fieldNames) : data;
		const changes = computeDifference(modifierSet, previous, ["updatedAt"]);

		if (Object.keys(changes).length) {
			changes._id = previous._id;
			appLog.info(title, JSON.stringify(changes), userId);
		}
	}
};
