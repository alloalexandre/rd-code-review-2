#!/usr/bin/env node

import fs from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = dirname(__filename);

// Regex patterns for parsing
const PUBLIC_SCHEMA_REGEX =
	/const PublicSettingsSchema = z\.object\(\{([\s\S]*?)\}\);/;
const PRIVATE_SCHEMA_REGEX =
	/const PrivateSettingsSchema = z\.object\(\{([\s\S]*?)\}\);/;
const MONTI_SCHEMA_REGEX =
	/const MontiSettingsSchema = z[\s\S]*?\.object\(\{([\s\S]*?)\}\)/;
const DESC_MATCH_REGEX = /\.describe\(\s*["'](.*?)["']\s*\)/;
const DEFAULT_MATCH_REGEX = /\.default\(\s*(.*?)\s*\)/;
const FIELD_MATCH_REGEX = /^(\w+):\s*z\./;
const OBJECT_MATCH_REGEX = /object\(\{([^}]+)\}\)/;
const NAME_MATCH_REGEX = /^(\w+):/;

function parseSchemaContent(): {
	public: ReturnType<typeof extractFields>;
	private: ReturnType<typeof extractFields>;
	monti: ReturnType<typeof extractFields>;
} {
	const schemaPath = join(__dirname, "../settings.schema.mjs");
	const content = fs.readFileSync(schemaPath, "utf8");

	return {
		public: extractFields(content.match(PUBLIC_SCHEMA_REGEX)?.[1] || ""),
		private: extractFields(content.match(PRIVATE_SCHEMA_REGEX)?.[1] || ""),
		monti: extractFields(content.match(MONTI_SCHEMA_REGEX)?.[1] || ""),
	};
}

function extractFields(content: string): ReturnType<typeof processField>[] {
	const fields: ReturnType<typeof processField>[] = [];
	const lines = content.split("\n").filter((line) => line.trim());

	let currentField: string | null = null;
	let currentContent = "";

	for (const line of lines) {
		const trimmed = line.trim();

		// Check if this line starts a new field
		const fieldMatch = trimmed.match(FIELD_MATCH_REGEX);
		if (fieldMatch) {
			// Process previous field if exists
			if (currentField) {
				fields.push(processField(currentField, currentContent));
			}

			// Start new field
			currentField = fieldMatch[1];
			currentContent = trimmed;
		} else if (currentField && trimmed) {
			// Continue current field
			currentContent += ` ${trimmed}`;
		}
	}

	// Process the last field
	if (currentField) {
		fields.push(processField(currentField, currentContent));
	}

	return fields;
}

function processField(
	name: string,
	content: string,
): {
	name: string;
	type: string;
	description: string;
	default: string | null;
	optional: boolean;
	nested: ReturnType<typeof extractNestedFields>;
} {
	const field = {
		name,
		type: getType(content),
		description: getDescription(content),
		default: getDefault(content),
		optional: content.includes(".optional()"),
		nested: [],
	};

	// Handle nested objects
	if (content.includes("object({")) {
		field.nested = extractNestedFields(content);
	}

	return field;
}

function extractNestedFields(
	content: string,
): ReturnType<typeof processField>[] {
	const nested: ReturnType<typeof processField>[] = [];
	const objectMatch = content.match(OBJECT_MATCH_REGEX);

	if (objectMatch) {
		const objectContent = objectMatch[1];
		const fieldMatches = objectContent.match(
			/(\w+):\s*z\.[\w().'"]*(?:\.describe\([^)]+\))?(?:\.default\([^)]+\))?,?/g,
		);

		if (fieldMatches) {
			for (const match of fieldMatches) {
				const nameMatch = match.match(NAME_MATCH_REGEX);
				if (nameMatch) {
					nested.push(processField(nameMatch[1], match));
				}
			}
		}
	}

	return nested;
}

function getType(content: string): string {
	if (content.includes("string()")) return "string";
	if (content.includes("number()")) return "number";
	if (content.includes("boolean()")) return "boolean";
	if (content.includes("object(")) return "object";
	return "unknown";
}

function getDescription(content: string): string {
	const match = content.match(DESC_MATCH_REGEX);
	return match ? match[1] : "";
}

function getDefault(content: string): string | null {
	const match = content.match(DEFAULT_MATCH_REGEX);
	if (!match) return null;

	const value = match[1];
	if (value.startsWith('"') || value.startsWith("'")) {
		return value.slice(1, -1);
	}
	if (value.includes("DEFAULT_STALE_SESSION_INACTIVITY_TIMEOUT")) {
		return "3600000 (1 hour in milliseconds)";
	}
	return value;
}

function getPrefix(section: string): string {
	if (section === "public") return "public";
	if (section === "private") return "private";
	return "monti";
}

function generateFieldSection(
	field: ReturnType<typeof processField>,
	section: string,
	level: number = 3,
): string {
	const prefix = getPrefix(section);
	const fieldPath = `${prefix}.${field.name}`;
	const required = field.optional ? "Optional" : "Required";
	const defaultVal =
		field.default || (field.optional ? "None" : "Must be provided");
	const desc = field.description || "No description available";
	const headingPrefix = "#".repeat(level);

	let content = `${headingPrefix} \`${fieldPath}\`

**Type:** \`${field.type}\`  
**Required:** ${required}  
**Default:** \`${defaultVal}\`  

${desc}

`;

	// Add nested fields
	for (const nested of field.nested) {
		content += generateNestedFieldSection(nested, `${fieldPath}`, level + 1);
	}

	return content;
}

function generateNestedFieldSection(
	field: ReturnType<typeof processField>,
	parentPath: string,
	level: number = 4,
): string {
	const nestedPath = `${parentPath}.${field.name}`;
	const required = field.optional ? "Optional" : "Required";
	const defaultVal =
		field.default || (field.optional ? "None" : "Must be provided");
	const desc = field.description || "No description available";
	const headingPrefix = "#".repeat(level);

	let content = `${headingPrefix} \`${nestedPath}\`

**Type:** \`${field.type}\`  
**Required:** ${required}  
**Default:** \`${defaultVal}\`  

${desc}

`;

	const nestedFields = Array.isArray(field.nested[0])
		? field.nested.flat()
		: field.nested;

	// Handle deeply nested fields
	for (const nested of nestedFields) {
		content += generateNestedFieldSection(nested, nestedPath, level + 1);
	}

	return content;
}

function generateFieldSections(
	fields: ReturnType<typeof processField>[],
	section: string,
): string {
	let content = "";

	for (const field of fields) {
		content += generateFieldSection(field, section);
	}

	return content;
}

function generateMarkdown(schemas: {
	public: ReturnType<typeof extractFields>;
	private: ReturnType<typeof extractFields>;
	monti: ReturnType<typeof extractFields>;
}): string {
	// Get current date in YYYY-MM-DD format
	const date = new Date().toISOString().split("T")[0];

	const publicFields = schemas.public;
	const privateFields = schemas.private;
	const montiFields = schemas.monti;

	return `# Settings Documentation

This document describes all available settings for the application. Settings are organized into different sections based on their scope and usage.

## Table of Contents

- [Public Settings](#public-settings)
- [Private Settings](#private-settings)
- [Monti Settings](#monti-settings)

## Public Settings

These settings are available on both client and server sides.

${generateFieldSections(publicFields, "public")}

## Private Settings

These settings are only available on the server side and contain sensitive information.

${generateFieldSections(privateFields, "private")}

## Monti Settings

These settings configure the Monti monitoring service (optional).

${generateFieldSections(montiFields, "monti")}

## Usage Example

\`\`\`json
{
  "public": {
	"appName": "My App",
	"debug": false,
	"production": true
  },
  "private": {
	"superAdminPassword": "secure-password",
	"mails": {
	  "enabled": true,
	  "sendEmailsFrom": "noreply@myapp.com"
	}
  },
  "monti": {
	"appId": "your-monti-app-id",
	"appSecret": "your-monti-app-secret"
  }
}
\`\`\`

## Notes

- All settings marked as "Required" must be provided in your settings.json file
- Optional settings will use their default values if not specified
- Private settings should never be committed to version control
- Use environment variables or secure configuration management for sensitive values

*This documentation is auto-generated from the Zod schema. Last updated: ${date}*
`;
}

function main(): void {
	try {
		console.log("Analyzing Zod schema...");
		const schemas = parseSchemaContent();

		console.log("Generating markdown documentation...");
		const markdown = generateMarkdown(schemas);

		const outputPath = join(__dirname, "../SETTINGS.md");
		fs.writeFileSync(outputPath, markdown);

		console.log(`Documentation generated: ${outputPath}`);
		console.log(
			`Found ${schemas.public.length} public, ${schemas.private.length} private, ${schemas.monti.length} monti settings`,
		);
	} catch (error) {
		console.error("Error:", error.message);
		process.exit(1);
	}
}

main();
