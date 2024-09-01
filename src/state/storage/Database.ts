// utils
import { defer } from "#/utils/defer";
import nothing from "#/utils/nothing";

// domain
import type {	CharacterTemplates } from "#/modules/templates/domain/CharacterTemplates";
import type { OptimizerRun } from "#/domain/OptimizerRun";
import { PlayerProfile, type IFlatPlayerProfile } from "#/domain/PlayerProfile";

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
	allycode: string;
	version: string;
	profiles: IFlatPlayerProfile[];
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
					db.createObjectStore("profiles", { keyPath: "allycode" });
					db.createObjectStore("lastRuns", { keyPath: "allycode" });
				}
				if (event.oldVersion < 2) {
					db.createObjectStore("characterTemplates", { keyPath: "id" });
				}
			}
		};
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
	 * Delete an Optimizer Run from the database
	 * @param allycode {string}
	 * @param onsuccess {function()}
	 * @param onerror {function(error)}
	 */
	deleteLastRun(
		allycode: string,
		onsuccess = nothing,
		onerror: DBErrorFunc = dbErrorFunc,
	) {
		this.database.then((db) => {
			const deleteLastRunRequest = db
				.transaction("lastRuns", "readwrite")
				.objectStore("lastRuns")
				.delete(allycode);

			deleteLastRunRequest.onerror = (event: Event) => {
				if (event !== null && event.target instanceof IDBRequest)
					onerror(event.target.error);
			};

			deleteLastRunRequest.onsuccess = (event) => {
				onsuccess();
			};
		});
	}

	/**
	 * Delete a profile from the database
	 * @param allycode {string}
	 * @param onsuccess {function()}
	 * @param onerror {function(error)}
	 */
	deleteProfile(
		allycode: string,
		onsuccess = nothing,
		onerror: DBErrorFunc = dbErrorFunc,
	) {
		this.database.then((db) => {
			const deleteProfileRequest = db
				.transaction("profiles", "readwrite")
				.objectStore("profiles")
				.delete(allycode);

			deleteProfileRequest.onerror = (event: Event) => {
				if (event !== null && event.target instanceof IDBRequest)
					onerror(event.target.error);
			};

			deleteProfileRequest.onsuccess = () => {
				this.deleteLastRun(allycode);
				onsuccess();
			};
		});
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
				"profiles",
				"lastRuns",
				"characterTemplates",
			]);

			const userData: IUserData = {
				allycode: "",
				version: "",
				profiles: [],
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
	 * Get a single profile. If no allycode is given, the first profile in the database will be returned.
	 * @param allycode {string}
	 */
	async getProfile(allycode: string) {
		const db = await this.database;

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
						.get(allycode);

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
