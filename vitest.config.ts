import { defineConfig } from "vitest/config";

// biome-ignore lint/style/noDefaultExport: This is required for Vitest
export default defineConfig({
	test: {
		exclude: ["**/node_modules/**", "**/build/**", "**/dist/**", "tests/**"], // root "tests" folder is used for Meteor tests only so it's excluded from Vitest
	},
});
