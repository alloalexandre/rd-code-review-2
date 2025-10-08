/** biome-ignore-all lint/suspicious/noExplicitAny: We need flexibility */
import { Meteor } from "meteor/meteor";
import { Roles } from "meteor/roles";

export type AllowRule<T = any> = {
	roles: true | string | string[];
	scope?: Scope<T>;
};

export type AllowParam<T = any> = true | Array<AllowRule<T>>;

export type Scope<T = any> = string | null | true | ((...args: T[]) => string);

/**
 * Validates input parameters for checkRoles function.
 * @throws {Error} If allow is invalid
 */
function validateAllow<T>(allow: AllowParam<T>): void {
	if (!allow) {
		throw new Error("checkRoles requires an allow definition");
	}

	if (allow !== true && !Array.isArray(allow)) {
		throw new Error(
			"checkRoles expects allow to be true or an array of role/scope rules",
		);
	}
}

/**
 * Handles simple logged-in user check.
 * @throws {Meteor.Error} If user is not logged in
 */
function handleSimpleLoginCheck<T>(userId: string | null, args: T): T {
	if (!userId) {
		throw new Meteor.Error("Permissions.NotAllowed", "User must be logged in");
	}
	return args;
}

/**
 * Resolves a scope value, handling dynamic scope functions.
 */
function resolveScope<T>(scope: Scope<T>, args: T): string | null | true {
	if (typeof scope !== "function") {
		return scope;
	}

	try {
		return scope(args);
	} catch (error) {
		console.error("Error resolving dynamic scope:", error);
		return null;
	}
}

/**
 * Creates a permission check promise for a single role/scope rule.
 */
async function checkSinglePermission<T>(
	userId: string | null,
	roles: true | string | string[],
	resolvedScope: Scope<T>,
): Promise<boolean> {
	const targetGroup =
		resolvedScope === null ? "__global_roles__" : resolvedScope;

	if (!userId) {
		return false;
	}

	if (roles === true && targetGroup === true) {
		return !!userId;
	}

	if (roles === true && typeof targetGroup === "string") {
		const userRoles = await Roles.getRolesForUserAsync(userId, targetGroup);
		return userRoles.length > 0;
	}

	let scopeOptions: Parameters<typeof Roles.userIsInRoleAsync>[2];

	switch (typeof targetGroup) {
		case "string":
			scopeOptions = targetGroup;
			break;
		case "boolean":
			// true = vérifier dans tous les scopes, false/undefined = scope global
			scopeOptions = targetGroup ? { anyScope: true } : undefined;
			break;
		case "function":
			try {
				const result = targetGroup();
				scopeOptions = typeof result === "string" ? result : undefined;
			} catch (error) {
				console.warn(
					"Erreur lors de l'exécution de la fonction targetGroup:",
					error,
				);
				scopeOptions = undefined;
			}
			break;
		default:
			scopeOptions = undefined;
	}

	if (typeof roles === "string" || Array.isArray(roles)) {
		return await Roles.userIsInRoleAsync(userId, roles, scopeOptions);
	}

	return false;
}

/**
 * Creates a pre-execution permissions check wrapper for methods or resolvers.
 *
 * This function validates that the current user meets the access requirements
 * defined in the `allow` parameter before proceeding. It supports simple
 * "logged-in" checks, as well as role/scope-based authorization with dynamic scope inference.
 *
 * ### Usage
 * ```js
 * // Static scope
 * const securedResolver = checkRoles([
 *   { roles: ["admin"], scope: "org123" },
 * ]);
 *
 * // Dynamic scope from args
 * const securedResolver = checkRoles([
 *   { roles: ["editor"], scope: (args) => args.projectId },
 *   { roles: ["admin"], scope: (args) => args.organizationId },
 * ]);
 *
 * await securedResolver(args, context);
 * ```
 *
 * ### Parameters
 * - `allow`: Defines who is allowed access. It can be:
 * - **true**: Any logged-in user is allowed.
 * - **Array**: One or more role/scope rules, where:
 *   - `roles`: Either:
 *     - `true`: any role in the scope,
 *     - `string` or `string[]`: required role(s).
 *   - `scope`: Either:
 *     - `string`: static target scope for the role,
 *     - `null`: check global roles,
 *     - `true`: require user to have any role in any scope,
 *     - `Function`: (args) => string - dynamically resolve scope from method arguments.
 *
 * A wrapper function that checks permissions before returning `args`.
 *
 * @throws {Error} If `allow` is missing or invalid.
 * @throws {Meteor.Error} If the user is not logged in (when required), or if none of the role/scope checks grant access.
 */
export function checkRoles<T = any>(
	allow: AllowParam<T>,
): (args: T, context: { userId?: string }) => Promise<T> {
	// validate input
	validateAllow(allow);

	/**
	 * The returned function that performs the permission check.
	 * @throws {Meteor.Error} If not authorized
	 */
	return async (args: T, context: { userId?: string }): Promise<T> => {
		const userId = context.userId || Meteor.userId();

		if (allow === true) {
			return handleSimpleLoginCheck(userId, args);
		}

		// build all checks into promises
		const checks = allow.map(async ({ roles, scope }) => {
			if (!scope) {
				scope = null;
			}
			const resolvedScope = resolveScope(scope, args);
			return await checkSinglePermission(userId, roles, resolvedScope);
		});

		const results = await Promise.all(checks);
		const isAllowed = results.some(Boolean);

		if (!isAllowed) {
			throw new Meteor.Error(
				"Permissions.NotAllowed",
				`User ${userId} is not allowed`,
			);
		}

		return args;
	};
}
