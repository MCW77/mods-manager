import { configureSynced } from "@legendapp/state/sync";
import { observablePersistIndexedDB } from "@legendapp/state/persist-plugins/indexeddb";
import type { Filter } from "#/modules/modsView/domain/ModsViewOptions";

// Entity type with id and other properties
type Entity = { id: string; [key: string]: unknown };

// For nested entities that need to be accessed with their id
type RecordWithNestedEntities = {
	id: string;
	[key: string]: Entity | string | unknown;
};

const storeNames = [
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
];
// For empty string id, upgradeFunction handles an array of records
function itemUpgrade(
	db: IDBDatabase,
	transaction: IDBTransaction,
	storeName: string,
	id: "",
	upgradeFunction: (oldData: Array<RecordWithNestedEntities>) => void,
): void;

// For non-empty string id, upgradeFunction handles a single record
function itemUpgrade(
	db: IDBDatabase,
	transaction: IDBTransaction,
	storeName: string,
	id: string,
	upgradeFunction: (oldData: Record<string, unknown>) => void,
): void;

// Implementation that works with both overloads - keeping original type
function itemUpgrade(
	db: IDBDatabase,
	transaction: IDBTransaction,
	storeName: string,
	id: string,
	upgradeFunction:
		| ((oldData: Array<RecordWithNestedEntities>) => void)
		| ((oldData: Record<string, unknown>) => void),
) {
	try {
		if (db.objectStoreNames.contains(storeName)) {
			const oldStore = transaction.objectStore(storeName);

			let request: IDBRequest;
			if (id === "") {
				request = oldStore.getAll();
			} else {
				request = oldStore.get(id);
			}

			request.onsuccess = (event: Event) => {
				const oldData = (event.target as IDBRequest).result;
				if (oldData) {
					const newData = upgradeFunction(oldData);

					// Delete and recreate the store in the current versionchange transaction
					db.deleteObjectStore(storeName);
					const newStore = db.createObjectStore(storeName, {
						keyPath: "id",
						autoIncrement: false,
					});

					// Add the data back
					newStore.put(newData);
				}
			};
			request.onerror = (event: Event) => {
				console.error(
					`Error reading data from old store: ${storeName}`,
					(event.target as IDBRequest).error,
				);
				transaction.abort();
			};
		}
	} catch (error) {
		console.error(`Error upgrading:${id} in ${storeName}`, error);
		transaction.abort();
	}
}

function upgradeFilterTo18(
	filter: Partial<Filter> & { secondariesscoretier?: unknown },
) {
	filter.assigned = { assigned: filter.assigned?.assigned ?? 0 };
	filter.calibration = {
		"15": 0,
		"25": 0,
		"40": 0,
		"75": 0,
		"100": 0,
		"150": 0,
	};
	filter.score = [0, 100];
	if (filter.secondariesscoretier !== undefined)
		Reflect.deleteProperty(filter, "secondariesscoretier");
	filter.speedRange = [0, 31];
}

function createStores(db: IDBDatabase) {
	for (const storeName of storeNames) {
		if (!db.objectStoreNames.contains(storeName)) {
			const store = db.createObjectStore(storeName, {
				keyPath: "id",
				autoIncrement: false,
			});
		}
	}
}

function upgradeTo18(db: IDBDatabase, transaction: IDBTransaction) {
	try {
		itemUpgrade(
			db,
			transaction,
			"CharactersManagement",
			"filterSetup",
			(oldfilterSetup) => {
				return {
					id: "filterSetup",
					filterSetup: {
						...oldfilterSetup,
					},
				};
			},
		);

		itemUpgrade(
			db,
			transaction,
			"Compilations",
			"compilationByIdByAllycode",
			(oldCompilations) => {
				return {
					id: "compilationByIdByAllycode",
					compilationByIdByAllycode: new Map(Object.entries(oldCompilations)),
				};
			},
		);

		itemUpgrade(
			db,
			transaction,
			"DefaultCompilation",
			"DefaultCompilation",
			(oldDefaultCompilation) => {
				return {
					id: "defaultCompilation",
					defaultCompilation: {
						...oldDefaultCompilation,
					},
				};
			},
		);

		itemUpgrade(
			db,
			transaction,
			"HotUtils",
			"sessionIdByProfile",
			(oldHotUtils) => {
				return {
					id: "sessionIdByProfile",
					sessionIdByProfile: {
						...oldHotUtils,
					},
				};
			},
		);

		itemUpgrade(
			db,
			transaction,
			"IncrementalOptimization",
			"indicesByProfile",
			(oldIndices) => {
				return {
					id: "indicesByProfile",
					indicesByProfile: {
						...oldIndices,
					},
				};
			},
		);

		itemUpgrade(
			db,
			transaction,
			"LockedStatus",
			"lockedStatus",
			(oldLockedStatus) => {
				return {
					id: "lockedStatus",
					lockedStatusByCharacterIdByAllycode: {
						...oldLockedStatus,
					},
				};
			},
		);

		itemUpgrade(
			db,
			transaction,
			"OptimizationSettings",
			"settingsByProfile",
			(oldOptimizationSettings) => {
				return {
					id: "settingsByProfile",
					settingsByProfile: {
						...oldOptimizationSettings,
					},
				};
			},
		);

		itemUpgrade(db, transaction, "Profiles", "profiles", (oldProfiles) => {
			return {
				id: "profiles",
				profiles: {
					activeAllycode: oldProfiles.activeAllycode,
					lastUpdatedByAllycode: oldProfiles.lastUpdatedByAllycode,
					playernameByAllycode: oldProfiles.playernameByAllycode,
					profileByAllycode: oldProfiles.profileByAllycode,
				},
			};
		});

		itemUpgrade(db, transaction, "ViewSetup", "", (oldViewSetup) => {
			return {
				id: "viewSetup",
				byIdByCategory: oldViewSetup.reduce(
					(acc: Record<string, unknown>, item) => {
						acc[item.id] = Object.entries(item).reduce(
							(acc2, [key, value]) => {
								if (key !== "id") {
									for (const filter of Object.values(
										(value as { filterById: Record<string, Partial<Filter>> })
											.filterById,
									)) {
										upgradeFilterTo18(filter);
									}
									acc2[key] = value;
								}
								return acc2;
							},
							{} as Record<string, unknown>,
						);
						return acc;
					},
					{},
				),
			};
		});
	} catch (error) {
		console.error("Error in upgradeTo18:", error);
		transaction.abort();
	}
}

const persistOptions = configureSynced({
	persist: {
		plugin: observablePersistIndexedDB({
			databaseName: "GIMO",
			version: 18,
			tableNames: storeNames,
			onUpgradeNeeded: (event) => {
				const request = event.target as IDBOpenDBRequest;
				const db = request.result as IDBDatabase;
				const transaction = request.transaction;
				if (event.oldVersion === 0) {
					createStores(db);
				}
				if (
					event.oldVersion === 16 &&
					event.newVersion === 18 &&
					transaction !== null
				)
					upgradeTo18(db, transaction);
			},
		}),
	},
});

export { persistOptions };
