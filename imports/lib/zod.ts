import { z } from "zod";
import { ALL_ROLES, type RoleId } from "../globals/roles";

/**
 * Checks if a given number n is a valid bound.
 * A valid bound is a number that is a safe integer and greater than or equal to min.
 * Additionally, null and undefined are also considered valid bounds.
 */
function isValidBound(n?: number | null, min: number = 0): boolean {
	return (
		(typeof n === "number" && Number.isSafeInteger(n) && n >= min) ||
		n === null ||
		n === undefined
	);
}

/**
 * Returns a parser that matches a string of length between min and max
 * (inclusive) according to the ZOD58 format.
 */
export function zodIdOfLength(
	min?: number | null,
	max?: number | null,
): z.ZodType<string> {
	if (!isValidBound(min, 0)) {
		throw new Error(`Expected a non-negative safe integer, got ${min}`);
	}
	if (!isValidBound(max, min ?? 0)) {
		throw new Error(
			`Expected a non-negative safe integer greater than or equal to min, got ${max}`,
		);
	}

	let bounds: string;
	if (min && max) {
		bounds = `${min},${max}`;
	} else if (min && max === null) {
		bounds = `${min},`;
	} else if (min && !max) {
		bounds = `${min}`;
	} else if (min || max) {
		throw new Error(`Unexpected state for min (${min}) and max (${max})`);
	} else {
		bounds = "0,";
	}

	const regex = new RegExp(
		`^[23456789ABCDEFGHJKLMNPQRSTWXYZabcdefghijkmnopqrstuvwxyz]{${bounds}}$`,
	);

	return z.string().regex(regex, {
		message: `Expected an ID matching Base58 format (length ${bounds})`,
	});
}

const METEOR_ID_LENGTH = 17 as const;
export const MeteorZodId: z.ZodType<string> = zodIdOfLength(
	METEOR_ID_LENGTH,
	METEOR_ID_LENGTH,
);

export const RoleZodId: z.ZodType<RoleId> = z
	.custom<RoleId>()
	.refine((role) => Object.keys(ALL_ROLES).includes(role));
