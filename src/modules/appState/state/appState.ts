// utils
import saveAs from "file-saver";

// state
import {
	type ObservableObject,
	beginBatch,
	endBatch,
	observable,
} from "@legendapp/state";

import { about$ } from "#/modules/about/state/about";
import { dialog$ } from "#/modules/dialog/state/dialog";
import { hotutils$ } from "#/modules/hotUtils/state/hotUtils";
import { incrementalOptimization$ } from "#/modules/incrementalOptimization/state/incrementalOptimization";
import { lockedStatus$ } from "#/modules/lockedStatus/state/lockedStatus";
import { modsView$ } from "#/modules/modsView/state/modsView";
import { optimizationSettings$ } from "#/modules/optimizationSettings/state/optimizationSettings";
import {
	type PersistedProfiles,
	profilesManagement$,
} from "#/modules/profilesManagement/state/profilesManagement";
import { templates$ } from "#/modules/templates/state/templates";
import { ui$ } from "#/modules/ui/state/ui";

// domain
import {
	type PlayerProfile,
	type PersistedPlayerProfile,
	getProfileFromPersisted,
} from "#/modules/profilesManagement/domain/PlayerProfile";
import type { CharacterTemplates } from "#/modules/templates/domain/CharacterTemplates";
import type { OptimizerRun } from "#/domain/OptimizerRun";

type AppState = {
	reset: () => void;
	loadBackup: (serializedAppState: string) => void;
	saveBackup: () => void;
};

interface Backup {
	characterTemplates: CharacterTemplates;
	lastRuns: OptimizerRun[];
	profilesManagement: PersistedProfiles;
	version: string;
}

const appState$: ObservableObject<AppState> = observable({
	reset: () => {
		beginBatch();
		dialog$.hide();
		hotutils$.reset();
		incrementalOptimization$.reset();
		lockedStatus$.reset();
		modsView$.reset();
		optimizationSettings$.reset();
		profilesManagement$.reset();
		templates$.reset();
		ui$.currentSection.set("help");
		endBatch();
	},
	loadBackup: (serializedAppState: string) => {
		try {
			const stateObj: Backup = JSON.parse(serializedAppState);

			const profilesManagement = stateObj.profilesManagement;
			const profiles: PlayerProfile[] = Object.values(
				profilesManagement.profileByAllycode,
			).map((profile: PersistedPlayerProfile) =>
				getProfileFromPersisted(profile),
			);
			for (const profile of profiles) {
				if (profilesManagement$.hasProfileWithAllycode(profile.allycode)) {
					profilesManagement$.profiles.profileByAllycode[profile.allycode].set(
						profile,
					);
				}
			}

			//      dispatch(Storage.thunks.saveLastRuns(stateObj.lastRuns));
			if (stateObj.characterTemplates) {
				templates$.userTemplatesByName.set(
					templates$.groupTemplatesById(stateObj.characterTemplates),
				);
			}
			if (
				profilesManagement.activeAllycode !== "" &&
				profilesManagement$.hasProfileWithAllycode(
					profilesManagement.activeAllycode,
				)
			) {
				profilesManagement$.profiles.activeAllycode.set(
					profilesManagement.activeAllycode,
				);
				hotutils$.checkSubscriptionStatus();
			}
		} catch (e) {
			throw new Error(
				`Unable to process progress file. Is this a template file? If so, use the "load" button below. Error message: ${
					(e as Error).message
				}`,
			);
		}
	},
	saveBackup: () => {
		const backup: Backup = {
			characterTemplates: templates$.userTemplates.peek(),
			lastRuns: [],
			profilesManagement: profilesManagement$.toPersistable(),
			version: about$.version.peek(),
		} as Backup;
		backup.version = about$.version.peek();
		const serializedBackup = JSON.stringify(backup);
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
