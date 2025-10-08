import SimpleSchema from "meteor/aldeed:simple-schema";
import { schemaTools } from "meteor/suprakit:ui";

/**
 * Returns a new schema with the audit fields (createdAt, createdBy, createdByName, updatedAt, updatedBy, updatedByName)
 * automatically added.
 */
export function generateCollectionSchema(
	schema: Record<string, unknown>,
): SimpleSchema {
	return new SimpleSchema({
		...schema,
		createdAt: schemaTools.createdAt(),
		createdBy: schemaTools.createdBy(),
		createdByName: schemaTools.createdByName(),
		updatedAt: schemaTools.updatedAt(),
		updatedBy: schemaTools.updatedBy(),
		updatedByName: schemaTools.updatedByName(),
	});
}
