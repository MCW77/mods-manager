// utils
import { defer } from "#/utils/defer";
import nothing from "#/utils/nothing";

// domain
import type { BaseCharacters } from "#/domain/BaseCharacter";
import type {
	CharacterTemplate,
	CharacterTemplates,
} from "#/domain/CharacterTemplates";
import type { OptimizerRun } from "#/domain/OptimizerRun";
import { PlayerProfile, type IFlatPlayerProfile } from "#/domain/PlayerProfile";
import type { SelectedCharacters } from "#/domain/SelectedCharacters";

type DBError = DOMException | null;

type DBErrorFunc = (err: DBError) => void;
const dbErrorFunc: DBErrorFunc = (err: DBError) => {};

type DBSuccessFunc = (db: Database) => void;
const dbSuccessFunc: DBSuccessFunc = (db: Database) => {};

type DBRequestSuccessFunc = (request: IDBRequest) => void;
const dbRequestSuccessFunc: DBRequestSuccessFunc = (request: IDBRequest) => {};

type DBTransactionSuccessFunc = (transaction: IDBTransaction) => void;
const dbtransactionSuccessFunc: DBTransactionSuccessFunc = (
	transaction: IDBTransaction,
) => {};

export interface IUserData {
	allyCode: string;
	version: string;
	profiles: IFlatPlayerProfile[];
	gameSettings: BaseCharacters;
	lastRuns: OptimizerRun[];
	characterTemplates: CharacterTemplates;
}

export class Database {
	database = defer();

	dbName = "ModsOptimizer";

	/**
	 * Generate a new Database instance
	 * @param onsuccess {function(Database)}
	 * @param onerror {function(error)}
	 */
	constructor(
		onsuccess: DBSuccessFunc = dbSuccessFunc,
		onerror: DBErrorFunc = dbErrorFunc,
	) {
		const openDbRequest = indexedDB.open(this.dbName, 2);

		openDbRequest.onerror = (event: Event): void => {
			if (event !== null && event.target instanceof IDBRequest) {
				this.database.reject(event.target.error);
				onerror(event.target.error);
			}
		};

		openDbRequest.onsuccess = (event: Event) => {
			if (event !== null && event.target instanceof IDBRequest) {
				const db = event.target.result;
				if (db instanceof IDBDatabase) {
					this.database.resolve(db);
				}

				event.target.result.onversionchange = (
					event: IDBVersionChangeEvent,
				) => {
					if (!event.newVersion) {
						db.close();
					}
				};

				onsuccess(this);
			}
		};

		openDbRequest.onupgradeneeded = (event) => {
			if (event !== null && event.target instanceof IDBRequest) {
				const db = event.target.result;

				if (event.oldVersion < 1) {
					// Create object stores for: game data about each character, player profiles, and the last run done by each
					// player
					db.createObjectStore("gameSettings", { keyPath: "baseID" });
					db.createObjectStore("profiles", { keyPath: "allyCode" });
					db.createObjectStore("lastRuns", { keyPath: "allyCode" });
				}
				if (event.oldVersion < 2) {
					db.createObjectStore("characterTemplates", { keyPath: "name" });
				}
			}
		};
	}

	/**
	 * Export all the data from the database, calling the callback with the result
	 * @param onsuccess {function(Object)}
	 * @param onerror {function(error)}
	 */
	export(
		onsuccess: (ud: IUserData) => void = nothing,
		onerror: DBErrorFunc = dbErrorFunc,
	) {
		this.database.then((db: IDBDatabase) => {
			const getDataRequest = db.transaction([
				"gameSettings",
				"profiles",
				"lastRuns",
				"characterTemplates",
			]);

			const userData: IUserData = {
				allyCode: "",
				version: "",
				profiles: [],
				gameSettings: [],
				lastRuns: [],
				characterTemplates: [],
			};

			getDataRequest.onerror = (event: Event) => {
				if (event !== null && event.target instanceof IDBRequest)
					onerror(event.target.error);
			};

			getDataRequest.oncomplete = () => {
				onsuccess(userData);
			};

			const profilesRequest = getDataRequest.objectStore("profiles").getAll();
			profilesRequest.onsuccess = (event: Event) => {
				userData.profiles = (event.target as IDBRequest).result;
			};

			const gameSettingsRequest = getDataRequest
				.objectStore("gameSettings")
				.getAll();
			gameSettingsRequest.onsuccess = (event: Event) => {
				userData.gameSettings = (event.target as IDBRequest).result;
			};

			const lastRunsRequest = getDataRequest.objectStore("lastRuns").getAll();
			lastRunsRequest.onsuccess = (event: Event) => {
				userData.lastRuns = (event.target as IDBRequest).result;
			};

			const characterTemplatesRequest = getDataRequest
				.objectStore("characterTemplates")
				.getAll();
			characterTemplatesRequest.onsuccess = (event: Event) => {
				userData.characterTemplates = (event.target as IDBRequest).result;
			};
		});
	}

	/**
	 * Delete everything from the database, and the database itself
	 * @param onsuccess {function()}
	 * @param onerror {function(error)}
	 */
	delete(onsuccess = nothing, onerror: DBErrorFunc = dbErrorFunc) {
		this.database.then(() => {
			const deleteDataRequest = indexedDB.deleteDatabase(this.dbName);

			deleteDataRequest.onerror = (event: Event) => {
				if (event !== null && event.target instanceof IDBRequest)
					onerror(event.target.error);
			};

			deleteDataRequest.onsuccess = () => {
				onsuccess();
			};
		});
	}

	/**
	 * Delete a profile from the database
	 * @param allyCode {string}
	 * @param onsuccess {function()}
	 * @param onerror {function(error)}
	 */
	deleteProfile(
		allyCode: string,
		onsuccess = nothing,
		onerror: DBErrorFunc = dbErrorFunc,
	) {
		this.database.then((db) => {
			const deleteProfileRequest = db
				.transaction("profiles", "readwrite")
				.objectStore("profiles")
				.delete(allyCode);

			deleteProfileRequest.onerror = (event: Event) => {
				if (event !== null && event.target instanceof IDBRequest)
					onerror(event.target.error);
			};

			deleteProfileRequest.onsuccess = () => {
				this.deleteLastRun(allyCode);
				onsuccess();
			};
		});
	}

	/**
	 * Delete an Optimizer Run from the database
	 * @param allyCode {string}
	 * @param onsuccess {function()}
	 * @param onerror {function(error)}
	 */
	deleteLastRun(
		allyCode: string,
		onsuccess = nothing,
		onerror: DBErrorFunc = dbErrorFunc,
	) {
		this.database.then((db) => {
			const deleteLastRunRequest = db
				.transaction("lastRuns", "readwrite")
				.objectStore("lastRuns")
				.delete(allyCode);

			deleteLastRunRequest.onerror = (event: Event) => {
				if (event !== null && event.target instanceof IDBRequest)
					onerror(event.target.error);
			};

			deleteLastRunRequest.onsuccess = (event) => {
				onsuccess();
			};
		});
	}

	deleteCharacterTemplate(
		name: string,
		onsuccess = nothing,
		onerror: DBErrorFunc = dbErrorFunc,
	) {
		this.database.then((db) => {
			const deleteTemplateRequest = db
				.transaction("characterTemplates", "readwrite")
				.objectStore("characterTemplates")
				.delete(name);

			deleteTemplateRequest.onerror = (event: Event) => {
				if (event !== null && event.target instanceof IDBRequest)
					onerror(event.target.error);
			};

			deleteTemplateRequest.onsuccess = (event) => {
				onsuccess();
			};
		});
	}

	/**
	 * Get all of the basecharacters from the database and return them as an object
	 * @param onsuccess {function(Array<BaseCharacter>)}
	 * @param onerror {function(error)}
	 */
	getBaseCharacters(
		onsuccess: (baseCharacters: BaseCharacters) => void = nothing,
		onerror: DBErrorFunc = dbErrorFunc,
	) {
		this.database.then((db) => {
			const getBaseCharactersRequest = db
				.transaction("gameSettings", "readwrite")
				.objectStore("gameSettings")
				.getAll();

			getBaseCharactersRequest.onerror = (event: Event) => {
				if (event !== null && event.target instanceof IDBRequest)
					onerror(event.target.error);
			};

			getBaseCharactersRequest.onsuccess = (event) => {
				const baseCharacters: BaseCharacters = (event.target as IDBRequest)
					.result as BaseCharacters;
				onsuccess(baseCharacters);
			};
		});
	}

	/**
	 * Get a single profile. If no allyCode is given, the first profile in the database will be returned.
	 * @param allyCode {string}
	 */
	async getProfile(allyCode: string) {
		const db = await this.database;

		if (allyCode !== "") {
			return new Promise(
				(
					successCallback: (profile: PlayerProfile) => void,
					errorCallback: (error: DOMException | null) => void,
				) => {
					const getProfileRequest =
						// Using a read/write transaction forces the database to finish loading profiles before reading from here
						db
							.transaction("profiles", "readwrite")
							.objectStore("profiles")
							.get(allyCode);

					getProfileRequest.onsuccess = (event) => {
						if (event !== null && event.target instanceof IDBRequest) {
							const profile = PlayerProfile.deserialize(event.target.result);
							successCallback(profile);
						}
					};

					getProfileRequest.onerror = (event: Event) => {
						if (event !== null && event.target instanceof IDBRequest)
							errorCallback(event.target.error);
					};
				},
			);
		}
		return new Promise(
			(
				successCallback: (profile: PlayerProfile) => void,
				errorCallback: (error: DOMException | null) => void,
			) => {
				const getProfileRequest = db
					.transaction("profiles", "readwrite")
					.objectStore("profiles")
					.openCursor();

				getProfileRequest.onsuccess = (event) => {
					if (event !== null && event.target instanceof IDBRequest) {
						const cursor = event.target.result;

						if (cursor) {
							const profile = PlayerProfile.deserialize(cursor.value);
							successCallback(profile);
						} else {
							successCallback(PlayerProfile.Default);
						}
					}
				};

				getProfileRequest.onerror = (event: Event) => {
					if (event !== null && event.target instanceof IDBRequest)
						errorCallback(event.target.error);
				};
			},
		);
	}

	/**
	 * Get all of the profiles from the database, where each entry is [baseID, playerName]
	 * @param onsuccess {function(Array<PlayerProfile>)}
	 * @param onerror {function(error)}
	 */
	getProfiles(
		onsuccess: ((a: PlayerProfile[]) => void) | typeof nothing = nothing,
		onerror: DBErrorFunc = dbErrorFunc,
	) {
		this.database.then((db) => {
			const profilesRequest =
				// Using a read/write transaction forces the database to finish loading profiles before reading from here
				db
					.transaction("profiles", "readwrite")
					.objectStore("profiles")
					.getAll();

			profilesRequest.onsuccess = (event) => {
				if (event !== null && event.target instanceof IDBRequest) {
					const profiles = event.target.result.map(
						(profile: IFlatPlayerProfile) => PlayerProfile.deserialize(profile),
					);
					onsuccess(profiles);
				}
			};

			profilesRequest.onerror = (event: Event) => {
				if (event !== null && event.target instanceof IDBRequest)
					onerror(event.target.error);
			};
		});
	}

	/**
	 * Retrieve a character template from the database by name
	 * @param name {string}
	 * @param onsuccess {function(Object)}
	 * @param onerror {function(error)}
	 */
	getCharacterTemplate(
		name: string,
		onsuccess: (template: CharacterTemplate) => void = nothing,
		onerror: DBErrorFunc = dbErrorFunc,
	) {
		this.database.then((db) => {
			const templateRequest = db
				.transaction("characterTemplates", "readwrite")
				.objectStore("characterTemplates")
				.get(name);

			templateRequest.onsuccess = (event) => {
				if (event !== null && event.target instanceof IDBRequest) {
					const template: CharacterTemplate = event.target.result;
					onsuccess(template);
				}
			};

			templateRequest.onerror = (event: Event) => {
				if (event !== null && event.target instanceof IDBRequest)
					onerror(event.target.error);
			};
		});
	}

	/**
	 * Get all of the saved character templates from the database
	 * @param onsuccess {function(CharacterTemplates)}
	 * @param onerror {function(error)}
	 */
	getCharacterTemplates(
		onsuccess: (charTemplates: CharacterTemplates) => void = nothing,
		onerror: DBErrorFunc = dbErrorFunc,
	) {
		this.database.then((db) => {
			const templatesRequest = db
				.transaction("characterTemplates", "readwrite")
				.objectStore("characterTemplates")
				.getAll();

			templatesRequest.onsuccess = (event) => {
				if (event !== null && event.target instanceof IDBRequest) {
					const templates: CharacterTemplates = event.target.result;
					onsuccess(templates);
				}
			};

			templatesRequest.onerror = (event: Event) => {
				if (event !== null && event.target instanceof IDBRequest)
					onerror(event.target.error);
			};
		});
	}

	/**
	 * Add or update a single profile in the database
	 * param profile {PlayerProfile}
	 * param onerror {function(error)}
	 */
	saveProfile(
		profile: PlayerProfile | IFlatPlayerProfile,
		onsuccess: () => void = nothing,
		onerror: DBErrorFunc = dbErrorFunc,
	) {
		this.database.then((db: IDBDatabase) => {
			const saveProfileTransaction = db.transaction(["profiles"], "readwrite");
			const saveProfileRequest = saveProfileTransaction
				.objectStore("profiles")
				.put(profile instanceof PlayerProfile ? profile.serialize() : profile);
			let requestError: DBError = null;

			saveProfileRequest.onsuccess = (event: Event) => {
				onsuccess();
			};

			saveProfileRequest.onerror = (event: Event) => {
				if (event !== null && event.target instanceof IDBRequest)
					requestError = event.target.error;
			};

			saveProfileTransaction.oncomplete = (event: Event) => {
				if (requestError) onerror(requestError);
			};

			saveProfileTransaction.onerror = (event: Event) => {
				if (event !== null && event.target instanceof IDBTransaction)
					onerror(event.target.error);
			};
		});
	}

	/**
	 * Add new profiles to the database, or update existing ones
	 * @param profiles {Array<PlayerProfile>}
	 * @param onsuccess {function(Array<string>)}
	 * @param onerror {function(error)}
	 */
	saveProfiles(
		profiles: PlayerProfile[],
		onsuccess: (keys: string[]) => void = nothing,
		onerror: DBErrorFunc = dbErrorFunc,
	) {
		this.database.then((db) => {
			const saveProfileRequest = db.transaction(["profiles"], "readwrite");
			const keys: string[] = [];

			saveProfileRequest.onerror = (event: Event) => {
				if (event !== null && event.target instanceof IDBRequest)
					onerror(event.target.error);
			};

			saveProfileRequest.oncomplete = (event) => {
				onsuccess(keys);
			};

			for (const profile of profiles) {
				const profileRequest = saveProfileRequest
					.objectStore("profiles")
					.put(
						"function" === typeof profile.serialize
							? profile.serialize()
							: profile,
					);

				profileRequest.onsuccess = (event) => {
					if (event !== null && event.target instanceof IDBRequest)
						keys.push(event.target.result);
				};
			}
		});
	}

	/**
	 * Add new gameSettings to the database, or update existing ones
	 * @param baseCharacters {Array<BaseCharacter>}
	 * @param onsuccess {function(Array<string>)}
	 * @param onerror {function(error)}
	 */
	saveBaseCharacters(
		baseCharacters: BaseCharacters,
		onsuccess: (keys: string[]) => void = nothing,
		onerror: DBErrorFunc = dbErrorFunc,
	) {
		this.database.then((db) => {
			const saveBaseCharactersRequest = db.transaction(
				["gameSettings"],
				"readwrite",
			);
			const keys: string[] = [];

			saveBaseCharactersRequest.onerror = (event: Event) => {
				if (event !== null && event.target instanceof IDBRequest)
					onerror(event.target.error);
			};

			saveBaseCharactersRequest.oncomplete = (event) => {
				onsuccess(keys);
			};

			for (const baseChar of baseCharacters) {
				const singleRequest = saveBaseCharactersRequest
					.objectStore("gameSettings")
					.put(baseChar);

				singleRequest.onsuccess = (event: Event) => {
					keys.push((event.target as IDBRequest).result);
				};
			}
		});
	}

	/**
	 * Save an optimizer run to the database, or update an existing one
	 * @param lastRun {OptimizerRun}
	 * @param onerror {function(error)}
	 */
	saveLastRun(lastRun: OptimizerRun, onerror: DBErrorFunc = dbErrorFunc) {
		this.database.then((db) => {
			const saveLastRunRequest = db
				.transaction(["lastRuns"], "readwrite")
				.objectStore("lastRuns")
				.put(lastRun);

			saveLastRunRequest.onerror = (event: Event) => {
				if (event !== null && event.target instanceof IDBRequest)
					onerror(event.target.error);
			};
		});
	}

	/**
	 * Save a group of last runs
	 * @param lastRuns {Array<OptimizerRun>}
	 * @param onerror {function(error)}
	 */
	saveLastRuns(lastRuns: OptimizerRun[], onerror: DBErrorFunc = dbErrorFunc) {
		this.database.then((db) => {
			const saveLastRunsRequest = db.transaction(["lastRuns"], "readwrite");

			saveLastRunsRequest.onerror = (event: Event) => {
				if (event !== null && event.target instanceof IDBRequest)
					onerror(event.target.error);
			};

			for (const lastRun of lastRuns) {
				const singleRequest = saveLastRunsRequest
					.objectStore("lastRuns")
					.put(lastRun);
			}
		});
	}

	saveCharacterTemplate(
		name: string,
		selectedCharacters: SelectedCharacters,
		onsuccess = nothing,
		onerror: DBErrorFunc = dbErrorFunc,
	) {
		this.database.then((db) => {
			const templateObject = {
				name: name,
				selectedCharacters: selectedCharacters.map(({ id, target }) => ({
					id: id,
					target: target,
				})),
			};

			const saveTemplateRequest = db
				.transaction(["characterTemplates"], "readwrite")
				.objectStore("characterTemplates")
				.put(templateObject);

			saveTemplateRequest.onerror = (event: Event) => {
				if (event !== null && event.target instanceof IDBRequest)
					onerror(event.target.error);
			};

			saveTemplateRequest.onsuccess = (event) => {
				if (event !== null && event.target instanceof IDBRequest) onsuccess();
			};
		});
	}

	saveCharacterTemplates(
		templates: CharacterTemplates,
		onsuccess = nothing,
		onerror: DBErrorFunc = dbErrorFunc,
	) {
		this.database.then((db) => {
			const saveTemplatesRequest = db.transaction(
				["characterTemplates"],
				"readwrite",
			);
			const keys: string[] = [];

			saveTemplatesRequest.onerror = (event: Event) => {
				if (event !== null && event.target instanceof IDBRequest)
					onerror(event.target.error);
			};

			saveTemplatesRequest.oncomplete = (event) => {
				onsuccess();
			};

			for (const template of templates) {
				const templateObject = {
					name: template.name,
					selectedCharacters: template.selectedCharacters.map(
						({ id, target }) => ({
							id: id,
							target: target,
						}),
					),
				};

				const singleRequest = saveTemplatesRequest
					.objectStore("characterTemplates")
					.put(templateObject);

				singleRequest.onsuccess = (event) => {
					if (event !== null && event.target instanceof IDBRequest)
						keys.push(event.target.result);
				};
			}
		});
	}
}

let instance: Database | null = null;

export default function getDatabase(
	onsuccess: DBSuccessFunc = dbSuccessFunc,
	onerror: DBErrorFunc = dbErrorFunc,
) {
	if (instance) {
		onsuccess(instance);
		return instance;
	}

	instance = new Database(onsuccess, onerror);
	return instance;
}
