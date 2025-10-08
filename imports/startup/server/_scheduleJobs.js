import { Jobs } from "meteor/msavin:sjobs";
import { sendSlackAlert } from "/imports/utils/slack";
import { METEOR_SETTINGS } from "../both/_settings";

/**
 * @typedef {{id: string, name: string, jobFn: Function, options: {initialSchedule?: object, replicateIn?: object, runTime?: object}}} Job
 * @typedef {Record<string, Job>} JobDefinition
 */

/**
 * Register all jobs defined in the jobs object.
 * @param {JobDefinition} jobs - An object where keys are job names and values are job definitions.
 * @returns {Promise<boolean>} - Returns true if jobs were registered successfully, false otherwise.
 */
export async function registerJobs(jobs) {
	console.log("Starting job registration...");

	const jobsMap = Object.fromEntries(
		Object.values(jobs)
			.filter((job) => {
				// Filter out disabled jobs first
				const jobsConfig = METEOR_SETTINGS.private?.jobs || {};
				const jobConfig = jobsConfig[job.id];

				if (!jobConfig?.enabled) {
					console.log(
						`Job ${job.name} is disabled in settings, skipping registration.`,
					);
					return false;
				}
				return true;
			})
			.map((job) => {
				console.log(`Registering job: ${job.name}`);

				return [
					job.name,
					async (/** @type {any} */ ...args) => {
						console.log(`Running ${job.name} with args:`, args);

						try {
							await job.jobFn.apply(this, args);

							if (job.options?.replicateIn) {
								await this.reschedule({
									in: job.options.replicateIn,
								});
							} else {
								// Mark as success for one-time jobs
								await this.success();
							}
						} catch (err) {
							console.error(`Error in ${job.name}:`, err);
							await sendSlackAlert(
								`Erreur durant l'exécution d'un cron : ${job.name}. Message : ${err.message}`,
							);
							await this.failure(err.message);
						}
					},
				];
			})
			.filter(Boolean),
	);

	if (!Object.keys(jobsMap).length) {
		console.log("No jobs to register.");
		return false;
	}

	try {
		await Jobs.register(jobsMap);
		console.log("All jobs registered successfully");
		return true;
	} catch (error) {
		console.error("Error registering jobs:", error);
	}
}

/**
 * Schedule all registered jobs based on their initial schedule configuration.
 * @param {JobDefinition} jobs - An object where keys are job names and values are job definitions.
 * @returns {Promise<void>}
 */
export async function scheduleJobs(jobs) {
	console.log("Starting job scheduling...");

	// Configure Jobs
	const JOB_INTERVAL_MS = 5000; // Check every 5 seconds
	Jobs.configure({
		interval: JOB_INTERVAL_MS,
		autoStart: true,
	});
	console.log(`Job interval configured to ${JOB_INTERVAL_MS}ms`);

	try {
		const schedulingPromises = Object.values(jobs).map(async (job) => {
			console.log(`Scheduling job: ${job.name}`);

			const scheduleConfig = {
				singular: true,
				...(job.options?.initialSchedule || { in: { seconds: 1 } }),
			};

			console.log(`Job ${job.name} will start:`, scheduleConfig);

			const result = await Jobs.run(job.name, scheduleConfig);
			console.log(`Job ${job.name} scheduled with result:`, result);
			return result;
		});

		await Promise.all(schedulingPromises);
		console.log("All jobs scheduled successfully");
	} catch (error) {
		console.error("Error scheduling jobs:", error);
	}
}

/**
 * Initialize the job system: register and schedule jobs.
 * This function is called on Meteor startup.
 * @param {JobDefinition} jobs - An object where keys are job names and values are job definitions.
 * @returns {Promise<void>}
 */
export async function createJobs(jobs) {
	console.log("Meteor startup - initializing jobs system...");

	try {
		const shouldSchedule = await registerJobs(jobs);

		if (!shouldSchedule) {
			console.log("No jobs registered, skipping scheduling.");
			return;
		}

		await scheduleJobs(jobs);
		console.log("Job system initialization complete");
	} catch (error) {
		console.error("Fatal error during job system initialization:", error);
	}
}
