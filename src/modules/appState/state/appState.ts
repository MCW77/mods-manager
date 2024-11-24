// utils
import saveAs from "file-saver";

// state
import {
	beginBatch,
	endBatch,
	observable,
	type ObservableObject,
} from "@legendapp/state";

import { stateLoader$ } from "#/modules/stateLoader/stateLoader";

const profilesManagement$ = stateLoader$.profilesManagement$;
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
import type { OptimizerRun } from "#/domain/OptimizerRun";
import {
	type PlayerProfile,
	type PersistedPlayerProfile,
	getProfileFromPersisted,
} from "#/modules/profilesManagement/domain/PlayerProfile";
import type { PersistedProfiles } from "#/modules/profilesManagement/domain/Profiles";
import type { CharacterTemplates } from "#/modules/templates/domain/CharacterTemplates";

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
