// utils
import * as v from "valibot";

// domain
import {
	CharacterTemplatesSchema as GIMOCharacterTemplatesSchema,
	CharacterTemplatesOutputSchema,
} from "#/domain/schemas/gimo/CharacterTemplatesSchemas";
import {
	CharacterTemplatesSchemaV18,
	CharacterTemplatesBackupSchemaV26,
	LatestCharacterTemplatesSchema,
	type CharacterTemplatesBackupSchemaV18Output,
} from "#/domain/schemas/mods-manager/index";
import type { CharacterTemplates } from "./CharacterTemplates";
import type { PrimaryStatRestrictions } from "#/domain/OptimizationPlan";
import { fromGIMOTargetStats } from "../mappers/GIMOTargetStatsMapper";
import { fromGIMOSetRestrictions } from "../mappers/GIMOSetRestrictionsMapper";

interface NormalizedBackup {
	appVersion: string;
	backupType: "characterTemplates";
	characterTemplates: unknown;
	client: "mods-manager" | "gimo";
	version: number;
}

interface Backup {
	appVersion: string;
	backupType: "characterTemplates";
	characterTemplates: CharacterTemplates;
	client: "mods-manager" | "gimo";
	version: number;
}
type MigrationFn = (normalizedBackup: NormalizedBackup) => NormalizedBackup;

const newTemplatesDBVersions = [0, 18, 26] as const;
type NewTemplatesDBVersions = (typeof newTemplatesDBVersions)[number];
const latestTemplatesDBVersion: NewTemplatesDBVersions =
	newTemplatesDBVersions[newTemplatesDBVersions.length - 1];

const migrationsRecord: Record<NewTemplatesDBVersions, MigrationFn> = {
	0: (normalizedBackup) => {
		// Migrate GIMO backup to mods-manager v18 structure
		const gimoParseResult = v.safeParse(
			CharacterTemplatesOutputSchema,
			normalizedBackup.characterTemplates,
		);

		if (!gimoParseResult.success) {
			throw new Error(
				"Failed to parse GIMO character templates during migration to v18.",
			);
		}
		const convertedTemplates = gimoParseResult.output.map((template) => {
			return {
				id: template.name,
				category: "",
				selectedCharacters: template.selectedCharacters.map(
					(selectedCharacter) => {
						return {
							id: selectedCharacter.id,
							target: {
								id: selectedCharacter.target.name,
								description: "",
								primaryStatRestrictions:
									selectedCharacter.target.primaryStatRestrictions,
								setRestrictions: fromGIMOSetRestrictions(
									selectedCharacter.target.setRestrictions,
								),
								targetStats: fromGIMOTargetStats(
									selectedCharacter.target.targetStats,
								),
								useOnlyFullSets: selectedCharacter.target.useOnlyFullSets,
								minimumModDots: 5,
								Health: selectedCharacter.target.health,
								Protection: selectedCharacter.target.protection,
								Speed: selectedCharacter.target.speed,
								"Critical Damage %": selectedCharacter.target.critDmg,
								"Potency %": selectedCharacter.target.potency,
								"Tenacity %": selectedCharacter.target.tenacity,
								"Physical Damage": selectedCharacter.target.physDmg,
								"Special Damage": selectedCharacter.target.specDmg,
								"Critical Chance": selectedCharacter.target.critChance,
								Armor: selectedCharacter.target.armor,
								Resistance: selectedCharacter.target.resistance,
								"Accuracy %": selectedCharacter.target.accuracy,
								"Critical Avoidance %": selectedCharacter.target.critAvoid,
							},
						};
					},
				),
			};
		});

		return {
			appVersion: normalizedBackup.appVersion,
			backupType: "characterTemplates",
			client: "mods-manager",
			characterTemplates: convertedTemplates,
			version: 18,
		};
	},
	18: (normalizedBackup) => {
		// Migrate v18 to v26: Convert primaryStatRestrictions to arrays

		const oldTemplates =
			normalizedBackup.characterTemplates as CharacterTemplatesBackupSchemaV18Output;
		const newData: CharacterTemplates = oldTemplates.map((template) => {
			const newSelectedCharacters = template.selectedCharacters.map(
				(selectedCharacter) => {
					const oldPrimaryStatRestrictions =
						selectedCharacter.target.primaryStatRestrictions;
					const newPrimaryStatRestrictions: PrimaryStatRestrictions = {
						...(oldPrimaryStatRestrictions.arrow !== undefined
							? { arrow: [oldPrimaryStatRestrictions.arrow] }
							: {}),
						...(oldPrimaryStatRestrictions.circle !== undefined
							? { circle: [oldPrimaryStatRestrictions.circle] }
							: {}),
						...(oldPrimaryStatRestrictions.cross !== undefined
							? { cross: [oldPrimaryStatRestrictions.cross] }
							: {}),
						...(oldPrimaryStatRestrictions.triangle !== undefined
							? { triangle: [oldPrimaryStatRestrictions.triangle] }
							: {}),
					};
					return {
						id: selectedCharacter.id,
						target: {
							...selectedCharacter.target,
							primaryStatRestrictions: newPrimaryStatRestrictions,
						},
					};
				},
			);

			return {
				id: template.id,
				category: template.category,
				selectedCharacters: newSelectedCharacters,
			};
		});

		return {
			appVersion: normalizedBackup.appVersion,
			backupType: "characterTemplates",
			client: "mods-manager",
			characterTemplates: newData,
			version: 26,
		};
	},
	26: (normalizedBackup) => {
		return {
			appVersion: normalizedBackup.appVersion,
			backupType: "characterTemplates",
			client: "mods-manager",
			characterTemplates: normalizedBackup.characterTemplates,
			version: 27,
		};
	},
};

const migrations = new Map(
	Object.entries(migrationsRecord).map(([k, v]) => [Number(k), v]),
);

function runMigrations(data: NormalizedBackup) {
	let currentData = data;
	if (currentData.version > latestTemplatesDBVersion) {
		return null;
	}

	while (currentData.version < latestTemplatesDBVersion) {
		const migrate = migrations.get(currentData.version);
		if (!migrate) {
			return null;
		}
		currentData = migrate(currentData);
	}

	return currentData;
}

const convertTemplates = (parsedJSON: unknown) => {
	let templates = null as NormalizedBackup | null;

	// Try all validations and store results for error reporting
	const gimoParseResult = v.safeParse(GIMOCharacterTemplatesSchema, parsedJSON);
	const v18ParseResult = v.safeParse(CharacterTemplatesSchemaV18, parsedJSON);
	const v26ParseResult = v.safeParse(
		CharacterTemplatesBackupSchemaV26,
		parsedJSON,
	);

	if (gimoParseResult.success) {
		templates = normalizeTemplatesJSON({
			appVersion: "",
			client: "gimo",
			templates: gimoParseResult.output,
			version: 0,
		});
	} else if (v18ParseResult.success) {
		templates = normalizeTemplatesJSON({
			appVersion: "",
			client: "mods-manager",
			templates: v18ParseResult.output,
			version: 18,
		});
	} else if (v26ParseResult.success) {
		templates = v26ParseResult.output;
	}
	if (templates === null) {
		// Collect all validation errors for debugging
		const errorDetails = {
			gimo: gimoParseResult.success
				? "valid"
				: v.flatten(gimoParseResult.issues),
			v18: v18ParseResult.success ? "valid" : v.flatten(v18ParseResult.issues),
			v26: v26ParseResult.success ? "valid" : v.flatten(v26ParseResult.issues),
		};
		console.log(
			"All template validations failed. Error details:",
			errorDetails,
		);

		return {
			backup: null,
			importError: {
				errorMessage: "Import of character templates failed.",
				errorReason: "Couldn't validate a character templates backup",
				errorSolution:
					"Please check you selected a valid file. If so let me know about the error on discord",
				validationErrors: errorDetails,
			},
		};
	}
	templates = runMigrations(templates);
	if (templates === null) {
		return {
			backup: null,
			importError: {
				errorMessage: "Import of character templates failed.",
				errorReason: "Migration of the backup failed",
				errorSolution: "Please report on discord!",
				validationErrors: { migration: "Migration process failed" },
			},
		};
	}

	const finalSchemaResult = v.safeParse(
		LatestCharacterTemplatesSchema,
		templates,
	);
	if (!finalSchemaResult.success) {
		const finalValidationErrors = v.flatten(finalSchemaResult.issues);

		return {
			backup: null,
			importError: {
				errorMessage: "Import of character templates failed.",
				errorReason: `Validation of the final migrated data failed:
      ${finalSchemaResult.issues.map((issue) => issue.message)}`,
				errorSolution: "Please report on discord!",
				validationErrors: finalValidationErrors,
			},
		};
	}
	return {
		backup: finalSchemaResult.output,
		importError: {
			errorMessage: "",
			errorReason: "",
			errorSolution: "",
			validationErrors: undefined,
		},
	};
};

const normalizeTemplatesJSON = (parameters: {
	appVersion: string;
	client: "mods-manager" | "gimo";
	templates: unknown;
	version: number;
}) => {
	const normalizedData: NormalizedBackup = {
		appVersion: parameters.appVersion,
		characterTemplates: parameters.templates,
		client: parameters.client,
		backupType: "characterTemplates",
		version: parameters.version,
	};
	return normalizedData;
};

export {
	type Backup,
	convertTemplates,
	latestTemplatesDBVersion,
	type NewTemplatesDBVersions,
};
