import { query } from "@bluelibs/nova";
import type Query from "@bluelibs/nova/dist/core/query/Query";
import type { NpmModuleMongodb } from "meteor/npm-mongo";
import type { ZodType, z } from "zod";
import type { AHMongoCollection } from "/imports/lib/allohoustonCollection";

type NovaQueryConfig = {
	[fieldName: string]: NovaQueryConfig | string | number;
};

/**
 * Creates a validated query function that combines Zod schema validation with Nova queries.
 *
 * @example
 * const getUserAccessByRole = validatedQuery(
 *   UserAccess,
 *   z.object({
 *     role: z.string(),
 *     limit: z.number().optional()
 *   }),
 *   (params) => ({
 *     $: {
 *       filters: { role: params.role },
 *       limit: params.limit || 10
 *     },
 *     firstName: 1,
 *     lastName: 1,
 *     email: 1
 *   })
 * );
 */
export const validatedQuery = <
	T extends NpmModuleMongodb.Document,
	U,
	TSchema extends ZodType,
>(
	collection: AHMongoCollection<T, U>,
	schema: TSchema,
	queryBuilder: (validatedParams: z.infer<TSchema>) => NovaQueryConfig,
): ((params: z.infer<TSchema>) => Query<T>) => {
	return (params: z.infer<TSchema>) => {
		// Validate parameters with Zod schema
		const validatedParams = schema.parse(params);

		// Build query configuration using validated parameters
		const queryConfig = queryBuilder(validatedParams);

		// Ensure collection is initialized
		if (!collection.raw) {
			throw new Error("Collection is not initialized");
		}

		// Return Nova query
		return query(collection.raw, queryConfig);
	};
};

/**
 * Creates a validated query function with custom error handling.
 */
export const validatedQueryWithErrorHandling = <
	T extends NpmModuleMongodb.Document,
	U,
	TSchema extends ZodType,
>(
	collection: AHMongoCollection<T, U>,
	schema: TSchema,
	queryBuilder: (validatedParams: z.infer<TSchema>) => NovaQueryConfig,
	errorHandler: (
		error: Error,
		...originalParams: unknown[]
	) => Query<T> | undefined,
): ((params: z.infer<TSchema>) => Query<T> | undefined) => {
	return (params: z.infer<TSchema>) => {
		try {
			// Validate parameters with Zod schema
			const validatedParams = schema.parse(params);

			// Build query configuration using validated parameters
			const queryConfig = queryBuilder(validatedParams);

			// Ensure collection is initialized
			if (!collection.raw) {
				throw new Error("Collection is not initialized");
			}

			// Return Nova query
			return query(collection.raw, queryConfig);
		} catch (error) {
			if (errorHandler) {
				if (error instanceof Error) {
					return errorHandler(error, params);
				}
				return errorHandler(new Error("Unknown error"), params);
			}
			throw error;
		}
	};
};
