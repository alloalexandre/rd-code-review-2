import { Accounts } from "meteor/accounts-base";
import { Meteor } from "meteor/meteor";
import { Random } from "meteor/random";
import { Roles } from "meteor/roles";
import { UserAccess } from "/imports/api/userAccess/index";
import { ALL_ROLES } from "/imports/globals/roles";
import type { RoleObject } from "./roles";

/**
 * Validate and normalize a role entry.
 */
function normalizeRole(roleObj: RoleObject): RoleObject {
	if (!roleObj || typeof roleObj !== "object") {
		throw new Meteor.Error(
			"invalid-role-object",
			"Role object must be an object",
		);
	}
	const { id, scope = null } = roleObj;
	if (!id || typeof id !== "string") {
		throw new Meteor.Error("invalid-role-id", "Role id must be a string");
	}
	if (!Reflect.has(ALL_ROLES, id)) {
		throw new Meteor.Error(
			"unknown-role",
			`Role '${id}' is not defined in ALL_ROLES`,
		);
	}
	return { id, scope: scope ?? null };
}

const GENERATED_PASSWORD_LENGTH = 12 as const;

type CreateNewUserParams = {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
};

/**
 * This function creates a new user with the given details.
 */
async function createNewUser({
	email,
	password,
	firstName,
	lastName,
}: CreateNewUserParams): Promise<Meteor.User | undefined> {
	const userId = await Accounts.createUserAsync({
		email,
		password,
		profile: { firstName, lastName },
	});
	return await Meteor.users.findOneAsync({ _id: userId });
}

type UpsertUserAccessParams = {
	userId: string;
	primaryRole?: string;
	firstName: string;
	lastName: string;
	email: string;
};

/**
 * This function upserts a UserAccess document for the given user.
 * If a document already exists, it updates the firstName, lastName, email, and optionally the role.
 * If no document exists, it creates a new one with the provided details.
 */
async function upsertUserAccess({
	userId,
	primaryRole,
	firstName,
	lastName,
	email,
}: UpsertUserAccessParams): Promise<void> {
	const existing = await UserAccess.findOneAsync({ userId });
	if (existing) {
		const set: {
			firstName: string;
			lastName: string;
			email: string;
			role?: string;
		} = { firstName, lastName, email };

		if (primaryRole) {
			set.role = primaryRole;
		}

		await UserAccess.updateAsync({ _id: existing._id }, { $set: set });
	} else {
		await UserAccess.insertAsync({
			userId,
			role: primaryRole || ALL_ROLES.admin.id,
			firstName,
			lastName,
			email,
		});
	}
}

/** Assign roles to a user using alanning:roles package.
 * Supports optional scope for each role.
 */
async function assignRoles(
	userId: string,
	normalizedRoles: Array<{ id: string; scope?: string | null }>,
): Promise<void> {
	if (!Roles) {
		return;
	}

	await Promise.all(
		normalizedRoles.map((r) => {
			const addFn = Roles.addUsersToRolesAsync || Roles.addUsersToRoles; // support non-async version
			return r.scope
				? addFn.call(Roles, userId, [r.id], r.scope)
				: addFn.call(Roles, userId, [r.id]);
		}),
	);
}

type UpsertFakeUserParams = {
	email: string;
	password?: string;
	firstName?: string;
	lastName?: string;
	roles?: Array<{ id: string; scope?: string | null }>;
	verified?: boolean;
	sendEnrollment?: boolean;
};

/**
 * Upsert (create or update) a development user.
 * - Idempotent by email
 * - Supports multiple roles (first becomes primary role in UserAccess)
 * - Marks email verified if requested
 */
export async function upsertFakeUser({
	email,
	password,
	firstName = "Fake",
	lastName = "User",
	roles = [],
	verified = true,
	sendEnrollment = false,
}: UpsertFakeUserParams): Promise<{
	userId: string;
	created: boolean;
	updated: boolean;
	passwordGenerated?: string;
}> {
	if (!Meteor.isDevelopment) {
		throw new Meteor.Error(
			"forbidden",
			"Fake user creation only allowed in development",
		);
	}
	if (!email) throw new Meteor.Error("missing-email", "Email is required");
	const normalizedRoles = roles.map(normalizeRole);
	const primaryRole = normalizedRoles[0]?.id;

	let user = await Meteor.users.findOneAsync({ "emails.address": email });
	let created = false;
	let updated = false;
	let generatedPassword: string | undefined;

	// Create or update user
	if (user) {
		updated = true;
		if (firstName || lastName) {
			await Meteor.users.updateAsync(
				{ _id: user._id },
				{
					$set: {
						firstName: firstName,
						lastName: lastName,
					},
				},
			);
		}
	} else {
		if (!password) {
			generatedPassword = Random.id(GENERATED_PASSWORD_LENGTH);
			password = generatedPassword;
		}
		user = await createNewUser({ email, password, firstName, lastName });
		created = true;
	}

	if (!user?._id) {
		throw new Meteor.Error("user-creation-failed", "User creation failed");
	}

	await upsertUserAccess({
		userId: user._id,
		primaryRole,
		firstName,
		lastName,
		email,
	});

	await assignRoles(user._id, normalizedRoles);

	// Mark email verified (first email)
	if (verified) {
		await Meteor.users.updateAsync(
			{ _id: user._id },
			{ $set: { "emails.0.verified": true } },
		);
	}

	if (sendEnrollment && !password) {
		Accounts.sendEnrollmentEmail(user._id);
	}

	if (generatedPassword) {
		console.log(
			`[FAKE USERS] Generated password for ${email}: ${generatedPassword}`,
		);
	}
	console.log(
		`[FAKE USERS] Upserted ${email} created=${created} updated=${updated} roles=[${normalizedRoles.map((r) => r.id).join(",")}]`,
	);

	return {
		userId: user._id,
		created,
		updated,
		passwordGenerated: generatedPassword,
	};
}

/**
 * Seed all fake users from METEOR_SETTINGS.private.fakeUsers array.
 */
export async function seedFakeUsers(
	fakeUsers: Array<UpsertFakeUserParams> = [],
): Promise<void> {
	if (!Meteor.isDevelopment) return;
	if (!Array.isArray(fakeUsers) || fakeUsers.length === 0) return;

	await Promise.all(
		fakeUsers.map(async (u) => {
			try {
				await upsertFakeUser(u);
			} catch (e) {
				console.error(`[FAKE USERS] Failed to upsert ${u?.email}:`, e);
			}
		}),
	);
}
