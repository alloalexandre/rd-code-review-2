import { createMethod } from "meteor/jam:method";
import { Meteor } from "meteor/meteor";
import z from "zod";
import { ALL_ROLES } from "/imports/globals/roles";
import { upsertFakeUser } from "/imports/utils/seedFakeUsers";

const RoleInput = z.object({
	id: z.string().refine((v) => Reflect.has(ALL_ROLES, v)),
	scope: z.string().nullable().optional(),
});

const MIN_PASSWORD_LENGTH = 4;

export const DevMethods = {};

if (Meteor.isDevelopment) {
	DevMethods.upsertFakeUser = createMethod({
		name: "Dev.methods.upsertUser",
		schema: z.object({
			email: z.email(),
			password: z.string().min(MIN_PASSWORD_LENGTH).optional(),
			firstName: z.string().optional(),
			lastName: z.string().optional(),
			roles: z.array(RoleInput).default([]),
			verified: z.boolean().default(true),
			sendEnrollment: z.boolean().default(false),
		}),
		open: true, // dev only
		async run(params) {
			if (!Meteor.isDevelopment) {
				throw new Meteor.Error("forbidden", "Not available in production");
			}
			return upsertFakeUser(params);
		},
	});
}
