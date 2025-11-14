import { describe, it, expect, beforeAll } from "vitest";
import { loadFixture } from "./fixtures-loader.js";
import { convertTemplates } from "../../modules/templates/domain/Backup.js";

describe("Template Migrations", () => {
	let templatesV0: unknown;
	let templatesV18: unknown;

	beforeAll(async () => {
		templatesV0 = await loadFixture(0, "templates");
		templatesV18 = await loadFixture(18, "templates");
	});

	describe("GIMO to ModsManager Format", () => {
		it("should convert GIMO template format", async () => {
			const result = convertTemplates(templatesV0);

			expect(result).toBeDefined();

			if (result.importError.errorMessage !== "") {
				// Fail with detailed error information
				throw new Error(
					`Import failed: ${result.importError.errorMessage}. Validation errors: ${JSON.stringify(result.importError.validationErrors, null, 2)}`,
				);
			}

			expect(result.importError.errorMessage).toBe("");
			expect(result.backup).toBeDefined();

			if (result.backup) {
				expect(result.backup.characterTemplates).toBeDefined();
				expect(Array.isArray(result.backup.characterTemplates)).toBe(true);

				const templates = result.backup.characterTemplates;

				expect(templates[0].id).toBe("Darth Revan Test"); // GIMO name becomes id
			}
		});

		it("should handle empty GIMO templates", async () => {
			const result = convertTemplates([]);

			expect(result).toBeDefined();
			expect(result.backup).toBeDefined();
			if (result.backup) {
				expect(result.backup.characterTemplates).toEqual([]);
			}
		});

		it("should preserve selectedCharacters structure", async () => {
			const result = convertTemplates(templatesV0);

			expect(result).toBeDefined();
			expect(result.backup).toBeDefined();

			if (result.backup) {
				const templates = result.backup.characterTemplates;

				expect(templates[0].selectedCharacters).toBeDefined();
				expect(templates[0].selectedCharacters[0].id).toBe("DARTHREVAN");
				expect(templates[0].selectedCharacters[0].target).toBeDefined();
			}
		});
	});
	describe("Template Version Migrations", () => {
		it("should migrate from version 0 to latest", async () => {
			const result = convertTemplates(templatesV0);

			expect(result).toBeDefined();
			expect(result.backup).toBeDefined();
			expect(result.importError.errorMessage).toBe("");

			if (result.backup) {
				expect(result.backup.version).toBeGreaterThanOrEqual(18); // Latest template version
				expect(result.backup.characterTemplates).toBeDefined();
			}
		});
		it("should handle already-migrated templates", async () => {
			const result = convertTemplates(templatesV18);

			expect(result).toBeDefined();
			expect(result.backup).toBeDefined();
			expect(result.importError.errorMessage).toBe("");

			if (result.backup) {
				expect(result.backup.characterTemplates).toEqual(templatesV18);
			}
		});

		it("should validate final template structure", async () => {
			const result = convertTemplates(templatesV0);

			expect(result).toBeDefined();
			expect(result.backup).toBeDefined();
			expect(result.importError.errorMessage).toBe("");

			// If the backup is created successfully, it means validation passed
			if (result.backup) {
				expect(result.backup.characterTemplates).toBeDefined();
				expect(Array.isArray(result.backup.characterTemplates)).toBe(true);
			}
		});
	});
	describe("Template Data Integrity", () => {
		it("should preserve all template properties through migration", async () => {
			const input = [
				{
					name: "Test Character Template", // GIMO uses 'name' field
					selectedCharacters: [
						{
							id: "TESTCHARACTER",
							target: {
								name: "Custom Target",
								health: 0,
								protection: 0,
								speed: 100,
								critDmg: 0,
								potency: 0,
								tenacity: 0,
								physDmg: 0,
								specDmg: 0,
								critChance: 0,
								armor: 0,
								resistance: 0,
								accuracy: 0,
								critAvoid: 0,
								targetStats: [
									{
										stat: "Speed", // Must be capitalized for GIMO schema
										type: "+",
										minimum: 200,
										maximum: 999,
										relativeCharacterId: null, // Must be actual null, not string "null"
										optimizeForTarget: true,
									},
								],
								upgradeMods: true,
								primaryStatRestrictions: {},
								setRestrictions: {},
								useOnlyFullSets: false,
							},
						},
					],
				},
			];
			const result = convertTemplates(input);

			expect(result).toBeDefined();
			expect(result.backup).toBeDefined();
			expect(result.importError.errorMessage).toBe("");

			if (result.backup) {
				const templates = result.backup.characterTemplates;
				const template = templates[0];
				expect(template.id).toBe("Test Character Template"); // GIMO name becomes id
				expect(template.selectedCharacters).toBeDefined();
				expect(template.selectedCharacters[0].target.targetStats).toBeDefined();
				expect(template.selectedCharacters[0].target.targetStats.length).toBe(
					1,
				);
			}
		});

		it("should handle malformed template data", async () => {
			const malformedInput = [
				{ id: "VALID", name: "Valid Template" },
				{ /* missing id */ name: "Invalid Template" },
				null, // Invalid entry
				{ id: "PARTIAL" }, // Missing name
			];

			const result = convertTemplates(malformedInput);

			// The production function should handle malformed data gracefully
			// It should either succeed with filtered data or return an import error
			expect(result).toBeDefined();

			if (result.backup) {
				// If successful, templates should be filtered/cleaned
				expect(result.backup.characterTemplates).toBeDefined();
			} else {
				// If failed, should have a meaningful error message
				expect(result.importError.errorMessage).toBeTruthy();
			}
		});
	});
});
