import { defineConfig } from "vitest/config";
import path from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			"#": path.resolve(__dirname, "./src"),
			"#lib": path.resolve(__dirname, "./src/lib"),
			"#ui": path.resolve(__dirname, "./src/components/ui"),
			"use-sync-external-store/shim/index.js": "react",
		},
		conditions: ["import", "module", "browser", "default"],
		mainFields: ["module", "main"],
	},
	test: {
		environment: "happy-dom",
		environmentOptions: {
			happyDOM: {
				url: "http://localhost:3000",
			},
		},
		globals: true,
		setupFiles: ["./src/tests/migrations/setup.ts"],
		include: ["src/tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
		testTimeout: 30000, // Longer timeout for database operations
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "html"],
			exclude: [
				"node_modules/",
				"src/tests/",
				"dist/",
				"**/*.d.ts",
				"vite.config.ts",
				"vitest.config.ts",
				"vitest.migrations.config.ts",
			],
			include: [
				"src/utils/globalLegendPersistSettings.ts",
				"src/modules/appState/state/appState.ts",
				"src/modules/templates/state/templates.ts",
			],
		},
	},
});
