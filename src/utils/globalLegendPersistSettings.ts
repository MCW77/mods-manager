import { configureSynced } from "@legendapp/state/sync";
import { observablePersistIndexedDB } from "@legendapp/state/persist-plugins/indexeddb";

const persistOptions = configureSynced({
	persist: {
		plugin: observablePersistIndexedDB({
			databaseName: "GIMO",
			version: 16,
			tableNames: [
				"OptimizationSettings",
				"IncrementalOptimization",
				"Profiles",
				"CharactersManagement",
				"HotUtils",
				"About",
				"Templates",
				"TemplatesAddingMode",
				"ViewSetup",
				"Characters",
				"LockedStatus",
				"Compilations",
				"DefaultCompilation",
			],
		}),
	},
});

export { persistOptions };
