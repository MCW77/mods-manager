// utils
import * as v from "valibot";

// state
import { latestDBVersion } from "#/utils/globalLegendPersistSettings";

// domain
import { fromGIMOCharacterTemplates } from "../mappers/GIMOCharacterTemplatesMapper";
import { CharacterTemplatesSchema as GIMOCharacterTemplatesSchema } from "#/domain/schemas/gimo/CharacterTemplatesSchemas";
import {
	CharacterTemplatesSchemaV18,
	CharacterTemplatesSchemaV19,
	LatestCharacterTemplatesSchema,
} from "#/domain/schemas/mods-manager";

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
	characterTemplates: unknown;
	client: "mods-manager" | "gimo";
	version: number;
}

const migrations = new Map<number, (data: unknown) => Backup>([]);

function runMigrations(data: NormalizedBackup) {
	let currentData = data;
	if (currentData.version > latestDBVersion) {
		return null;
	} // For template backups, we don't need to run database migrations
	// Just update the version to latest since the structure conversion
	// already happened during normalization
	// Note: For character templates, the latest version is 18, not the general latestDBVersion (19)
	if (currentData.backupType === "characterTemplates") {
		return {
			...currentData,
			client: "mods-manager" as const, // Convert any client to mods-manager after processing
			version: 18,
		};
	}

	while (currentData.version < latestDBVersion) {
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
	const v19ParseResult = v.safeParse(CharacterTemplatesSchemaV19, parsedJSON);

	if (gimoParseResult.success) {
		templates = normalizeTemplatesJSON({
			appVersion: "",
			client: "gimo",
			templates: fromGIMOCharacterTemplates(gimoParseResult.output),
			version: 0,
		});
	} else if (v18ParseResult.success) {
		templates = normalizeTemplatesJSON({
			appVersion: "",
			client: "mods-manager",
			templates: v18ParseResult.output,
			version: 18,
		});
	} else if (v19ParseResult.success) {
		templates = {
			appVersion: "",
			backupType: "characterTemplates",
			characterTemplates: v19ParseResult.output,
			client: "mods-manager",
			version: 19,
		};
	}
	if (templates === null) {
		// Collect all validation errors for debugging
		const errorDetails = {
			gimo: gimoParseResult.success
				? "valid"
				: v.flatten(gimoParseResult.issues),
			v18: v18ParseResult.success ? "valid" : v.flatten(v18ParseResult.issues),
			v19: v19ParseResult.success ? "valid" : v.flatten(v19ParseResult.issues),
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

export { convertTemplates, type NormalizedBackup };
