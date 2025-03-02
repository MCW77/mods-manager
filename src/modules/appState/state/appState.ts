// utils
import saveAs from "file-saver";

// state
import {
	beginBatch,
	endBatch,
	observable,
	type ObservableObject,
} from "@legendapp/state";

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
import type { Compilation } from "#/modules/compilations/domain/Compilation";
import type { IndicesByProfile } from "#/modules/incrementalOptimization/domain/IncrementalOptimizationObservable";
import type { LockedStatusByCharacterIdByAllycode } from "#/modules/lockedStatus/domain/LockedStatusByCharacterId";
import type {
	ModsViewSetupByIdByCategory,
	PersistableModsViewSetupByIdByCategory,
} from "#/modules/modsView/domain/ModsViewOptions";
import type { SettingsByProfile } from "#/modules/optimizationSettings/domain/OptimizationSettingsObservable";
import {
	type PlayerProfile,
	type PersistedPlayerProfile,
	getProfileFromPersisted,
} from "#/modules/profilesManagement/domain/PlayerProfile";
import type { PersistedProfiles } from "#/modules/profilesManagement/domain/Profiles";
import type { CharacterTemplatesByName } from "#/modules/templates/domain/CharacterTemplates";

type AppState = {
	reset: () => void;
	loadBackup: (serializedAppState: string) => void;
	saveBackup: () => void;
};

interface Backup {
	characterTemplates: CharacterTemplatesByName;
	compilations: Map<string, Map<string, Compilation>>;
	defaultCompilation: Compilation;
	incrementalOptimizationIndices: IndicesByProfile;
	lockedStatus: LockedStatusByCharacterIdByAllycode;
	modsViewSetups: PersistableModsViewSetupByIdByCategory;
	profilesManagement: PersistedProfiles;
	sessionIds: Record<string, string>;
	settings: SettingsByProfile;
	version: string;
}

interface PersistableBackup {
	characterTemplates: CharacterTemplatesByName;
	compilations: Record<string, Record<string, Compilation>>;
	defaultCompilation: Compilation;
	incrementalOptimizationIndices: IndicesByProfile;
	lockedStatus: LockedStatusByCharacterIdByAllycode;
	modsViewSetups: PersistableModsViewSetupByIdByCategory;
	profilesManagement: PersistedProfiles;
	sessionIds: Record<string, string>;
	settings: SettingsByProfile;
	version: string;
	client: "mods-manager";
}

const appState$: ObservableObject<AppState> = observable({
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
		try {
			const stateObj: PersistableBackup = JSON.parse(
				serializedAppState,
				(key, value) => {
					if (typeof value === "string" && value.match(isoDatePattern)) {
						return new Date(value);
					}
					return value;
				},
			);
			if (stateObj.client !== "mods-manager") {
				dialog$.showError(
					"Import of backup aborted",
					"The selected file is not a valid mods-manager backup",
					"Please check you selected a valid file. If so let me know about the error on discord",
				);
				return;
			}
			beginBatch();

			if (stateObj.characterTemplates) {
				templates$.userTemplatesByName.set(stateObj.characterTemplates);
			}

			if (stateObj.defaultCompilation) {
				compilations$.defaultCompilation.set(stateObj.defaultCompilation);
			}

			if (stateObj.compilations) {
				const compilations: Map<string, Map<string, Compilation>> = new Map();
				for (const [allycode, compilationsMap] of Object.entries(
					stateObj.compilations,
				)) {
					compilations.set(allycode, new Map(Object.entries(compilationsMap)));
				}
				compilations$.compilationByIdByAllycode.set(compilations);
			}

			if (stateObj.incrementalOptimizationIndices) {
				incrementalOptimization$.indicesByProfile.set(
					stateObj.incrementalOptimizationIndices,
				);
			}

			if (stateObj.lockedStatus) {
				lockedStatus$.byCharacterIdByAllycode.set(stateObj.lockedStatus);
			}

			if (stateObj.modsViewSetups) {
				modsView$.restoreFromPersistable(stateObj.modsViewSetups);
			}

			if (stateObj.profilesManagement) {
				const profilesManagement = stateObj.profilesManagement;
				const profiles: PlayerProfile[] = Object.values(
					profilesManagement.profileByAllycode,
				).map((profile: PersistedPlayerProfile) =>
					getProfileFromPersisted(profile),
				);
				profilesManagement$.profiles.activeAllycode.set(
					profilesManagement.activeAllycode,
				);
				profilesManagement$.profiles.lastUpdatedByAllycode.set(
					profilesManagement.lastUpdatedByAllycode,
				);
				profilesManagement$.profiles.playernameByAllycode.set(
					profilesManagement.playernameByAllycode,
				);
				profilesManagement$.profiles.profileByAllycode.set(
					Object.fromEntries(
						profiles.map((profile: PlayerProfile) => [
							profile.allycode,
							profile,
						]),
					),
				);
			}

			if (stateObj.sessionIds) {
				hotutils$.sessionIdByProfile.set(stateObj.sessionIds);
			}

			if (stateObj.settings) {
				optimizationSettings$.settingsByProfile.set(stateObj.settings);
			}

			endBatch();
		} catch (e) {
			dialog$.showError(
				"Error loading backup",
				(e as Error).message,
				"Contact me on discord and inform me about the error",
			);
		}
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

export { appState$ };
