// utils
import { objectEntries } from "./objectEntries";
import { objectKeys } from "./objectKeys";

// state
import { configureSynced } from "@legendapp/state/sync";
import { observablePersistIndexedDB } from "@legendapp/state/persist-plugins/indexeddb";

// domain
import type {
	Filter,
	SecondarySettings,
} from "#/modules/modsView/domain/ModsViewOptions";
import type { CharacterNames } from "#/constants/CharacterNames";
import type { GIMOFlatMod } from "#/domain/types/ModTypes";

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
): Promise<void>;

// For non-empty string id, upgradeFunction handles a single record
function itemUpgrade(
	db: IDBDatabase,
	transaction: IDBTransaction,
	storeName: string,
	id: string,
	upgradeFunction: (oldData: Record<string, unknown>) => void,
): Promise<void>;

// Implementation that works with both overloads - keeping original type
function itemUpgrade(
	db: IDBDatabase,
	transaction: IDBTransaction,
	storeName: string,
	id: string,
	upgradeFunction:
		| ((oldData: Array<RecordWithNestedEntities>) => void)
		| ((oldData: Record<string, unknown>) => void),
): Promise<void> {
	return new Promise((resolve, reject) => {
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
					try {
						const oldData = (event.target as IDBRequest).result;
						if (oldData && (!Array.isArray(oldData) || oldData.length > 0)) {
							const newData = upgradeFunction(oldData);

							// Delete and recreate the store in the current versionchange transaction
							db.deleteObjectStore(storeName);
							const newStore = db.createObjectStore(storeName, {
								keyPath: "id",
								autoIncrement: false,
							});

							// Add the data back
							const putRequest = newStore.put(newData);
							putRequest.onsuccess = () => resolve();
							putRequest.onerror = (putEvent: Event) => {
								console.error(
									`Error putting data to new store: ${storeName}`,
									(putEvent.target as IDBRequest).error,
								);
								reject((putEvent.target as IDBRequest).error);
							};
						} else {
							resolve();
						}
					} catch (error) {
						console.error(
							`Error processing data for ${storeName}:${id}`,
							error,
						);
						reject(error);
					}
				};
				request.onerror = (event: Event) => {
					const error = (event.target as IDBRequest).error;
					console.error(
						`Error reading data from old store: ${storeName}`,
						error,
					);
					reject(error);
				};
			} else {
				resolve();
			}
		} catch (error) {
			console.error(`Error upgrading:${id} in ${storeName}`, error);
			reject(error);
		}
	});
}

function upgradeFilterTo18(
	filter: Partial<Filter> & { secondariesscoretier?: unknown },
) {
	if (filter === undefined) return;
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

function upgradeFilterTo19(
	filter:
		| Partial<Filter>
		| (Omit<Partial<Filter>, "secondary"> & {
				secondary: Record<keyof SecondarySettings, number>;
		  }),
) {
	if (filter === undefined) return;
	// Convert TriState secondary values to roll ranges
	if (filter.secondary) {
		const newSecondary: SecondarySettings = {
			"Critical Chance %": [0, 5],
			Defense: [0, 5],
			"Defense %": [0, 5],
			Health: [0, 5],
			"Health %": [0, 5],
			Offense: [0, 5],
			"Offense %": [0, 5],
			"Potency %": [0, 5],
			Protection: [0, 5],
			"Protection %": [0, 5],
			Speed: [0, 5],
			"Tenacity %": [0, 5],
		};
		for (const [statType, triStateValue] of objectEntries(filter.secondary)) {
			// Map TriState to roll ranges: 0 → [0,5], -1 → [0,0], 1 → [1,5]
			switch (triStateValue) {
				case -1:
					newSecondary[statType] = [0, 0]; // Cannot be present
					break;
				case 1:
					newSecondary[statType] = [1, 5]; // Must be present
					break;
				default:
					newSecondary[statType] = [0, 5]; // Any mod (default)
					break;
			}
		}
		filter.secondary = newSecondary;
	}
}

function upgradeCompilationTo20(compilation: Record<string, unknown>) {
	const newCompilation: Record<string, unknown> = {};
	for (const [key, value] of objectEntries(compilation).sort(([keyA], [keyB]) =>
		keyA.localeCompare(keyB),
	)) {
		if (key === "hasSelectionChanged") {
		} else if (key === "id") {
			newCompilation[key] = value;
			newCompilation.isReoptimizationNeeded = true;
		} else if (key === "optimizationConditions") {
			newCompilation[key] =
				(value as Record<string, unknown> | null)?.globalSettings ?? null;
			newCompilation.reoptimizationIndex = -1;
		} else {
			newCompilation[key] = value;
		}
	}
	return newCompilation;
}

function getLockedStatusUpgradedTo20(
	lockedStatus: Record<string, boolean> | Set<CharacterNames>,
) {
	const newLockedStatus: Set<CharacterNames> = new Set<CharacterNames>();
	for (const characterId of objectKeys(lockedStatus)) {
		if (lockedStatus[characterId] === true) {
			newLockedStatus.add(characterId);
		}
	}
	return newLockedStatus;
}

function upgradeLockedStatusTo20(
	lockedStatus: Record<string, Record<string, boolean> | Set<CharacterNames>>,
) {
	const newLockedStatus: Record<string, Set<CharacterNames>> = {};
	for (const [allycode, lockedStatusOfCharacterId] of objectEntries(
		lockedStatus,
	)) {
		newLockedStatus[allycode] = getLockedStatusUpgradedTo20(
			lockedStatusOfCharacterId,
		);
	}
	return newLockedStatus;
}

function upgradeProfilesTo21(profiles: Record<string, unknown>) {
	if (
		Object.hasOwn(profiles, "profileByAllycode") &&
		typeof profiles.profileByAllycode === "object" &&
		profiles.profileByAllycode !== null
	) {
		for (const profile of Object.values(profiles.profileByAllycode)) {
			if (
				typeof profile === "object" &&
				profile !== null &&
				Object.hasOwn(profile, "modById")
			) {
				const newModById: Map<string, GIMOFlatMod> = new Map();
				for (const mod of Object.values(
					profile.modById as Record<string, GIMOFlatMod>,
				)) {
					mod.speedRemainder = 0;
					newModById.set(mod.mod_uid, mod);
				}
				profile.modById = newModById;
			}
		}
	}
	return profiles;
}

function createStores(db: IDBDatabase, stores: string[] = storeNames) {
	for (const storeName of stores) {
		if (!db.objectStoreNames.contains(storeName)) {
			db.createObjectStore(storeName, {
				keyPath: "id",
				autoIncrement: false,
			});
		}
	}
}

const hasFilterById = (
	obj: object,
): obj is { filterById: Record<string, Partial<Filter> | undefined> } => {
	return Object.hasOwn(obj, "filterById");
};

async function upgradeTo18(db: IDBDatabase, transaction: IDBTransaction) {
	try {
		await itemUpgrade(
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

		await itemUpgrade(
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

		await itemUpgrade(
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

		await itemUpgrade(
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

		await itemUpgrade(
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

		await itemUpgrade(
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

		await itemUpgrade(
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

		await itemUpgrade(
			db,
			transaction,
			"Profiles",
			"profiles",
			(oldProfiles) => {
				return {
					id: "profiles",
					profiles: {
						activeAllycode: oldProfiles.activeAllycode,
						lastUpdatedByAllycode: oldProfiles.lastUpdatedByAllycode,
						playernameByAllycode: oldProfiles.playernameByAllycode,
						profileByAllycode: oldProfiles.profileByAllycode,
					},
				};
			},
		);

		await itemUpgrade(db, transaction, "ViewSetup", "", (oldViewSetup) => {
			return {
				id: "viewSetup",
				byIdByCategory: oldViewSetup.reduce(
					(acc: Record<string, unknown>, item) => {
						acc[item.id] = Object.entries(item).reduce(
							(acc2, [key, value]) => {
								if (key !== "id" && value !== undefined && value !== null) {
									if (hasFilterById(value)) {
										for (const filter of Object.values(
											(value as { filterById: Record<string, Partial<Filter>> })
												.filterById,
										)) {
											upgradeFilterTo18(filter);
										}
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

async function upgradeTo19(db: IDBDatabase, transaction: IDBTransaction) {
	try {
		await itemUpgrade(
			db,
			transaction,
			"CharactersManagement",
			"filterSetup",
			(oldCharactersManagement) => {
				const newCharactersManagement: Record<string, unknown> = {};
				for (const [key, value] of objectEntries(
					oldCharactersManagement.filterSetup as Record<string, unknown>,
				)) {
					if (key !== "id") newCharactersManagement[key] = value;
				}
				return {
					id: "filterSetup",
					filterSetup: {
						...newCharactersManagement,
					},
				};
			},
		);

		await itemUpgrade(
			db,
			transaction,
			"Compilations",
			"compilationByIdByAllycode",
			(oldCompilations) => {
				const newCompilations: Map<string, unknown> = new Map();
				for (const [
					key,
					value,
				] of oldCompilations.compilationByIdByAllycode as Map<
					string,
					unknown
				>) {
					if (key !== "id") newCompilations.set(key, value);
				}
				return {
					id: "compilationByIdByAllycode",
					compilationByIdByAllycode: newCompilations,
				};
			},
		);

		/*
		await itemUpgrade(
			db,
			transaction,
			"DefaultCompilation",
			"defaultCompilation",
			(oldDefaultCompilation) => {
				const newDefaultCompilation: Record<string, unknown> = {};
				for (const [key, value] of objectEntries(
					oldDefaultCompilation.defaultCompilation as Record<string, unknown>,
				)) {
					if (key !== "id") newDefaultCompilation[key] = value;
				}
				return {
					id: "defaultCompilation",
					defaultCompilation: {
						...newDefaultCompilation,
					},
				};
			},
		);
		*/

		await itemUpgrade(
			db,
			transaction,
			"HotUtils",
			"sessionIdByProfile",
			(oldHotUtils) => {
				const newHotUtils: Record<string, unknown> = {};
				for (const [allycode, sessionId] of objectEntries(
					oldHotUtils.sessionIdByProfile as Record<string, unknown>,
				)) {
					if (allycode !== "id") newHotUtils[allycode] = sessionId;
				}
				return {
					id: "sessionIdByProfile",
					sessionIdByProfile: {
						...newHotUtils,
					},
				};
			},
		);

		await itemUpgrade(
			db,
			transaction,
			"IncrementalOptimization",
			"indicesByProfile",
			(oldIndices) => {
				const newIndices: Record<string, number> = {};
				for (const [allycode, index] of objectEntries(
					oldIndices.indicesByProfile as Record<string, unknown>,
				)) {
					if (allycode !== "id") newIndices[allycode] = index as number;
				}
				return {
					id: "indicesByProfile",
					indicesByProfile: {
						...newIndices,
					},
				};
			},
		);

		await itemUpgrade(
			db,
			transaction,
			"LockedStatus",
			"lockedStatus",
			(oldLockedStatus) => {
				const newLockedStatus: Record<string, unknown> = {};
				for (const [allycode, status] of objectEntries(
					oldLockedStatus.lockedStatusByCharacterIdByAllycode as Record<
						string,
						unknown
					>,
				)) {
					if (allycode !== "id") newLockedStatus[allycode] = status;
				}
				return {
					id: "lockedStatus",
					lockedStatusByCharacterIdByAllycode: {
						...newLockedStatus,
					},
				};
			},
		);

		await itemUpgrade(
			db,
			transaction,
			"OptimizationSettings",
			"settingsByProfile",
			(oldOptimizationSettings) => {
				const newSettings: Record<string, unknown> = {};
				for (const [allycode, settings] of objectEntries(
					oldOptimizationSettings.settingsByProfile as Record<string, unknown>,
				)) {
					if (allycode !== "id") newSettings[allycode] = settings;
				}
				return {
					id: "settingsByProfile",
					settingsByProfile: {
						...newSettings,
					},
				};
			},
		);

		await itemUpgrade(db, transaction, "ViewSetup", "", (oldViewSetup) => {
			if (
				oldViewSetup.length > 0 &&
				Object.hasOwn(oldViewSetup[0], "byIdByCategory") &&
				typeof oldViewSetup[0].byIdByCategory === "object" &&
				oldViewSetup[0].byIdByCategory !== null
			) {
				return {
					id: "viewSetup",
					byIdByCategory: objectEntries(oldViewSetup[0].byIdByCategory).reduce(
						(acc: Record<string, unknown>, item) => {
							acc[item[0]] = Object.entries(item[1]).reduce(
								(acc2, [key, value]) => {
									if (key !== "id" && value !== undefined && value !== null) {
										if (hasFilterById(value)) {
											for (const [filterId, filter] of objectEntries(
												value.filterById,
											)) {
												if (filter === undefined)
													Reflect.deleteProperty(value.filterById, filterId);
												else {
													upgradeFilterTo18(filter);
													upgradeFilterTo19(filter);
												}
											}
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
			}

			return {
				id: "viewSetup",
				byIdByCategory: {},
			};
		});
	} catch (error) {
		console.error("Error in upgradeTo19:", error);
		transaction.abort();
	}
}

async function upgradeTo20(db: IDBDatabase, transaction: IDBTransaction) {
	try {
		await itemUpgrade(
			db,
			transaction,
			"Compilations",
			"compilationByIdByAllycode",
			(oldCompilations) => {
				const newCompilationsByAllycode: Map<
					string,
					Map<string, Record<string, unknown>>
				> = new Map();
				for (const [
					allycode,
					compilations,
				] of oldCompilations.compilationByIdByAllycode as Map<
					string,
					Map<string, Record<string, unknown>>
				>) {
					const newCompilations: Map<
						string,
						Record<string, unknown>
					> = new Map();
					for (const [compilationId, compilation] of compilations) {
						const newCompilation = upgradeCompilationTo20(compilation);
						newCompilations.set(compilationId, newCompilation);
					}
					newCompilationsByAllycode.set(allycode, newCompilations);
				}
				return {
					id: "compilationByIdByAllycode",
					compilationByIdByAllycode: newCompilationsByAllycode,
				};
			},
		);

		await itemUpgrade(
			db,
			transaction,
			"DefaultCompilation",
			"defaultCompilation",
			(oldDefaultCompilation) => {
				const newDefaultCompilation = upgradeCompilationTo20(
					oldDefaultCompilation.defaultCompilation as Record<string, unknown>,
				);
				return {
					id: "defaultCompilation",
					defaultCompilation: {
						...newDefaultCompilation,
					},
				};
			},
		);

		await itemUpgrade(
			db,
			transaction,
			"LockedStatus",
			"lockedStatus",
			(oldLockedStatus) => {
				const newLockedStatus = upgradeLockedStatusTo20(
					oldLockedStatus.lockedStatusByCharacterIdByAllycode as Record<
						string,
						Record<string, boolean>
					>,
				);
				return {
					id: "lockedStatus",
					lockedCharactersByAllycode: {
						...newLockedStatus,
					},
				};
			},
		);
	} catch (error) {
		console.error("Error in upgradeTo20:", error);
		transaction.abort();
	}
}

async function upgradeTo21(db: IDBDatabase, transaction: IDBTransaction) {
	try {
		await itemUpgrade(
			db,
			transaction,
			"HotUtils",
			"sessionIdByProfile",
			(oldHotUtils) => {
				const newHotUtils: Map<
					string,
					{ gimoSessionId: string; huSessionId: string }
				> = new Map();
				for (const [allycode, sessionId] of objectEntries(
					oldHotUtils.sessionIdByProfile as Record<string, string>,
				)) {
					newHotUtils.set(allycode, {
						gimoSessionId: sessionId,
						huSessionId: "",
					});
				}
				return {
					id: "sessionIDsByProfile",
					sessionIDsByProfile: newHotUtils,
				};
			},
		);

		await itemUpgrade(
			db,
			transaction,
			"Profiles",
			"profiles",
			(oldProfiles) => {
				const newProfiles = upgradeProfilesTo21(
					oldProfiles.profiles as Record<string, unknown>,
				);
				return {
					id: "profiles",
					profiles: newProfiles,
				};
			},
		);
	} catch (error) {
		console.error("Error in upgradeTo21:", error);
		transaction.abort();
	}
}

const dbVersions = [16, 18, 19, 20, 21] as const;
type DBVersions = (typeof dbVersions)[number];
const latestDBVersion = dbVersions[dbVersions.length - 1];

const persistOptions = configureSynced({
	persist: {
		plugin: observablePersistIndexedDB({
			databaseName: "GIMO",
			version: latestDBVersion,
			tableNames: storeNames,
			onUpgradeNeeded: async (event) => {
				const request = event.target as IDBOpenDBRequest;
				const db = request.result as IDBDatabase;
				const transaction = request.transaction;
				if (event.oldVersion === 0) {
					createStores(db);
				}
				if (transaction !== null) {
					if (event.oldVersion < 18) await upgradeTo18(db, transaction);
					if (event.oldVersion < 19) await upgradeTo19(db, transaction);
					if (event.oldVersion < 20) await upgradeTo20(db, transaction);
					if (event.oldVersion < 21) await upgradeTo21(db, transaction);
				}
			},
		}),
	},
});

const testing =
	typeof process !== "undefined" && process.env.NODE_ENV === "test";

const testOnlyCreateStores = testing ? createStores : undefined;
const testOnlyStoreNames = testing ? storeNames : undefined;
const testOnlyUpgradeTo18 = testing ? upgradeTo18 : undefined;
const testOnlyUpgradeTo19 = testing ? upgradeTo19 : undefined;
const testOnlyUpgradeTo20 = testing ? upgradeTo20 : undefined;
const testOnlyUpgradeTo21 = testing ? upgradeTo21 : undefined;

export {
	type DBVersions,
	latestDBVersion,
	persistOptions,
	upgradeFilterTo19,
	upgradeCompilationTo20,
	upgradeLockedStatusTo20,
	upgradeProfilesTo21,
	testOnlyCreateStores,
	testOnlyStoreNames,
	testOnlyUpgradeTo18,
	testOnlyUpgradeTo19,
	testOnlyUpgradeTo20,
	testOnlyUpgradeTo21,
};
