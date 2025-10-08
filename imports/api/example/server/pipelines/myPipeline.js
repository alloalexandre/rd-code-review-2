/**
 * This file is used to define MongoDB aggregation pipelines for the example API.
 *
 * Prefer named exports over default exports for better maintainability.
 */

export const MY_PIPELINE = [
	{
		$match: {
			// Add your match criteria here
		},
	},
	{
		$group: {
			_id: "$fieldName",
			count: { $sum: 1 },
		},
	},
];
