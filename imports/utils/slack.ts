import { Meteor } from "meteor/meteor";
import { METEOR_SETTINGS } from "../startup/both/_settings";

/**
 * Sends a message to a Slack channel using a webhook.
 *
 * The message is sent only when executed on the server.
 * The Slack webhook URL is retrieved from `METEOR_SETTINGS.private.slackWebHookUrl`.
 * The message is prefixed with the application name (`METEOR_SETTINGS.public.appName`) and a suffix depending on the environment:
 * - Development: `DEV`
 * - Pre-production: `PREPROD`
 * - Production: no suffix
 */
export async function sendSlackAlert(text: string): Promise<void> {
	try {
		if (!Meteor.isServer) return;

		const SLACK_WEBHOOK_URL = METEOR_SETTINGS.private?.slackWebHookUrl;
		let appName = METEOR_SETTINGS.public.appName;

		if (Meteor.isDevelopment) {
			appName += " DEV";
		} else if (!METEOR_SETTINGS.public.production) {
			appName += " PREPROD";
		}

		const payload = {
			blocks: [
				{
					type: "section",
					text: {
						type: "mrkdwn",
						text: `:warning: ${appName} :warning: - ${text}`,
					},
				},
			],
		};

		if (!SLACK_WEBHOOK_URL) {
			console.warn("SLACK_WEBHOOK_URL is not defined.");
			return;
		}

		await fetch(SLACK_WEBHOOK_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
		});
	} catch (error) {
		console.error("Error sending Slack alert:", error);
	}
}
