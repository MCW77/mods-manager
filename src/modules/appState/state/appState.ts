// utils
import saveAs from "file-saver";
import * as v from "valibot";
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
import type { Backup, PersistableBackup } from "../domain/Backup";
import {
	ModsManagerSchema,
	ModsManagerBackupSchema,
} from "../domain/schemas/mods-manager";
import type { Compilation } from "#/modules/compilations/domain/Compilation";
import {
	type PlayerProfile,
	type PersistedPlayerProfile,
	getProfileFromPersisted,
} from "#/modules/profilesManagement/domain/PlayerProfile";

type AppState = {
	reset: () => void;
	loadBackup: (serializedAppState: string) => void;
	saveBackup: () => void;
};

const loadModsManagerBackup = (backup: PersistableBackup) => {
	beginBatch();

	if (backup.characterTemplates) {
		templates$.userTemplatesByName.set(backup.characterTemplates);
	}

	if (backup.defaultCompilation) {
		compilations$.defaultCompilation.set(backup.defaultCompilation);
	}

	if (backup.compilations) {
		const compilations: Map<string, Map<string, Compilation>> = new Map();
		for (const [allycode, compilationsMap] of Object.entries(
			backup.compilations,
		)) {
			compilations.set(allycode, new Map(Object.entries(compilationsMap)));
		}
		compilations$.compilationByIdByAllycode.set(compilations);
	}

	if (backup.incrementalOptimizationIndices) {
		incrementalOptimization$.indicesByProfile.set(
			backup.incrementalOptimizationIndices,
		);
	}

	if (backup.lockedStatus) {
		lockedStatus$.byCharacterIdByAllycode.set(backup.lockedStatus);
	}

	if (backup.modsViewSetups) {
		modsView$.restoreFromPersistable(backup.modsViewSetups);
	}

	if (backup.profilesManagement) {
		const profilesManagement = backup.profilesManagement;
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
				profiles.map((profile: PlayerProfile) => [profile.allycode, profile]),
			),
		);
	}

	if (backup.sessionIds) {
		hotutils$.sessionIdByProfile.set(backup.sessionIds);
	}

	if (backup.settings) {
		optimizationSettings$.settingsByProfile.set(backup.settings);
	}
	endBatch();
};

const isModsManagerBackup = (parsedJSON: unknown) => {
	return v.is(ModsManagerSchema, parsedJSON);
};

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
			const parsedJON: unknown = JSON.parse(
				serializedAppState,
				(key, value) => {
					if (typeof value === "string" && value.match(isoDatePattern)) {
						return new Date(value);
					}
					return value;
				},
			);
			if (!isModsManagerBackup(parsedJON)) {
				dialog$.showError(
					"Import of backup aborted",
					"The selected file is not a valid mods-manager backup",
					"Please check you selected a valid file. If so let me know about the error on discord",
				);
				return;
			}
			const persistableBackup: PersistableBackup = v.parse(
				ModsManagerBackupSchema,
				parsedJON,
			);
			loadModsManagerBackup(persistableBackup);
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
