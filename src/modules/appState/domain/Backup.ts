// utils
import * as v from "valibot";
import { objectEntries } from "#/utils/objectEntries";

// domain
import type { Compilation } from "#/modules/compilations/domain/Compilation";
import type { IndicesByProfile } from "#/modules/incrementalOptimization/domain/IncrementalOptimizationObservable";
import type { LockedCharactersByAllycode } from "#/modules/lockedStatus/domain/LockedStatusByCharacterId";
import type { PersistableModsViewSetupByIdByCategory } from "#/modules/modsView/domain/ModsViewOptions";
import type { SettingsByProfile } from "#/modules/optimizationSettings/domain/OptimizationSettingsObservable";
import type { PersistedProfiles } from "#/modules/profilesManagement/domain/Profiles";
import type { CharacterTemplatesByName } from "#/modules/templates/domain/CharacterTemplates";

import {
	latestDBVersion,
	upgradeCompilationTo20,
	upgradeFilterTo19,
	upgradeLockedStatusTo20,
} from "#/utils/globalLegendPersistSettings";
import {
	LatestModsManagerBackupSchema,
	type ModsManagerBackupSchemaV18Output,
	type ModsManagerBackupDataSchemaV19Output,
	ModsManagerBackupSchemaV16,
	ModsManagerBackupSchemaV18,
	ModsManagerBackupSchemaV19,
	ModsManagerBackupSchemaV20,
	type ModsManagerBackupSchemaV16Output,
	type ModsManagerBackupDataSchemaV20Output,
	ModsManagerBackupSchemaV21,
} from "#/domain/schemas/mods-manager";
import { BackupSchema as GIMOBackupSchema } from "#/domain/schemas/gimo/BackupSchemas";
import { fromGIMOBackup } from "../mappers/GIMOBackupMapper";

interface BackupData {
	characterTemplates: CharacterTemplatesByName;
	compilations: Map<string, Map<string, Compilation>>;
	defaultCompilation: Compilation;
	incrementalOptimizationIndices: IndicesByProfile;
	lockedStatus: LockedCharactersByAllycode;
	modsViewSetups: PersistableModsViewSetupByIdByCategory;
	profilesManagement: PersistedProfiles;
	sessionIds: Map<string, { gimoSessionId: string; huSessionId: string }>;
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
			// Migrate v16 to v18: Update character templates structure
			const data = normalizedBackup.data as ModsManagerBackupSchemaV16Output;

			return {
				appVersion: normalizedBackup.appVersion,
				backupType: "fullBackup",
				client: "mods-manager",
				data: {
					characterTemplates: data.characterTemplates,
					compilations: data.compilations,
					defaultCompilation: {
						category: "",
						description: "",
						flatCharacterModdings: [],
						id: "DefaultCompilation",
						isReoptimizationNeeded: true,
						lastOptimized: null as Date | null,
						optimizationConditions: null,
						reoptimizationIndex: 0,
						selectedCharacters: [],
					},
					incrementalOptimizationIndices: data.incrementalOptimizationIndices,
					lockedStatus: data.lockedStatus,
					modsViewSetups: {
						AllMods: {},
						Calibrate: {},
						Level: {},
						Reveal: {},
						Slice5Dot: {},
						Slice6Dot: {},
						Slice6E: {},
					},
					profilesManagement: {
						activeAllycode: "",
						lastUpdatedByAllycode: {},
						playernameByAllycode: {},
						profileByAllycode: {},
					},
					sessionIds: data.sessionIds,
					settings: {},
				},
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
				for (const [, viewSetupsByIdForCategory] of objectEntries(
					data.modsViewSetups,
				)) {
					for (const [, viewSetup] of objectEntries(
						viewSetupsByIdForCategory,
					)) {
						if (viewSetup.filterById) {
							for (const [, filter] of objectEntries(viewSetup.filterById)) {
								upgradeFilterTo19(filter);
							}
						}
					}
				}
			}

			const newCompilations: Map<
				string,
				Map<string, Record<string, unknown>>
			> = new Map();
			if (data.compilations) {
				for (const [allycode, compilationById] of objectEntries(
					data.compilations,
				)) {
					const newCompilationById = new Map<string, Record<string, unknown>>();
					for (const [compilationId, compilation] of objectEntries(
						compilationById,
					)) {
						newCompilationById.set(compilationId, compilation);
					}
					newCompilations.set(allycode, newCompilationById);
				}
			}

			const newData = {
				characterTemplates: data.characterTemplates,
				compilations: newCompilations,
				defaultCompilation: data.defaultCompilation,
				incrementalOptimizationIndices: data.incrementalOptimizationIndices,
				lockedStatus: data.lockedStatus,
				modsViewSetups: data.modsViewSetups,
				profilesManagement: data.profilesManagement,
				sessionIds: data.sessionIds,
				settings: data.settings,
			};

			return {
				appVersion: normalizedBackup.appVersion,
				backupType: "fullBackup",
				client: "mods-manager",
				data: newData,
				version: 19,
			};
		},
	],
	[
		19,
		(normalizedBackup) => {
			// Migrate v19 to v20: Update locked status structure
			const data =
				normalizedBackup.data as ModsManagerBackupDataSchemaV19Output;

			const newCompilations = new Map<
				string,
				Map<string, Record<string, unknown>>
			>();
			for (const [allycode, compilationById] of data.compilations) {
				const newCompilationById = new Map<string, Record<string, unknown>>();
				for (const [compilationId, compilation] of compilationById) {
					newCompilationById.set(
						compilationId,
						upgradeCompilationTo20(compilation),
					);
				}
				newCompilations.set(allycode, newCompilationById);
			}

			const newData = {
				characterTemplates: data.characterTemplates,
				compilations: newCompilations,
				defaultCompilation: upgradeCompilationTo20(data.defaultCompilation),
				incrementalOptimizationIndices: data.incrementalOptimizationIndices,
				lockedStatus: upgradeLockedStatusTo20(data.lockedStatus),
				modsViewSetups: data.modsViewSetups,
				profilesManagement: data.profilesManagement,
				sessionIds: data.sessionIds,
				settings: data.settings,
			};

			return {
				appVersion: normalizedBackup.appVersion,
				backupType: "fullBackup",
				client: "mods-manager",
				data: newData,
				version: 20,
			};
		},
	],
	[
		20,
		(normalizedBackup) => {
			// Migrate v20 to v21: Update session IDs structure
			const data =
				normalizedBackup.data as ModsManagerBackupDataSchemaV20Output;

			const newSessionIDs = new Map<
				string,
				{ gimoSessionId: string; huSessionId: string }
			>();
			for (const [allycode, sessionId] of objectEntries(data.sessionIds)) {
				newSessionIDs.set(allycode, {
					gimoSessionId: sessionId,
					huSessionId: "",
				});
			}

			const newData = {
				characterTemplates: data.characterTemplates,
				compilations: data.compilations,
				defaultCompilation: data.defaultCompilation,
				incrementalOptimizationIndices: data.incrementalOptimizationIndices,
				lockedStatus: data.lockedStatus,
				modsViewSetups: data.modsViewSetups,
				profilesManagement: data.profilesManagement,
				sessionIds: newSessionIDs,
				settings: data.settings,
			};

			return {
				appVersion: normalizedBackup.appVersion,
				backupType: "fullBackup",
				client: "mods-manager",
				data: newData,
				version: 21,
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
		if (modsManagerParseResult.success) backup = modsManagerParseResult.output;
	}

	if (backup === null) {
		const modsManagerParseResult = v.safeParse(
			ModsManagerBackupSchemaV20,
			parsedJSON,
		);
		if (modsManagerParseResult.success) backup = modsManagerParseResult.output;
	}

	if (backup === null) {
		const modsManagerParseResult = v.safeParse(
			ModsManagerBackupSchemaV21,
			parsedJSON,
		);
		if (modsManagerParseResult.success) backup = modsManagerParseResult.output;
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
