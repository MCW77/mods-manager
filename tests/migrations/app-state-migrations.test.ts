import { describe, it, expect, beforeAll, vi } from "vitest";
import { loadFixture } from "./fixtures-loader";
import { convertBackup } from "../../src/modules/appState/domain/Backup";

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
	let backupV16: Record<string, unknown>;

	beforeAll(async () => {
		backupV16 = await loadFixture(16, "backup");
	});

	describe("Migration Chain", () => {
		it("should migrate v16 backup through full chain", async () => {
			const result = convertBackup(backupV16);

			expect(result).toBeDefined();
			expect(result.backup.version).toBe(19); // Latest version
			expect(result.backup.appVersion).toBeDefined();
			expect(result.backup.backupType).toBe("fullBackup");
			expect(result.backup.client).toBe("mods-manager");
			expect(result.backup.data).toBeDefined();
		});

		it("should handle missing migration gracefully", async () => {
			const invalidBackup = {
				...backupV16,
				version: 12, // Non-existent version
			};

			const result = convertBackup(invalidBackup);
			// convertBackup should return null for invalid migrations instead of throwing
			expect(result.importError.errorMessage).not.toBe("");
			expect(result.importError.errorReason).toBe(
				"Couldn't validate any known backup version",
			);
		});
	});

	describe("Data Integrity", () => {
		it("should preserve essential data through migrations", async () => {
			const backupWithData = {
				...backupV16,
				characterTemplates: { DARTHREVAN: { id: "DARTHREVAN", name: "Test" } },
				profilesManagement: {
					activeAllycode: "123456789",
					profileByAllycode: {
						"123456789": {
							allycode: "123456789",
							playerName: "TestPlayer",
							modById: {},
							characterById: {},
						},
					},
				},
			};

			const result = convertBackup(backupWithData);

			expect(result.backup).toBeDefined();
			if (result.backup) {
				// Type assertion to access data properties
				const resultData = result.backup.data as Record<string, unknown>;
				expect(resultData.characterTemplates).toEqual(
					backupWithData.characterTemplates,
				);
				expect(resultData.profilesManagement).toBeDefined();
			}
		});

		it("should handle corrupted data gracefully", async () => {
			const corruptedBackup = {
				...backupV16,
				characterTemplates: null, // Corrupted data
				profilesManagement: "invalid", // Wrong type
			};

			// Should not throw, but handle gracefully
			const result = convertBackup(corruptedBackup);
			expect(result.backup).toBeDefined();
		});
	});

	describe("Schema Validation", () => {
		it("should validate final migrated data against latest schema", async () => {
			const { validateAgainstLatestSchema } = await import("./migration-utils");

			const result = convertBackup(backupV16);

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
