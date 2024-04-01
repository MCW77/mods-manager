import { configureObservablePersistence } from "@legendapp/state/persist";
import { ObservablePersistIndexedDB } from "@legendapp/state/persist-plugins/indexeddb";

configureObservablePersistence({
	pluginLocal: ObservablePersistIndexedDB,
	localOptions: {
		indexedDB: {
			databaseName: "GIMO",
			version: 1,
			tableNames: ["OptimizationSettings", "IncrementalOptimization"],
		},
	},
});
