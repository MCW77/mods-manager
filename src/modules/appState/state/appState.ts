// utils
import saveAs from "file-saver";
import { objectEntries } from "#/utils/objectEntries";
import superjson from "superjson";

// state
import {
	beginBatch,
	endBatch,
	observable,
	type ObservableObject,
} from "@legendapp/state";

import { latestDBVersion } from "#/utils/globalLegendPersistSettings";

import { stateLoader$ } from "#/modules/stateLoader/stateLoader";

const profilesManagement$ = stateLoader$.profilesManagement$;
const compilations$ = stateLoader$.compilations$;
const about$ = stateLoader$.about$;
const currencies$ = stateLoader$.currencies$;
const datacrons$ = stateLoader$.datacrons$;
const hotutils$ = stateLoader$.hotutils$;
const incrementalOptimization$ = stateLoader$.incrementalOptimization$;
const lockedStatus$ = stateLoader$.lockedStatus$;
const materials$ = stateLoader$.materials$;
const modsView$ = stateLoader$.modsView$;
const optimizationSettings$ = stateLoader$.optimizationSettings$;
const templates$ = stateLoader$.templates$;

import { dialog$ } from "#/modules/dialog/state/dialog";
import "#/modules/reoptimizationNeeded/state/reoptimizationNeeded";
import { ui$ } from "#/modules/ui/state/ui";

// domain
import { convertBackup, type Backup, type BackupData } from "../domain/Backup";
import type { Compilation } from "#/modules/compilations/domain/Compilation";
import { getProfileFromPersisted } from "#/modules/profilesManagement/domain/PlayerProfile";
import type { LatestModsManagerBackupDataSchemaOutput } from "#/domain/schemas/mods-manager/index";

interface ImportError {
	errorMessage: string;
	errorReason: string;
	errorSolution: string;
}

type AppState = {
	import: ImportError;
	reset: () => void;
	loadBackup: (serializedAppState: string) => void;
	saveBackup: () => void;
};

const mergeProfilesManagement = (
	profilesManagement: LatestModsManagerBackupDataSchemaOutput["profilesManagement"],
) => {
	if (
		!profilesManagement ||
		Object.keys(profilesManagement.profileByAllycode).length === 0
	) {
		return;
	}

	// Process each profile from the imported data
	for (const [allycode, persistedProfile] of Object.entries(
		profilesManagement.profileByAllycode,
	)) {
		beginBatch();
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
		endBatch();
	}

	beginBatch();
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
	if (!compilationsData || compilationsData.size === 0) {
		return;
	}

	for (const [allycode, compilationsMap] of compilationsData) {
		for (const [compilationId, compilation] of compilationsMap) {
			// Check if compilation ID already exists for this allycode
			const existingCompilation =
				compilations$.compilationByIdByAllycode[allycode][compilationId].peek();
			if (compilations$.compilationByIdByAllycode.has(allycode) === false) {
				// Initialize Map for this allycode if it doesn't exist
				compilations$.compilationByIdByAllycode.set(allycode, new Map());
			}
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

function mergeCurrencies(
	backupCurrencies: LatestModsManagerBackupDataSchemaOutput["currencies"],
): void {
	if (!backupCurrencies) return;
	for (const [allycode, backupCurrencyByIdForProfile] of objectEntries(
		backupCurrencies,
	)) {
		const currentCurrencyByIdForProfile =
			currencies$.currencyByIdByAllycode.peek()[allycode];
		if (
			currentCurrencyByIdForProfile === undefined ||
			currentCurrencyByIdForProfile === null ||
			currentCurrencyByIdForProfile.currencyById.size === 0
		) {
			currencies$.currencyByIdByAllycode[allycode].set(
				backupCurrencyByIdForProfile,
			);
		}
	}
}

function mergeDatacrons(
	backupDatacrons: LatestModsManagerBackupDataSchemaOutput["datacrons"],
): void {
	if (!backupDatacrons) return;
	for (const [allycode, backupDatacronsOfProfile] of objectEntries(
		backupDatacrons,
	)) {
		const currentDatacronsOfProfile =
			datacrons$.datacronByIdByAllycode.peek()[allycode];
		if (
			currentDatacronsOfProfile === undefined ||
			currentDatacronsOfProfile === null ||
			currentDatacronsOfProfile.datacronById.size === 0
		) {
			datacrons$.datacronByIdByAllycode[allycode].set(backupDatacronsOfProfile);
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
			lockedStatus$.lockedCharactersByAllycode[allycode].peek();
		if (
			currentProfileLockedStatus === undefined ||
			currentProfileLockedStatus === null ||
			currentProfileLockedStatus.size === 0
		) {
			lockedStatus$.lockedCharactersByAllycode[allycode].set(
				backupCharacterLocks,
			);
		}
	}
}

function mergeMaterials(
	backupMaterials: LatestModsManagerBackupDataSchemaOutput["materials"],
): void {
	if (!backupMaterials) return;
	for (const [allycode, backupMaterialByIdForProfile] of objectEntries(
		backupMaterials,
	)) {
		const currentMaterialByIdForProfile =
			materials$.materialByIdByAllycode.peek()[allycode];
		if (
			currentMaterialByIdForProfile === undefined ||
			currentMaterialByIdForProfile === null ||
			currentMaterialByIdForProfile.materialById.size === 0
		) {
			materials$.materialByIdByAllycode[allycode].set(
				backupMaterialByIdForProfile,
			);
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
	backupSessionIdsByAllycode: LatestModsManagerBackupDataSchemaOutput["sessionIds"],
): void {
	if (!backupSessionIdsByAllycode) {
		return;
	}

	for (const [
		allycode,
		backupSessionIds,
	] of backupSessionIdsByAllycode.entries()) {
		const currentGimoSessionId =
			hotutils$.sessionIDsByProfile[allycode].gimoSessionId.peek();
		const currentHuSessionId =
			hotutils$.sessionIDsByProfile[allycode].huSessionId.peek();

		if (!currentGimoSessionId || currentGimoSessionId === "") {
			hotutils$.sessionIDsByProfile[allycode].gimoSessionId.set(
				backupSessionIds.gimoSessionId,
			);
		}
		if (!currentHuSessionId || currentHuSessionId === "") {
			hotutils$.sessionIDsByProfile[allycode].huSessionId.set(
				backupSessionIds.huSessionId,
			);
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
	mergeProfilesManagement(backup.profilesManagement);
	beginBatch();
	mergeCharacterTemplates(backup.characterTemplates);
	mergeCompilations(backup.compilations);
	mergeCurrencies(backup.currencies);
	mergeDatacrons(backup.datacrons);

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
	mergeMaterials(backup.materials);
	mergeModsViewSetups(backup.modsViewSetups);
	mergeSessionIds(backup.sessionIds);
	mergeSettings(backup.settings);
	endBatch();
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
		let parsedJSON: unknown;

		// Parse with superjson (handles both new superjson format and old JSON format)
		try {
			parsedJSON = superjson.parse(serializedAppState);
			if (parsedJSON === undefined) {
				parsedJSON = JSON.parse(serializedAppState);
			}
		} catch (error) {
			if (error instanceof SyntaxError) {
				appState$.import.errorMessage.set("Import of backup failed.");
				appState$.import.errorReason.set(error.message);
				appState$.import.errorSolution.set("Check the JSON format");
			}
			return;
		}

		const conversionResult = convertBackup(parsedJSON);
		if (conversionResult.importError.errorMessage !== "") {
			appState$.import.errorMessage.set(
				conversionResult.importError.errorMessage,
			);
			appState$.import.errorReason.set(
				conversionResult.importError.errorReason,
			);
			appState$.import.errorSolution.set(
				conversionResult.importError.errorSolution,
			);
			return;
		}
		if (conversionResult.backup !== null) {
			appState$.import.errorMessage.set("");
			loadModsManagerBackup(conversionResult.backup.data);
		}
	},
	saveBackup: () => {
		const backupData: BackupData = {
			characterTemplates: templates$.userTemplatesByName.peek(),
			compilations: compilations$.compilationByIdByAllycode.peek(),
			currencies: currencies$.persistedData.peek(),
			datacrons: datacrons$.persistedData.peek(),
			defaultCompilation: compilations$.defaultCompilation.peek(),
			incrementalOptimizationIndices:
				incrementalOptimization$.indicesByProfile.peek(),
			lockedStatus:
				lockedStatus$.persistedData.lockedStatus.lockedCharactersByAllycode.peek(),
			materials: materials$.persistedData.peek(),
			modsViewSetups: modsView$.toPersistable(),
			profilesManagement: profilesManagement$.toPersistable(),
			sessionIds: hotutils$.sessionIDsByProfile.peek(),
			settings: optimizationSettings$.settingsByProfile.peek(),
		};
		const compilations: Record<string, Record<string, Compilation>> = {};
		for (const [allycode, compilationsMap] of backupData.compilations) {
			if (allycode !== "id") {
				compilations[allycode] = Object.fromEntries(
					Array.from(compilationsMap),
				);
			}
		}
		const backup: Backup = {
			data: backupData,
			appVersion: about$.version.peek(),
			backupType: "fullBackup",
			client: "mods-manager",
			version: latestDBVersion,
		};
		const serializedBackup = superjson.stringify(backup);
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
