import z from "zod";
import { ALL_ROLES } from "/imports/globals/roles";
import { validatedQuery } from "/imports/utils/validatedQuery";
import { Example } from "../..";
import { CORE_FIELDS } from "./bodies";

/**
 * This file is used to define grapher queries.
 * You should always return an object with the following order: filters, fields, links and reducers.
 *
 * Prefer named export over default export or attaching to the collection directly for type inference purposes.
 *
 * @see https://www.bluelibs.com/docs/package-nova/#querying
 */
export const getExample = validatedQuery(
	Example,
	z.object({
		role: z.string().refine((role) => Object.keys(ALL_ROLES).includes(role)),
	}),
	(params) => ({
		$: {
			filters: {
				role: params.role,
			},
			options: {},
		},

		// fields
		...CORE_FIELDS,

		// reducers
		status: 1,
	}),
);

/**
 * Then attach the query to the collection (if needed).
 */
Example.grapherQueries.getExample = getExample;
