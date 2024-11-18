// utils
import saveAs from "file-saver";

// state
import {
	type ObservableObject,
	beginBatch,
	endBatch,
	observable,
} from "@legendapp/state";

const { about$ } = await import("#/modules/about/state/about");
import { dialog$ } from "#/modules/dialog/state/dialog";
const { hotutils$ } = await import("#/modules/hotUtils/state/hotUtils");
const { incrementalOptimization$ } = await import(
	"#/modules/incrementalOptimization/state/incrementalOptimization"
);
const { lockedStatus$ } = await import(
	"#/modules/lockedStatus/state/lockedStatus"
);
const { modsView$ } = await import("#/modules/modsView/state/modsView");
const { optimizationSettings$ } = await import(
	"#/modules/optimizationSettings/state/optimizationSettings"
);
const { profilesManagement$ } = await import(
	"#/modules/profilesManagement/state/profilesManagement"
);
const { templates$ } = await import("#/modules/templates/state/templates");
import { ui$ } from "#/modules/ui/state/ui";

// domain
import type { OptimizerRun } from "#/domain/OptimizerRun";
import {
	type PlayerProfile,
	type PersistedPlayerProfile,
	getProfileFromPersisted,
} from "#/modules/profilesManagement/domain/PlayerProfile";
import type { PersistedProfiles } from "#/modules/profilesManagement/state/profilesManagement";
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
