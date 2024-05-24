import { configureObservableSync } from "@legendapp/state/sync";
import { ObservablePersistIndexedDB } from "@legendapp/state/persist-plugins/indexeddb";

configureObservableSync({
	persist: {
		plugin: ObservablePersistIndexedDB,
		indexedDB: {
			databaseName: "GIMO",
			version: 6,
			tableNames: [
				"OptimizationSettings",
				"IncrementalOptimization",
				"Profiles",
				"CharactersManagement",
				"HotUtils",
				"About",
				"ProfilesUpdates",
			],
		},
	},
});
