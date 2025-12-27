import { describe, it, expect, beforeAll, vi } from "vitest";
import { loadFixture } from "./fixtures-loader";
import { convertBackup } from "../../modules/appState/domain/Backup";
import { latestDBVersion } from "../../utils/globalLegendPersistSettings";
import superjson from "superjson";
import { objectKeys } from "#/utils/objectKeys";

// We'll need to mock the modules since they have side effects
vi.mock("#/modules/profilesManagement/state/profilesManagement", () => ({
	profilesManagement$: {
		hasProfileWithAllycode: vi.fn(() => false),
		addProfile: vi.fn(),
		updateProfile: vi.fn(),
	},
}));

vi.mock("#/modules/compilations/state/compilations", () => ({
	compilations$: {
		compilationByIdByAllycode: { peek: vi.fn(() => new Map()) },
		defaultCompilation: { peek: vi.fn(() => null) },
	},
}));

vi.mock(
	"#/modules/incrementalOptimization/state/incrementalOptimization",
	() => ({
		incrementalOptimization$: {
			indicesByProfile: { peek: vi.fn(() => ({})) },
		},
	}),
);

vi.mock("#/modules/lockedStatus/state/lockedStatus", () => ({
	lockedStatus$: {
		persistedData: {
			lockedStatus: {
				lockedStatusByCharacterIdByAllycode: { peek: vi.fn(() => ({})) },
			},
		},
	},
}));

vi.mock("#/modules/modsView/state/modsView", () => ({
	modsView$: {
		toPersistable: vi.fn(() => ({})),
	},
}));

vi.mock("#/modules/optimizationSettings/state/optimizationSettings", () => ({
	optimizationSettings$: {
		settingsByProfile: { peek: vi.fn(() => ({})) },
	},
}));

vi.mock("#/modules/hotUtils/state/hotUtils", () => ({
	hotutils$: {
		sessionIdByProfile: { peek: vi.fn(() => ({})) },
	},
}));

vi.mock("#/modules/templates/state/templates", () => ({
	templates$: {
		userTemplatesByName: { peek: vi.fn(() => ({})) },
	},
}));

describe("App State Backup Migrations", () => {
	describe("Migration Chain", async () => {
		const backupV16 = await loadFixture(16, "backup").then((data) =>
			structuredClone(data),
		);
		const expectedFixture = await loadFixture(
			latestDBVersion,
			"backup",
			"fromV16",
		);
		let conversionResult: {
			backup:
				| (Record<string, unknown> & { data: Record<string, unknown> })
				| null;
			importError: {
				errorMessage: string;
				errorReason: string;
				errorSolution: string;
			};
		};
		beforeAll(async () => {
			conversionResult = convertBackup(backupV16);
		});

		it("should migrate from version 16 to latest without errors", async () => {
			expect(conversionResult.importError.errorMessage).toBe("");
			expect(conversionResult.backup).not.toBeNull();
			expect(conversionResult.backup?.version).toBe(latestDBVersion);
		});

		it.concurrent.each(
			objectKeys(expectedFixture.data as Record<string, unknown>),
		)("should migrate %s correctly", async (moduleName) => {
			const migratedData = conversionResult.backup?.data[moduleName];
			const expectedData = (expectedFixture.data as Record<string, unknown>)[
				moduleName
			];
			expect(superjson.stringify(migratedData)).toBe(
				superjson.stringify(expectedData),
			);
		});

		it("should handle missing migration gracefully", async () => {
			backupV16.version = 12; // Non-existent version

			const result = convertBackup(backupV16);
			// convertBackup should return null for invalid migrations instead of throwing
			expect(result.importError.errorMessage).not.toBe("");
			expect(result.importError.errorReason).toBe(
				"Couldn't validate any known backup version",
			);
		});
	});

	describe("Data Integrity", async () => {
		const backupV16 = await loadFixture(16, "backup").then((data) =>
			structuredClone(data),
		);
		backupV16.characterTemplates = null; // Corrupted data
		backupV16.profilesManagement = "invalid"; // Wrong type
		let didThrow = false;
		let result: {
			backup:
				| (Record<string, unknown> & { data: Record<string, unknown> })
				| null;
			importError: {
				errorMessage: string;
				errorReason: string;
				errorSolution: string;
			};
		} = {
			backup: null,
			importError: { errorMessage: "", errorReason: "", errorSolution: "" },
		};
		try {
			result = convertBackup(backupV16);
		} catch (_error) {
			didThrow = true;
		}

		it("should handle corrupted data gracefully", () => {
			// Should not throw, but handle gracefully
			expect(result.importError.errorMessage).toBe(
				"Import of mods-manager backup failed.",
			);
			expect(result.backup).toBeNull();
			expect(didThrow).toBe(false);
		});
	});

	describe("Schema Validation", async () => {
		const backupV18 = await loadFixture(18, "backup");
		it("should validate final migrated data against latest schema", async () => {
			const { validateAgainstLatestSchema } = await import("./migration-utils");

			const result = convertBackup(backupV18);

			// convertBackup should produce valid output that passes schema validation
			expect(result.backup).toBeDefined();
			if (result.backup) {
				const isValid = validateAgainstLatestSchema(result.backup);
				expect(isValid).toBe(true);
			}
		});

		it("should reject invalid final data", async () => {
			const { validateAgainstLatestSchema } = await import("./migration-utils");

			const invalidData = {
				appVersion: 123, // Should be string
				backupType: "invalid", // Should be "fullBackup" or other valid type
				client: "unknown", // Should be "mods-manager"
				data: null, // Should be object
				version: "invalid", // Should be number
			};

			const isValid = validateAgainstLatestSchema(invalidData);
			expect(isValid).toBe(false);
		});
	});
});
