// utils
import * as v from "valibot";

// state
import {
	testOnlyCreateStores,
	testOnlyStoreNames,
	testOnlyUpgradeTo18,
	testOnlyUpgradeTo19,
	testOnlyUpgradeTo20,
	testOnlyUpgradeTo21,
} from "../../utils/globalLegendPersistSettings";

// domain
import { LatestModsManagerBackupSchema } from "../../domain/schemas/mods-manager/ModsManagerSchemas";

// Define store data interface for IndexedDB operations
interface StoreData {
	id: string;
	[key: string]: unknown;
}

const storeNamesByVersion: Map<number, string[]> = new Map([
	[16, testOnlyStoreNames || []],
	[18, testOnlyStoreNames || []],
	[19, testOnlyStoreNames || []],
	[20, testOnlyStoreNames || []],
	[21, testOnlyStoreNames || []],
]);

/**
 * Validates migrated data against the latest schema
 */
export function validateAgainstLatestSchema(data: unknown): boolean {
	try {
		const validation = v.safeParse(LatestModsManagerBackupSchema, data);
		return validation.success;
	} catch (_error) {
		return false;
	}
}

/**
 * Creates an old database with specified version and fixtures
 */
export async function createOldDatabase(
	dbName: string,
	version: number,
	fixtures: Record<string, StoreData[]>,
): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(dbName, version);

		request.onerror = () => reject(request.error);

		request.onupgradeneeded = (event) => {
			const request = event.target as IDBOpenDBRequest;
			const db = request.result as IDBDatabase;
			const transaction = request.transaction as IDBTransaction;

			if (!testOnlyCreateStores) {
				reject(new Error("testOnlyCreateStores function is not defined"));
				return;
			}
			testOnlyCreateStores(db, storeNamesByVersion.get(version) || []);

			for (const storeName of Object.keys(fixtures)) {
				if (db.objectStoreNames.contains(storeName)) {
					const store = transaction.objectStore(storeName);

					// Add fixture data
					const data = fixtures[storeName];
					if (Array.isArray(data)) {
						for (const item of data) {
							store.add(item);
						}
					}
				}
			}
		};

		request.onsuccess = () => resolve(request.result);
	});
}

/**
 * Opens database and triggers migration from oldVersion to newVersion
 */
export async function openDatabaseWithMigration(
	dbName: string,
	oldVersion: number,
	newVersion: number,
): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(dbName, newVersion);

		request.onerror = () => reject(request.error);

		request.onupgradeneeded = async () => {
			const db = request.result;
			const transaction = request.transaction;

			if (!transaction) {
				reject(new Error("No transaction available"));
				return;
			}

			// Simulate the actual upgrade logic from globalLegendPersistSettings
			if (oldVersion === 16 && newVersion >= 18) {
				if (testOnlyUpgradeTo18) {
					await testOnlyUpgradeTo18(db, transaction);
				}
			}

			if (oldVersion <= 18 && newVersion >= 19) {
				if (testOnlyUpgradeTo19) {
					await testOnlyUpgradeTo19(db, transaction);
				}
			}

			if (oldVersion <= 19 && newVersion >= 20) {
				if (testOnlyUpgradeTo20) {
					await testOnlyUpgradeTo20(db, transaction);
				}
			}

			if (oldVersion <= 20 && newVersion >= 21) {
				if (testOnlyUpgradeTo21) {
					await testOnlyUpgradeTo21(db, transaction);
				}
			}
		};

		request.onsuccess = () => resolve(request.result);
	});
}

/**
 * Gets data from a store
 */
export async function getFromStore(
	db: IDBDatabase,
	storeName: string,
	key?: string,
): Promise<unknown> {
	return new Promise((resolve, reject) => {
		const transaction = db.transaction([storeName], "readonly");
		const store = transaction.objectStore(storeName);

		const request = key ? store.get(key) : store.getAll();

		request.onerror = () => reject(request.error);
		request.onsuccess = () => resolve(request.result);
	});
}
