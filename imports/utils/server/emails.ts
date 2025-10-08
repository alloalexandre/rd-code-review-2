import dedent from "dedent";
import Handlebars from "handlebars";
import SimpleSchema from "meteor/aldeed:simple-schema";
import { Email } from "meteor/email";
import { validatedFunction } from "meteor/suprakit:ui";
import moment from "moment";
import type { AnyFunction } from "/types/core";
import { EmailSent } from "../../api/emailSent/server";
import { METEOR_SETTINGS } from "../../startup/both/_settings";
import { sendSlackAlert } from "../slack";

/**
 * Generates HTML content for an email using a Handlebars template.
 * Replaces newlines in the input text with <br> tags.
 *
 * @param {string} text - The plain text content of the email.
 * @returns {Promise<string>} - The HTML content ready to be sent.
 */
export async function getHtmlTemplate(text: string): Promise<string> {
	// biome-ignore lint/correctness/noUndeclaredVariables: Assets can't be loaded as an ES6 module for now (see https://docs.meteor.com/api/assets.html)
	const templateText = await Assets.getTextAsync(
		"mailTemplate/emailStandard.html",
	);
	const compileTemplate = Handlebars.compile(templateText);
	const formattedText = text.replace(/\n/g, "<br>");
	return compileTemplate({ text: formattedText });
}

type EmailData = {
	from: string;
	to: string[];
	subject: string;
	html: string;
	// biome-ignore lint/suspicious/noExplicitAny: Allow any type for attachments as per Email package documentation
	attachments?: any[];
};

/**
 * Logs an email to the EmailSent collection.
 */
async function logEmailSent({
	from,
	to,
	subject,
	html,
	attachments = [],
}: EmailData): Promise<void> {
	const emailData = { from, to, subject, html, attachments };
	await EmailSent.insertAsync({
		createdAt: moment.utc().toDate(),
		...emailData,
	});
}

/**
 * Sends an email using Meteor's Email package and logs it to EmailSent collection.
 */
async function executeSendEmail({
	from,
	to,
	subject,
	html,
	attachments = [],
}: EmailData): Promise<void> {
	const emailData = {
		from,
		to,
		subject,
		html,
		attachments,
	};
	await logEmailSent(emailData);
	return Email.sendAsync(emailData);
}

/**
 * Redirects emails sent to a list of non-production email addresses if the application is not in production mode.
 */
function redirectEmailsInNonProduction(to: string[]): string[] {
	if (
		!METEOR_SETTINGS.public.production &&
		!!METEOR_SETTINGS.private?.mails.sendEmailsTo
	) {
		console.log(
			`Redirecting email from ${to.join(", ")} to ${METEOR_SETTINGS.private.mails.sendEmailsTo}`,
		);
		return [METEOR_SETTINGS.private.mails.sendEmailsTo];
	}

	return to;
}

/**
 * Sends an email after validation and environment checks.
 */
export const sendEmail: AnyFunction = validatedFunction({
	validate: new SimpleSchema({
		body: { type: String },
		to: { type: Array },
		"to.$": { type: String },
		subject: { type: String },
		attachments: { type: Array, optional: true },
		"attachments.$": { type: Object, blackbox: true },
	}),

	/**
	 * Sends an email with proper error handling and environment checks.
	 */
	async run({
		body,
		subject,
		to,
		attachments = [],
	}: {
		body: string;
		subject: string;
		to: string[];
		// biome-ignore lint/suspicious/noExplicitAny: Allow any type for attachments as per Email package documentation
		attachments?: any[];
	}): Promise<boolean> {
		try {
			if (!METEOR_SETTINGS.private?.mails.enabled) {
				console.warn(
					"sendEmail is not enabled in METEOR_SETTINGS.private; email not sent.",
				);
				return false;
			}

			const recipients = to;
			const sender = METEOR_SETTINGS.private.mails.sendEmailsFrom;

			to = redirectEmailsInNonProduction(to);
			const htmlContent = await getHtmlTemplate(dedent(body));
			await executeSendEmail({
				from: sender,
				to: recipients,
				subject,
				html: htmlContent,
				attachments,
			});

			return true;
		} catch (error) {
			console.error("Failed to send email:", error);
			if (error instanceof Error) {
				await sendSlackAlert(
					`Erreur durant l'envoi d'un email : ${error.message}`,
				);
			} else {
				await sendSlackAlert(
					`Erreur durant l'envoi d'un email : ${JSON.stringify(error)}`,
				);
			}
			return false;
		}
	},
});
