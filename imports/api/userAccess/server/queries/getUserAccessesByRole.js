import z from "zod";
import { ALL_ROLES } from "/imports/globals/roles";
import { validatedQuery } from "/imports/utils/validatedQuery";
import { UserAccess } from "../..";
import { CORE_FIELDS } from "./bodies";

/**
 * This file is used to define grapher queries.
 * You should always return an object with the following order: filters, fields, links and reducers.
 *
 * @see https://www.bluelibs.com/docs/package-nova/#querying
 */

/**
 * Get all user access with given role.
 *
 * @param {Object} params - Object with a role property.
 * @returns {Object} - Object with a query to get all user access with given role.
 */
UserAccess.grapherQueries.getUserAccessesByRole = validatedQuery(
	UserAccess,
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
