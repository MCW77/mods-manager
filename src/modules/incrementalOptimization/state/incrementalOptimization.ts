// state
import { type ObservableObject, observable, when } from "@legendapp/state";
import { syncObservable } from "@legendapp/state/sync";
import { persistOptions } from "#/utils/globalLegendPersistSettings";

import { profilesManagement$ } from "#/modules/profilesManagement/state/profilesManagement";

type IndicesByProfile = Record<string, number | null>;
interface IncrementalOptimization {
	activeIndex: () => number | null;
	indicesByProfile: IndicesByProfile;
	addProfile: (allycode: string) => void;
	reset: () => void;
	deleteProfile: (allycode: string) => void;
}

const incrementalOptimization$: ObservableObject<IncrementalOptimization> =
	observable<IncrementalOptimization>({
		activeIndex: () => {
			return incrementalOptimization$.indicesByProfile[
				profilesManagement$.profiles.activeAllycode.get()
			].get();
		},
		indicesByProfile: {},
		addProfile: (allycode: string) => {
			incrementalOptimization$.indicesByProfile.set({
				...incrementalOptimization$.indicesByProfile.peek(),
				[allycode]: null,
			});
		},
		reset: () => {
			syncStatus$.reset();
		},
		deleteProfile: (allycode: string) => {
			incrementalOptimization$.indicesByProfile[allycode].delete();
		},
	});

const syncStatus$ = syncObservable(
	incrementalOptimization$.indicesByProfile,
	persistOptions({
		persist: {
			name: "IncrementalOptimization",
			indexedDB: {
				itemID: "indicesByProfile",
			},
		},
		initial: {},
	}),
);
console.log("Waiting for IncrementalOptimization to load");
await when(syncStatus$.isPersistLoaded);
console.log("IncrementalOptimization loaded");
/*
(async () => {
	await when(syncStatus$.isPersistLoaded);
})();
*/

export { incrementalOptimization$ };
