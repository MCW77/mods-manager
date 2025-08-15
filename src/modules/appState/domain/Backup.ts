// utils
import * as v from "valibot";
import { objectEntries } from "#/utils/objectEntries";

// domain
import type { Compilation } from "#/modules/compilations/domain/Compilation";
import type { IndicesByProfile } from "#/modules/incrementalOptimization/domain/IncrementalOptimizationObservable";
import type { LockedStatusByCharacterIdByAllycode } from "#/modules/lockedStatus/domain/LockedStatusByCharacterId";
import type { PersistableModsViewSetupByIdByCategory } from "#/modules/modsView/domain/ModsViewOptions";
import type { SettingsByProfile } from "#/modules/optimizationSettings/domain/OptimizationSettingsObservable";
import type { PersistedProfiles } from "#/modules/profilesManagement/domain/Profiles";
import type { CharacterTemplatesByName } from "#/modules/templates/domain/CharacterTemplates";

import {
	latestDBVersion,
	upgradeFilterTo19,
} from "#/utils/globalLegendPersistSettings";
import {
	LatestModsManagerBackupSchema,
	ModsManagerBackupSchemaV16,
	ModsManagerBackupSchemaV18,
	ModsManagerBackupSchemaV19,
	type ModsManagerBackupSchemaV18Output,
} from "#/domain/schemas/mods-manager";
import { BackupSchema as GIMOBackupSchema } from "#/domain/schemas/gimo/BackupSchemas";
import { fromGIMOBackup } from "../mappers/GIMOBackupMapper";

interface BackupData {
	characterTemplates: CharacterTemplatesByName;
	compilations: Map<string, Map<string, Compilation>>;
	defaultCompilation: Compilation;
	incrementalOptimizationIndices: IndicesByProfile;
	lockedStatus: LockedStatusByCharacterIdByAllycode;
	modsViewSetups: PersistableModsViewSetupByIdByCategory;
	profilesManagement: PersistedProfiles;
	sessionIds: Record<string, string>;
	settings: SettingsByProfile;
}

interface NormalizedBackup {
	appVersion: string;
	backupType: "fullBackup";
	client: "mods-manager" | "gimo";
	data: unknown;
	version: number;
}

interface Backup {
	appVersion: string;
	backupType: "fullBackup";
	client: "mods-manager" | "gimo";
	data: BackupData;
	version: number;
}

// Helper function to recursively convert ISO date strings to Date objects
const convertISODates = (obj: unknown): unknown => {
	const isoDatePattern = new RegExp(
		/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/,
	);

	if (typeof obj === "string" && obj.match(isoDatePattern)) {
		return new Date(obj);
	}
	if (Array.isArray(obj)) {
		return obj.map(convertISODates);
	}
	if (obj && typeof obj === "object") {
		const converted: Record<string, unknown> = {};
		for (const [key, value] of Object.entries(obj)) {
			converted[key] = convertISODates(value);
		}
		return converted;
	}
	return obj;
};

const normalizeBackupJSON = (params: {
	appVersion: string;
	client: "mods-manager" | "gimo";
	data: unknown;
	version: number;
}) => {
	const normalizedData: NormalizedBackup = {
		appVersion: params.appVersion,
		data: params.data,
		client: params.client,
		backupType: "fullBackup",
		version: params.version,
	};
	return normalizedData;
};

const migrations = new Map<
	number,
	(normalizedBackup: NormalizedBackup) => NormalizedBackup
>([
	[
		0,
		(normalizedBackup) => {
			return {
				appVersion: normalizedBackup.appVersion,
				backupType: "fullBackup",
				client: "mods-manager",
				data: normalizedBackup.data,
				version: 16,
			};
		},
	],
	[
		16,
		(normalizedBackup) => {
			return {
				appVersion: normalizedBackup.appVersion,
				backupType: "fullBackup",
				client: "mods-manager",
				data: normalizedBackup.data,
				version: 18,
			};
		},
	],
	[
		18,
		(normalizedBackup) => {
			// Migrate v18 to v19: Convert TriState secondary settings to roll ranges
			const data = normalizedBackup.data as ModsManagerBackupSchemaV18Output;

			if (data.modsViewSetups) {
				for (const [category, viewSetupsByIdForCategory] of objectEntries(
					data.modsViewSetups,
				)) {
					for (const [viewSetupId, viewSetup] of objectEntries(
						viewSetupsByIdForCategory,
					)) {
						if (viewSetup.filterById) {
							for (const [filterId, filter] of objectEntries(
								viewSetup.filterById,
							)) {
								upgradeFilterTo19(filter);
							}
						}
					}
				}
			}

			return {
				appVersion: normalizedBackup.appVersion,
				backupType: "fullBackup",
				client: "mods-manager",
				data: data,
				version: 19,
			};
		},
	],
]);

function runMigrations(data: NormalizedBackup) {
	let currentData = data;
	if (currentData.version > latestDBVersion) {
		return null;
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

const convertBackup = (parsedJSON: unknown) => {
	let backup: NormalizedBackup | null = null;
	const gimoParseResult = v.safeParse(GIMOBackupSchema, parsedJSON);
	if (gimoParseResult.success) {
		backup = normalizeBackupJSON({
			appVersion: "",
			client: "gimo",
			data: fromGIMOBackup(gimoParseResult.output),
			version: 0,
		});
	}
	if (backup === null) {
		const modsManagerParseResult = v.safeParse(
			ModsManagerBackupSchemaV16,
			parsedJSON,
		);
		if (modsManagerParseResult.success) {
			// Pre-v19 backup - convert ISO dates
			const dataWithDates = convertISODates(
				modsManagerParseResult.output,
			) as v.InferOutput<typeof ModsManagerBackupSchemaV16>;
			backup = normalizeBackupJSON({
				appVersion: dataWithDates.version,
				client: "mods-manager",
				data: dataWithDates,
				version: 16,
			});
		}
	}
	if (backup === null) {
		const modsManagerParseResult = v.safeParse(
			ModsManagerBackupSchemaV18,
			parsedJSON,
		);
		if (modsManagerParseResult.success) {
			// Pre-v19 backup - convert ISO dates
			const dataWithDates = convertISODates(
				modsManagerParseResult.output,
			) as v.InferOutput<typeof ModsManagerBackupSchemaV18>;
			backup = normalizeBackupJSON({
				appVersion: dataWithDates.version,
				client: "mods-manager",
				data: dataWithDates,
				version: 18,
			});
		}
	}
	if (backup === null) {
		const modsManagerParseResult = v.safeParse(
			ModsManagerBackupSchemaV19,
			parsedJSON,
		);
		if (modsManagerParseResult.success) {
			backup = normalizeBackupJSON({
				appVersion: modsManagerParseResult.output.appVersion,
				client: "mods-manager",
				data: modsManagerParseResult.output,
				version: 19,
			});
		}
	}

	if (backup === null) {
		return {
			importError: {
				errorMessage: "Import of mods-manager backup failed.",
				errorReason: "Couldn't validate any known backup version",
				errorSolution:
					"Please check you selected a valid file. If so let me know about the error on discord",
			},
			backup: null,
		};
	}

	backup = runMigrations(backup);
	if (backup === null) {
		return {
			importError: {
				errorMessage: "Import of mods-manager backup failed.",
				errorReason: "Migration of the backup failed",
				errorSolution: "Please report on discord!",
			},
			backup: null,
		};
	}

	const finalSchemaResult = v.safeParse(LatestModsManagerBackupSchema, backup);
	if (!finalSchemaResult.success) {
		return {
			importError: {
				errorMessage: "Import of mods-manager backup failed.",
				errorReason: "Validation of the final migrated data failed",
				errorSolution: "Please report on discord!",
			},
			backup: null,
		};
	}
	return {
		importError: {
			errorMessage: "",
			errorReason: "",
			errorSolution: "",
		},
		backup: finalSchemaResult.output,
	};
};

export { convertBackup, type Backup, type BackupData, type NormalizedBackup };
