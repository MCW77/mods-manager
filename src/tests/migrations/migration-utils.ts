// utils
import * as v from "valibot";

// state
import {
	type DBVersions,
	testOnly,
} from "../../utils/globalLegendPersistSettings";

// domain
import { LatestModsManagerBackupSchema } from "../../domain/schemas/mods-manager/ModsManagerSchemas";

// Define store data interface for IndexedDB operations
interface StoreData {
	id: string;
	[key: string]: unknown;
}

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
	version: DBVersions,
	fixtures: Record<string, StoreData[]>,
): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(dbName, version);

		request.onerror = () => reject(request.error);

		request.onupgradeneeded = (event) => {
			const request = event.target as IDBOpenDBRequest;
			const db = request.result as IDBDatabase;
			const transaction = request.transaction as IDBTransaction;

			if (!testOnly?.createStores) {
				reject(new Error("testOnlyCreateStores function is not defined"));
				return;
			}
			testOnly.createStores(db, version);

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

function getUpgradeFunctionForVersion(version: DBVersions) {
	return testOnly?.dbUpgrades.get(version);
}

/**
 * Opens database and triggers migration from oldVersion to newVersion
 */
export async function openDatabaseWithMigration(
	dbName: string,
	oldVersion: DBVersions,
	newVersion: DBVersions,
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

			if (oldVersion === 16 && newVersion >= 18) {
				// Simulate the actual upgrade logic from globalLegendPersistSettings
				const upgradeFunction = getUpgradeFunctionForVersion(18);
				if (upgradeFunction) {
					await upgradeFunction(db, transaction);
				}
			}

			if (testOnly !== undefined) {
				for (
					let dbVersionsIndex = 2;
					dbVersionsIndex <= testOnly.dbVersions.length - 1;
					dbVersionsIndex++
				) {
					const currentVersion = testOnly.dbVersions[dbVersionsIndex];
					if (
						oldVersion <= currentVersion - 1 &&
						newVersion >= currentVersion
					) {
						const upgradeFunction =
							getUpgradeFunctionForVersion(currentVersion);
						if (upgradeFunction) {
							await upgradeFunction(db, transaction);
						}
					}
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
