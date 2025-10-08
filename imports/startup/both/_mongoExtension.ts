import "meteor/aldeed:collection2/static";

import type { ILinkOptions, IReducerOptions } from "@bluelibs/nova";
import { addLinks, addReducers } from "@bluelibs/nova";
import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import type { Collection, Document, Filter } from "mongodb";

export type CollectionContext<TSchema extends Document = Document> = {
	raw: Collection<TSchema>;
};

export type MeteorLinkConfig<TSchema extends Document = Document> = {
	collection: {
		raw: Collection<TSchema>;
	};
	field?: string;
	foreignField?: string;
	unique?: boolean;
	many?: boolean;
	inversedBy?: string;
	index?: boolean;
	filters?: Filter<TSchema>;
};

/**
 * Input links configuration for Meteor collections
 */
export type MeteorLinksInput<TSchema extends Document = Document> = Record<
	string,
	MeteorLinkConfig<TSchema>
>;

/**
 * Wrapper for Nova's addReducers function to use Meteor collections directly.
 * Ensures all reducer functions are async.
 */
export function addReducersFunction(
	this: CollectionContext,
	reducers: IReducerOptions,
): void {
	// Validate that all reduce functions are async
	for (const [key, reducer] of Object.entries(reducers)) {
		try {
			const reducerConfig = reducer;
			if (typeof reducerConfig.reduce === "function") {
				const result = reducerConfig.reduce({});
				if (!(result instanceof Promise)) {
					console.warn("*********************************");
					console.warn(
						`The reduce function of the reducer "${key}" must be async. Current constructor: `,
						reducerConfig.reduce.constructor.name,
					);
					console.warn("*********************************");
				}
			}
		} catch (err) {
			console.warn(`Error while testing reducer "${key}":`, err);
		}
	}

	// Call Nova's addReducers using the raw collection
	addReducers(this.raw, reducers);
}

/**
 * A wrapper for Nova addLinks function to use Meteor collections directly.
 * Transforms link collections to use the raw Mongo collection.
 */
export function addLinksFunction<TSchema extends Document = Document>(
	this: CollectionContext<TSchema>,
	links: MeteorLinksInput<TSchema>,
): void {
	if (!this?.raw) {
		throw new Error(
			"addLinksFunction must be called with a context that has `raw` collection.",
		);
	}

	const newLinks = Object.entries(links).reduce((acc, [linkKey, link]) => {
		const linkConfig = {
			collection: () => link.collection.raw,
			field: link.field,
			foreignField: link.foreignField,
			unique: link.unique,
			many: link.many,
			inversedBy: link.inversedBy,
			index: link.index,
			filters: link.filters,
		};

		acc[linkKey] = linkConfig;

		// Create index if field exists and is not nested
		if (link.field && !link.field.includes(".")) {
			this.raw.createIndex({ [link.field]: 1 });
		}

		return acc;
	}, {} as ILinkOptions);

	addLinks(this.raw, newLinks);
}

/**
 * Tweak to fix grapher issue when trying to find "role-assignment" created by alanning:role. This is a workaround.
 * Extends Mongo.Collection with fallback lookup functionality.
 */
if (!Mongo.Collection.getOrig) {
	// Keep a reference to the original get method
	Mongo.Collection.getOrig = Mongo.Collection.get;

	// Override Mongo.Collection.get
	Mongo.Collection.get = (entryPointName: string): unknown => {
		// First, try the original method
		const original = Mongo.Collection.getOrig(entryPointName);

		// Fallback to Meteor global if the collection is not found
		return original || Meteor[entryPointName];
	};
}
