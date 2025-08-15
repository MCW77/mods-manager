import { describe, it, expect, beforeAll } from "vitest";
import { loadFixture } from "./fixtures-loader";
import superjson from "superjson";
import {
	createOldDatabase,
	openDatabaseWithMigration,
	getFromStore,
} from "./migration-utils";
import { latestDBVersion } from "../../src/utils/globalLegendPersistSettings";

const migrateData = async (
	dbName: string,
	oldDBVersion: number,
	newDBVersion: number,
) => {
	const oldDb = await createOldDatabase(
		dbName,
		oldDBVersion,
		(await loadFixture(oldDBVersion, "db")) as unknown as Record<
			string,
			Array<{ id: string; [key: string]: unknown }>
		>,
	);
	oldDb.close();

	const result: Record<string, unknown> = {};
	const newDb = await openDatabaseWithMigration(
		dbName,
		oldDBVersion,
		newDBVersion,
	);
	for (const storeName of newDb.objectStoreNames) {
		const data = await getFromStore(newDb, storeName);
		result[storeName] = data;
	}
	newDb.close();
	return result;
};

describe("Database Migrations", () => {
	describe("Version 16 to 18 Migration", async () => {
		const dbName = "test-mods-manager-migration-16to18";
		const oldDBVersion = 16;
		const newDBVersion = 18;
		let stores: Record<string, unknown>;
		const expectedFixture: Record<string, unknown> = await loadFixture(
			newDBVersion,
			"db",
		);

		beforeAll(async () => {
			stores = await migrateData(dbName, oldDBVersion, newDBVersion);
		});

		it.concurrent.each(Object.keys(expectedFixture))(
			"should migrate %s correctly",
			async (storeName) => {
				const migratedData = stores[storeName];
				const expectedData = expectedFixture[storeName];
				expect(superjson.stringify(migratedData)).toBe(
					superjson.stringify(expectedData),
				);
			},
		);
	});

	describe("Version 18 to 19 Migration", async () => {
		const dbName = "test-mods-manager-migration-18to19";
		const oldDBVersion = 18;
		const newDBVersion = 19;
		let stores: Record<string, unknown>;
		const expectedFixture: Record<string, unknown> = await loadFixture(
			newDBVersion,
			"db",
		);

		beforeAll(async () => {
			stores = await migrateData(dbName, oldDBVersion, newDBVersion);
		});

		it.concurrent.each(Object.keys(expectedFixture))(
			"should migrate %s correctly",
			async (storeName) => {
				const migratedData = stores[storeName];
				const expectedData = expectedFixture[storeName];
				expect(superjson.stringify(migratedData)).toBe(
					superjson.stringify(expectedData),
				);
			},
		);
	});

	describe("Full Migration Chain", async () => {
		const dbName = "test-mods-manager-migration-16toLatest";
		const oldDBVersion = 16;
		const newDBVersion = latestDBVersion;
		let stores: Record<string, unknown> = {};
		const expectedFixture = await loadFixture(newDBVersion, "db");

		beforeAll(async () => {
			stores = await migrateData(dbName, oldDBVersion, newDBVersion);
		});

		it.concurrent.each(Object.keys(expectedFixture))(
			"should migrate %s correctly",
			async (storeName) => {
				const migratedData = stores[storeName];
				const expectedData = expectedFixture[storeName];
				expect(superjson.stringify(migratedData)).toBe(
					superjson.stringify(expectedData),
				);
			},
		);
	});
});
