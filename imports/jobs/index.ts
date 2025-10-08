import { Meteor } from "meteor/meteor";
import type { AnyFunction } from "/types/core";
import { createJobs } from "../startup/server/_scheduleJobs";
import { exampleJobFn } from "./exampleJob";

export type Job = {
	id: string;
	name: string;
	jobFn: AnyFunction;
	options: {
		initialSchedule?: object;
		replicateIn?: object;
		runTime?: object;
	};
};

export type JobDefinition = Record<string, Job>;

/**
 * This is the list of all jobs available with their scheduling options.
 *
 * Each job has:
 * - id: unique identifier for the job (used in settings)
 * - name: name of the job
 * - jobFn: function to be executed
 * - options: options for scheduling the job
 *   - initialSchedule: when to run the job for the first time (uses SteveJobs 'in' or 'on' format)
 *   - replicateIn: options for replicating the job - it means that the job will be executed again in the future and you can choose when
 *   - runTime: time to run the job - it means that the job will be executed at this specific time
 */
export const jobs: JobDefinition = {
	example: {
		id: "exampleJob",
		name: "example",
		jobFn: exampleJobFn,
		options: {
			// Start the first run at the next full minute
			initialSchedule: { on: { seconds: 0 } },
			// Then repeat every 10 minutes
			replicateIn: { minutes: 10 },
		},
	},
};

Meteor.startup(async () => {
	await createJobs(jobs);
});
