import { sendSlackAlert } from "/imports/utils/slack";
import type { AnyFunction } from "/types/core";

/**
 * Creates a job function that wraps a given function and handles errors.
 * The wrapped function will log its start and any errors that occur.
 * If the job is configured to repeat, it will also handle the replication.
 * @param {string} jobLabel - label of the job
 * @param {Function} jobFn - function to be wrapped
 * @param {Object} options - job options
 *   - runTime: { minutes, seconds, milliseconds } for exact time
 */
export function createJob(
	jobLabel: string,
	jobFn: AnyFunction,
	options: Record<string, unknown> = {},
): AnyFunction {
	return async (): Promise<void> => {
		console.log(`Running ${jobLabel}`);

		try {
			await jobFn();
		} catch (err) {
			console.error(`Error in ${jobLabel}:`, err);
			if (err instanceof Error) {
				await sendSlackAlert(
					`Erreur durant l'exécution d'un cron : ${jobLabel}. Message : ${err.message}`,
				);
			} else {
				await sendSlackAlert(
					`Erreur durant l'exécution d'un cron : ${jobLabel}. Message : ${JSON.stringify(err)}`,
				);
			}
		} finally {
			// If you need to handle success/replicate, pass those as part of options and call them here
			if (typeof options.success === "function") {
				await options.success();
			}

			if (typeof options.replicate === "function" && options.replicateIn) {
				await options.replicate({
					in: options.replicateIn,
				});
			}
		}
	};
}
