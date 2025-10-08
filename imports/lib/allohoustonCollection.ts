import type Query from "@bluelibs/nova/dist/core/query/Query";
import type SimpleSchema from "meteor/aldeed:simple-schema";
import type { DDP } from "meteor/ddp";
import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import type { NpmModuleMongodb } from "meteor/npm-mongo";
import type {
	AnyBulkWriteOperation,
	BulkWriteResult,
	Document,
	Collection as MongoCollection,
	UpdateManyModel,
	UpdateOneModel,
} from "mongodb";
import {
	addLinksFunction,
	addReducersFunction,
} from "../startup/both/_mongoExtension";

/**
 * Options for AHMongoCollection constructor - matches Mongo.Collection constructor options
 */
export interface AHCollectionOptions<
	T extends NpmModuleMongodb.Document,
	U = T,
> {
	connection?: DDP.DDPStatic | null;
	idGeneration?: "STRING" | "MONGO";
	transform?: (doc: T) => U;
	defineMutationMethods?: boolean;
}

/**
 * Options for clean and check operations
 */
export interface CleanAndCheckOptions {
	isInsert?: boolean;
	isUpsert?: boolean;
	isUpdate?: boolean;
	throwOnError?: boolean;
}

/**
 * Update one operation wrapper
 */
export interface UpdateOneOperation<T extends Document = Document> {
	updateOne: UpdateOneModel<T>;
}

/**
 * Update many operation wrapper
 */
export interface UpdateManyOperation<T extends Document = Document> {
	updateMany: UpdateManyModel<T>;
}

/**
 * Union type for supported bulk update operations
 */
export type UpdateBulkOperation<T extends Document = Document> =
	| UpdateOneOperation<T>
	| UpdateManyOperation<T>;

/**
 * Type guard to check if operation is an update operation
 */
function isUpdateOperation<T extends Document>(
	op: AnyBulkWriteOperation<T>,
): op is UpdateBulkOperation<T> {
	return "updateOne" in op || "updateMany" in op;
}

/**
 * Type for Meteor method functions
 */
// biome-ignore lint/suspicious/noExplicitAny: Needed for Meteor methods
type MeteorMethodFunction = (...args: any[]) => any;

/**
 * Allohouston extension of Mongo.Collection
 * Adds compatibility with Nova and provides enhanced security defaults
 */
export class AHMongoCollection<
	T extends NpmModuleMongodb.Document,
	U = T,
> extends Mongo.Collection<T, U> {
	methods: Record<string, MeteorMethodFunction>;
	// biome-ignore lint/suspicious/noExplicitAny: Needed for grapher queries
	grapherQueries: Record<string, (...params: any[]) => Query<Document>>;
	// biome-ignore lint/suspicious/noExplicitAny: Needed for security object
	security: Record<string, any>;
	raw?: MongoCollection<T>;
	addReducers?: typeof addReducersFunction;
	addLinks?: typeof addLinksFunction;
	schema?: SimpleSchema | null;

	/**
	 * Creates a new AHMongoCollection instance
	 */
	constructor(name: string | null, options: AHCollectionOptions<T, U> = {}) {
		super(name, options);

		this.methods = {};
		this.grapherQueries = {};
		this.security = {};

		// Apply default allow/deny rules for security
		this.allow(ALLOW_DENY_DEFAULTS.allowRules);
		this.deny(ALLOW_DENY_DEFAULTS.denyRules);

		// This is needed for compatibility with @bluelibs/nova. We want to maintain a single instance of raw collection on server.
		if (Meteor.isServer) {
			this.raw = this.rawCollection();

			// Add utility functions for server-side operations
			this.addReducers = addReducersFunction;
			this.addLinks = addLinksFunction;
		}
	}

	// Extending bulkWrite to include data validation and preparation
	bulkWrite = (
		operations: UpdateBulkOperation<T>[],
	): Promise<BulkWriteResult> | undefined => {
		// Check if all operations are update operations (updateOne or updateMany)
		const hasInvalidOperation = operations.some((op) => !isUpdateOperation(op));

		if (hasInvalidOperation) {
			throw new Meteor.Error(
				"bulkWrite only supports update operations (e.g., updateOne, updateMany)",
			);
		}

		const cleanedOperations = validateAndPrepareData.call(this, operations);
		return this.raw?.bulkWrite(cleanedOperations as AnyBulkWriteOperation<T>[]);
	};
}

/**
 * Default allow/deny rules for AHMongoCollection.
 * Denies all client-side writes by default for security.
 */
export const ALLOW_DENY_DEFAULTS = {
	allowRules: {
		insert(_userId: string, _doc: unknown): boolean {
			return false;
		},
		update(
			_userId: string,
			_doc: unknown,
			_fieldNames: string[],
			_modifier: unknown,
		): boolean {
			return false;
		},
		remove(_userId: string, _doc: unknown): boolean {
			return false;
		},
	},
	denyRules: {
		insert(_userId: string, _doc: unknown): boolean {
			return true;
		},
		update(
			_userId: string,
			_doc: unknown,
			_fieldNames: string[],
			_modifier: unknown,
		): boolean {
			return true;
		},
		remove(_userId: string, _doc: unknown): boolean {
			return true;
		},
	},
};

/**
 * Validates and prepares bulk write operations for execution.
 * This function is called in the context of an AHMongoCollection instance.
 *
 * @throws {Meteor.Error} Throws validation error if any operation fails schema validation
 */
export function validateAndPrepareData<
	T extends NpmModuleMongodb.Document,
	U = T,
>(
	this: AHMongoCollection<T, U>,
	operations: UpdateBulkOperation[],
): AnyBulkWriteOperation<T>[] {
	const schema: SimpleSchema = this.simpleSchema();
	const userId: string = this.userId;

	const cleanedOperations = operations.map((op) => {
		const isUpdateOne = "updateOne" in op;
		const [key, operation] = isUpdateOne
			? (["updateOne", op.updateOne] as const)
			: (["updateMany", op.updateMany] as const);

		const validationContext = schema.namedContext();

		const cleaned = validationContext.clean(operation.update, {
			autoConvert: false,
			isUpdate: true,
			extendAutoValueContext: { isUpdate: true, userId },
			isModifier: true,
			removeEmptyStrings: false,
			removeNullsFromArrays: false,
			trimStrings: false,
			filter: false,
			getAutoValues: true,
		});

		if (!validationContext.validate(cleaned, { modifier: true })) {
			throw new Meteor.Error(
				"bulkWrite - Validation error",
				validationContext.validationErrors(),
			);
		}

		return { [key]: { ...operation, update: cleaned } };
	});

	const mongoOperations = cleanedOperations.map((op) => {
		if ("updateOne" in op) {
			return { updateOne: op.updateOne } as AnyBulkWriteOperation<T>;
		}
		if ("updateMany" in op) {
			return { updateMany: op.updateMany } as AnyBulkWriteOperation<T>;
		}
		throw new Error("Unexpected operation type");
	});

	return mongoOperations;
}
