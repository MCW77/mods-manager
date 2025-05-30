// utils
import saveAs from "file-saver";
import * as v from "valibot";
import { objectEntries } from "#/utils/objectEntries";

// state
import {
	beginBatch,
	endBatch,
	observable,
	type ObservableObject,
} from "@legendapp/state";

import { latestDBVersion } from "#/utils/globalLegendPersistSettings";

const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader");

const profilesManagement$ = stateLoader$.profilesManagement$;
const compilations$ = stateLoader$.compilations$;
const about$ = stateLoader$.about$;
const hotutils$ = stateLoader$.hotutils$;
const incrementalOptimization$ = stateLoader$.incrementalOptimization$;
const lockedStatus$ = stateLoader$.lockedStatus$;
const modsView$ = stateLoader$.modsView$;
const optimizationSettings$ = stateLoader$.optimizationSettings$;
const templates$ = stateLoader$.templates$;

import { dialog$ } from "#/modules/dialog/state/dialog";
import { ui$ } from "#/modules/ui/state/ui";

// domain
import type { Backup, PersistableBackup } from "../domain/Backup";
import type { Compilation } from "#/modules/compilations/domain/Compilation";
import { getProfileFromPersisted } from "#/modules/profilesManagement/domain/PlayerProfile";
import {
	LatestModsManagerBackupSchema,
	type LatestModsManagerBackupDataSchemaOutput,
	ModsManagerBackupSchemaV16,
	ModsManagerBackupSchemaV18,
} from "#/domain/schemas/mods-manager";
import { BackupSchema as GIMOBackupSchema } from "#/domain/schemas/gimo/BackupSchemas";
import { fromGIMOBackup } from "../mappers/GIMOBackupMapper";

interface NormalizedBackup {
	data: unknown;
	client: "mods-manager" | "gimo";
	backupType: "fullBackup";
	version: number;
}

type AppState = {
	import: {
		errorMessage: string;
		errorReason: string;
		errorSolution: string;
	};
	reset: () => void;
	loadBackup: (serializedAppState: string) => void;
	saveBackup: () => void;
};

const migrations = new Map<
	number,
	(normalizedBackup: NormalizedBackup) => NormalizedBackup
>([
	[
		0,
		(normalizedBackup) => {
			return {
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
				backupType: "fullBackup",
				client: "mods-manager",
				data: normalizedBackup.data,
				version: 18,
			};
		},
	],
]);

function runMigrations(data: NormalizedBackup) {
	let currentData = data;
	while (currentData.version < latestDBVersion) {
		const migrate = migrations.get(currentData.version);
		if (!migrate) {
			templates$.import.errorMessage.set(
				"Import of character templates failed",
			);
			templates$.import.errorReason.set(
				`Couldn't find a migration for version ${data.version}`,
			);
			templates$.import.errorSolution.set(
				"Ensure your backup matches a known schema.",
			);
			return null;
		}
		currentData = migrate(currentData);
	}
	return currentData;
}

const mergeProfilesManagement = (
	profilesManagement: LatestModsManagerBackupDataSchemaOutput["profilesManagement"],
) => {
	if (
		!profilesManagement ||
		Object.keys(profilesManagement.profileByAllycode).length === 0
	) {
		return;
	}

	beginBatch();

	// Process each profile from the imported data
	for (const [allycode, persistedProfile] of Object.entries(
		profilesManagement.profileByAllycode,
	)) {
		const profile = getProfileFromPersisted(persistedProfile);

		if (profilesManagement$.hasProfileWithAllycode(allycode)) {
			// Profile exists - update it
			profilesManagement$.updateProfile(profile);
		} else {
			// Profile doesn't exist - add it
			profilesManagement$.addProfile(allycode, profile.playerName);
			// After adding, update with the full profile data
			profilesManagement$.updateProfile(profile);
		}
	}

	// Update lastUpdatedByAllycode with imported data (merge with existing)
	if (profilesManagement.lastUpdatedByAllycode) {
		const currentLastUpdated =
			profilesManagement$.profiles.lastUpdatedByAllycode.peek();
		profilesManagement$.profiles.lastUpdatedByAllycode.set({
			...currentLastUpdated,
			...profilesManagement.lastUpdatedByAllycode,
		});
	}

	// Update playernameByAllycode with imported data (merge with existing)
	if (profilesManagement.playernameByAllycode) {
		const currentPlayernames =
			profilesManagement$.profiles.playernameByAllycode.peek();
		profilesManagement$.profiles.playernameByAllycode.set({
			...currentPlayernames,
			...profilesManagement.playernameByAllycode,
		});
	}

	// Only set activeAllycode if there isn't one already set
	if (
		profilesManagement$.profiles.activeAllycode.peek() === "" &&
		profilesManagement.activeAllycode
	) {
		profilesManagement$.profiles.activeAllycode.set(
			profilesManagement.activeAllycode,
		);
	}

	endBatch();
};

/**
 * Loads compilations from backup data, converting from Record format to Map format and merging with existing compilations.
 * Handles ID conflicts by adding suffixed IDs when necessary.
 */
function mergeCompilations(
	compilationsData: LatestModsManagerBackupDataSchemaOutput["compilations"],
): void {
	if (!compilationsData || Object.keys(compilationsData).length === 0) {
		return;
	}

	for (const [allycode, compilationsMap] of Object.entries(compilationsData)) {
		for (const [compilationId, compilation] of Object.entries(
			compilationsMap,
		)) {
			// Check if compilation ID already exists for this allycode
			const existingCompilation =
				compilations$.compilationByIdByAllycode[allycode][compilationId].peek();

			if (!existingCompilation) {
				// Compilation doesn't exist, add it directly
				compilations$.compilationByIdByAllycode[allycode][compilationId].set(
					compilation,
				);
			} else {
				// Compilation ID exists, find a unique suffixed name
				let suffixedId = `${compilationId}-backup-1`;
				let counter = 1;

				while (
					compilations$.compilationByIdByAllycode[allycode][suffixedId].peek()
				) {
					counter++;
					suffixedId = `${compilationId}-backup-${counter}`;
				}

				// Add the compilation with the suffixed ID
				const compilationWithNewId = {
					...compilation,
					id: suffixedId,
				};
				compilations$.compilationByIdByAllycode[allycode][suffixedId].set(
					compilationWithNewId,
				);
			}
		}
	}
}

/**
 * Smart merging logic for character templates that handles ID conflicts
 * - If template ID already exists and content is identical, keeps existing
 * - If template ID already exists but content is different, adds with suffixed ID
 * - If template ID doesn't exist, adds normally
 * - Handles recursive suffix checking for multiple imports
 */
function mergeCharacterTemplates(
	backupTemplates: LatestModsManagerBackupDataSchemaOutput["characterTemplates"],
): void {
	if (!backupTemplates) return;

	const existingTemplates = templates$.userTemplatesByName.peek();

	for (const [templateId, template] of objectEntries(backupTemplates)) {
		const existingTemplate = existingTemplates[templateId];

		if (!existingTemplate) {
			// Template doesn't exist, add it directly
			templates$.userTemplatesByName[templateId].set(template);
		} else {
			// Template exists, check if content is identical
			const isIdentical =
				JSON.stringify(existingTemplate.category) ===
					JSON.stringify(template.category) &&
				JSON.stringify(existingTemplate.selectedCharacters) ===
					JSON.stringify(template.selectedCharacters);

			if (isIdentical) {
				return;
			}
			// Template is different, find a unique suffixed name
			let suffixedId = `${templateId}-backup-1`;
			let counter = 1;

			while (existingTemplates[suffixedId]) {
				counter++;
				suffixedId = `${templateId}-backup-${counter}`;
			}

			// Add the template with the suffixed ID
			const templateWithNewId = {
				...template,
				id: suffixedId,
			};
			templates$.userTemplatesByName[suffixedId].set(templateWithNewId);
		}
	}
}

/**
 * Merges locked status data from backup with existing locked status.
 * Only sets locked status from backup where current locked status doesn't exist for the profile.
 */
function mergeLockedStatus(
	backupLockedStatus: LatestModsManagerBackupDataSchemaOutput["lockedStatus"],
): void {
	if (!backupLockedStatus) {
		return;
	}

	for (const [allycode, backupCharacterLocks] of objectEntries(
		backupLockedStatus,
	)) {
		const currentProfileLockedStatus =
			lockedStatus$.byCharacterIdByAllycode[allycode].peek();
		if (currentProfileLockedStatus === undefined) {
			lockedStatus$.byCharacterIdByAllycode[allycode].set(backupCharacterLocks);
		}
	}
}

/**
 * Smart merging logic for modsViewSetups that handles ID conflicts with suffix versioning
 * - Check if ViewSetup ID already exists within each of the 7 categories
 * - If ID exists, add with suffixed ID without checking content identity
 * - If ID doesn't exist, add directly
 * - Handle recursive suffix checking for multiple imports
 */
function mergeModsViewSetups(
	backupModsViewSetups: LatestModsManagerBackupDataSchemaOutput["modsViewSetups"],
): void {
	if (!backupModsViewSetups) return;

	for (const [category, backupViewSetupsByIdForCategory] of objectEntries(
		backupModsViewSetups,
	)) {
		for (const [viewSetupId, backupViewSetup] of objectEntries(
			backupViewSetupsByIdForCategory,
		)) {
			// Check if ViewSetup ID already exists in current category
			const existingViewSetup =
				modsView$.persistedData.viewSetup.byIdByCategory[category][
					viewSetupId
				].peek();

			if (!existingViewSetup) {
				// ViewSetup doesn't exist, add it directly using path-based operation
				// Convert from PersistableViewSetup to ViewSetup (restore Map for sort)
				const viewSetupWithMapSort = {
					...backupViewSetup,
					sort: new Map(Object.entries(backupViewSetup.sort)),
				};
				modsView$.persistedData.viewSetup.byIdByCategory[category][
					viewSetupId
				].set(viewSetupWithMapSort);
			} else {
				// ViewSetup ID exists, find a unique suffixed name
				let suffixedId = `${viewSetupId}-backup-1`;
				let counter = 1;

				while (
					modsView$.persistedData.viewSetup.byIdByCategory[category][
						suffixedId
					].peek()
				) {
					counter++;
					suffixedId = `${viewSetupId}-backup-${counter}`;
				}

				// Add the ViewSetup with the suffixed ID
				const viewSetupWithNewId = {
					...backupViewSetup,
					id: suffixedId,
					sort: new Map(Object.entries(backupViewSetup.sort)),
				};
				modsView$.persistedData.viewSetup.byIdByCategory[category][
					suffixedId
				].set(viewSetupWithNewId);
			}
		}
	}
}

/**
 * Merges session IDs from backup data with existing session IDs.
 * Only sets session IDs from backup where current session ID is empty string or doesn't exist.
 */
function mergeSessionIds(
	backupSessionIds: LatestModsManagerBackupDataSchemaOutput["sessionIds"],
): void {
	if (!backupSessionIds) {
		return;
	}

	for (const [allycode, backupSessionId] of Object.entries(backupSessionIds)) {
		const currentSessionId = hotutils$.sessionIdByProfile[allycode].peek();
		if (!currentSessionId || currentSessionId === "") {
			hotutils$.sessionIdByProfile[allycode].set(backupSessionId);
		}
	}
}

/**
 * Merges optimization settings from backup data with existing settings.
 * Only sets settings from backup where current settings don't exist for the profile.
 */
function mergeSettings(
	backupSettings: LatestModsManagerBackupDataSchemaOutput["settings"],
): void {
	if (!backupSettings) {
		return;
	}

	for (const [allycode, backupSettingsForProfile] of objectEntries(
		backupSettings,
	)) {
		const currentSettings =
			optimizationSettings$.settingsByProfile[allycode].peek();
		if (currentSettings === undefined) {
			optimizationSettings$.settingsByProfile[allycode].set(
				backupSettingsForProfile,
			);
		}
	}
}

const loadModsManagerBackup = (
	backup: LatestModsManagerBackupDataSchemaOutput,
) => {
	beginBatch();
	mergeProfilesManagement(backup.profilesManagement);
	mergeCharacterTemplates(backup.characterTemplates);

	if (
		backup.defaultCompilation &&
		compilations$.defaultCompilation.selectedCharacters.length === 0
	) {
		compilations$.defaultCompilation.set(backup.defaultCompilation);
	}
	mergeCompilations(backup.compilations);

	if (backup.incrementalOptimizationIndices) {
		// Only set indices from backup where current index doesn't exist (is null/undefined)
		for (const [allycode, backupIndex] of Object.entries(
			backup.incrementalOptimizationIndices,
		)) {
			const currentIndex =
				incrementalOptimization$.indicesByProfile[allycode].peek();
			if (currentIndex === null || currentIndex === undefined) {
				incrementalOptimization$.indicesByProfile[allycode].set(backupIndex);
			}
		}
	}
	mergeLockedStatus(backup.lockedStatus);
	mergeModsViewSetups(backup.modsViewSetups);
	mergeSessionIds(backup.sessionIds);
	mergeSettings(backup.settings);
	endBatch();
};

const normalizeBackupJSON = (params: {
	client: "mods-manager" | "gimo";
	data: unknown;
	version: number;
}) => {
	const normalizedData: NormalizedBackup = {
		data: params.data,
		client: params.client,
		backupType: "fullBackup",
		version: params.version,
	};
	return normalizedData;
};

const appState$: ObservableObject<AppState> = observable({
	import: {
		errorMessage: "",
		errorReason: "",
		errorSolution: "",
	},
	reset: () => {
		dialog$.hide();
		templates$.reset();
		beginBatch();
		compilations$.reset();
		hotutils$.reset();
		incrementalOptimization$.reset();
		lockedStatus$.reset();
		modsView$.reset();
		optimizationSettings$.reset();
		profilesManagement$.reset();
		ui$.currentSection.set("help");
		endBatch();
	},
	loadBackup: (serializedAppState: string) => {
		const isoDatePattern = new RegExp(
			/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/,
		);
		let parsedJSON: unknown;
		let backup = null as NormalizedBackup | null;
		try {
			parsedJSON = JSON.parse(serializedAppState, (key, value) => {
				if (typeof value === "string" && value.match(isoDatePattern)) {
					return new Date(value);
				}
				return value;
			});
		} catch (error) {
			if (error instanceof SyntaxError) {
				appState$.import.errorMessage.set("Import of backup failed.");
				appState$.import.errorReason.set(error.message);
				appState$.import.errorSolution.set("Check the JSON format");
			}
			return;
		}
		const gimoParseResult = v.safeParse(GIMOBackupSchema, parsedJSON);
		if (gimoParseResult.success) {
			backup = normalizeBackupJSON({
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
				backup = normalizeBackupJSON({
					client: "mods-manager",
					data: modsManagerParseResult.output,
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
				backup = normalizeBackupJSON({
					client: "mods-manager",
					data: modsManagerParseResult.output,
					version: 18,
				});
			}
		}

		if (backup === null) {
			appState$.import.errorMessage.set(
				"Import of mods-manager backup failed.",
			);
			appState$.import.errorReason.set(
				"Couldn't validate a mods-manager backup",
			);
			appState$.import.errorSolution.set(
				"Please check you selected a valid file. If so let me know about the error on discord",
			);
			return;
		}

		backup = runMigrations(backup);
		if (backup === null) {
			return;
		}

		const finalSchemaResult = v.safeParse(
			LatestModsManagerBackupSchema,
			backup,
		);
		if (!finalSchemaResult.success) {
			appState$.import.errorMessage.set("Import of character templates failed");
			appState$.import.errorReason.set(
				`Validation of the final migrated data failed:
			${finalSchemaResult.issues.map((issue) => issue.message)}`,
			);
			appState$.import.errorSolution.set("Please report on discord!");
			return;
		}
		appState$.import.errorMessage.set("");
		const test = finalSchemaResult.output.data.defaultCompilation;
		type Test = typeof test;
		const persistableBackupData: LatestModsManagerBackupDataSchemaOutput =
			finalSchemaResult.output.data;
		//		const persistableBackupData: PersistableBackupData = finalSchemaResult.output.data;
		loadModsManagerBackup(persistableBackupData);
	},
	saveBackup: () => {
		const backup: Backup = {
			characterTemplates: templates$.userTemplatesByName.peek(),
			defaultCompilation: compilations$.defaultCompilation.peek(),
			compilations: compilations$.compilationByIdByAllycode.peek(),
			incrementalOptimizationIndices:
				incrementalOptimization$.indicesByProfile.peek(),
			lockedStatus:
				lockedStatus$.persistedData.lockedStatus.lockedStatusByCharacterIdByAllycode.peek(),
			modsViewSetups: modsView$.toPersistable(),
			profilesManagement: profilesManagement$.toPersistable(),
			sessionIds: hotutils$.sessionIdByProfile.peek(),
			settings: optimizationSettings$.settingsByProfile.peek(),
			version: about$.version.peek(),
		};
		const compilations: Record<string, Record<string, Compilation>> = {};
		for (const [allycode, compilationsMap] of backup.compilations) {
			if (allycode !== "id") {
				compilations[allycode] = Object.fromEntries(
					Array.from(compilationsMap),
				);
			}
		}
		const persistableBackup: PersistableBackup = {
			characterTemplates: backup.characterTemplates,
			defaultCompilation: backup.defaultCompilation,
			compilations,
			incrementalOptimizationIndices: backup.incrementalOptimizationIndices,
			lockedStatus: backup.lockedStatus,
			modsViewSetups: backup.modsViewSetups,
			profilesManagement: backup.profilesManagement,
			sessionIds: backup.sessionIds,
			settings: backup.settings,
			version: backup.version,
			client: "mods-manager",
		};
		const serializedBackup = JSON.stringify(persistableBackup);
		const backupBlob = new Blob([serializedBackup], {
			type: "application/json;charset=utf-8",
		});
		saveAs(
			backupBlob,
			`modsOptimizer-${new Date().toISOString().slice(0, 10)}.json`,
		);
	},
});

appState$.import.errorMessage.set("");
export { appState$ };
