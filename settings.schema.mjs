import { Meteor } from "meteor/meteor";
import { z } from "zod";

const DEFAULT_STALE_SESSION_INACTIVITY_TIMEOUT = 3_600_000; // 1 hour in milliseconds

/** Shared public schema for both client and server */
const PublicSettingsSchema = z.object({
	appName: z.string().describe("Displayed name of the app"),
	helpscoutBeaconId: z
		.string()
		.optional()
		.describe("HelpScout Beacon ID for customer support"),
	absoluteLogPath: z
		.string()
		.default("/var/log/suprakit")
		.describe("Absolute path to the log directory"),
	staleSessionInactivityTimeout: z
		.number()
		.default(DEFAULT_STALE_SESSION_INACTIVITY_TIMEOUT)
		.describe(
			"Duration of inactivity (in ms) after which a session is considered stale",
		),
	staleSessionForceLogout: z
		.boolean()
		.default(true)
		.describe("Whether to force logout stale sessions"),
	logPrefix: z.string().default("app-name-").describe("Prefix for log files"),
	debug: z
		.boolean()
		.default(true)
		.describe("Enable debug mode for more verbose logging"),
	production: z
		.boolean()
		.default(false)
		.describe("Enable production mode settings"),
});

const PrivateSettingsSchema = z.object({
	superAdminPassword: z
		.string()
		.default("Allohouston")
		.describe("Password for the super admin user"),
	slackWebHookUrl: z
		.string()
		.default("")
		.describe("Slack Webhook URL for notifications"),
	mails: z
		.object({
			enabled: z
				.boolean()
				.default(true)
				.describe("Enable or disable email sending"),
			sendEmailsFrom: z.string().default("contact@allohouston.fr"),
			sendEmailsTo: z
				.string()
				.optional()
				.describe(
					"Override recipient for emails when we are not in production",
				),
		})
		.describe("Email related settings"),
	jobs: z.object({
		exampleJob: z
			.object({
				enabled: z
					.boolean()
					.default(true)
					.describe("Enable or disable the job"),
			})
			.optional()
			.describe("Example job configuration"),
	}),
	s3: z
		.object({
			bucket: z.string().describe("AWS S3 Bucket Name"),
			access_key: z.string().describe("AWS S3 Access Key ID"),
			access_secret: z.string().describe("AWS S3 Secret Access Key"),
			region: z.string().describe("AWS S3 Region"),
			endpoint: z.string().optional().describe("AWS S3 Endpoint URL"),
		})
		.optional(),
	/**
	 * List of development users to seed automatically when in Meteor.isDevelopment.
	 * This is NEVER intended for production usage. Objects are idempotent (matched by email).
	 */
	fakeUsers: z
		.array(
			z.object({
				email: z.string().describe("User email (unique identifier)"),
				firstName: z.string().default("Fake").describe("First name"),
				lastName: z.string().default("User").describe("Last name"),
				password: z
					.string()
					.optional()
					.describe(
						"Optional explicit password. If omitted, a random password is generated and logged in server console.",
					),
				roles: z
					.array(
						z.object({
							id: z
								.string()
								.describe(
									"Role id as defined in ALL_ROLES (e.g. superAdmin, admin)",
								),
							scope: z
								.string()
								.nullable()
								.optional()
								.describe(
									"Optional scope/group for scoped roles; omit or null for global role.",
								),
						}),
					)
					.default([])
					.describe(
						"List of roles (with optional scope) to assign. First entry becomes the primary role in UserAccess.role field.",
					),
				verified: z
					.boolean()
					.default(true)
					.describe("Mark email as verified (dev convenience)"),
				sendEnrollment: z
					.boolean()
					.default(false)
					.describe(
						"If true and no password provided, an enrollment email is sent (only if mails.enabled).",
					),
			}),
		)
		.optional()
		.describe(
			"Development-only user fixtures. Ignored in production; safe to omit entirely.",
		),
});

/** Monti schema (optional for server) */
const MontiSettingsSchema = z
	.object({
		appId: z.string().describe("Monti app ID"),
		appSecret: z.string().describe("Monti app secret"),
		options: z
			.object({
				eventStackTrace: z
					.boolean()
					.default(true)
					.describe("Enable event stack trace"),
			})
			.describe("Monti API configuration options"),
	})
	.optional()
	.describe("Monti monitoring service configuration");

/** Client-side schema (public only) */
export const ClientSettingsSchema = z.object({
	public: PublicSettingsSchema,
});

/** Server-side schema (public + private) */
export const ServerSettingsSchema = z.object({
	public: PublicSettingsSchema,
	monti: Meteor.isServer ? MontiSettingsSchema : z.undefined(),
	private: Meteor.isServer ? PrivateSettingsSchema : z.undefined(),
});

export const SettingsSchema = ServerSettingsSchema;
