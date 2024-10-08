// state
import { type ObservableObject, observable, when } from "@legendapp/state";
import { syncObservable } from "@legendapp/state/sync";

import { profilesManagement$ } from "#/modules/profilesManagement/state/profilesManagement";

type IndicesByProfile = Record<string, number | null>;
interface IncrementalOptimization {
	activeIndex: () => number | null;
	indicesByProfile: IndicesByProfile;
	addProfile: (allycode: string) => void;
	reset: () => void;
	deleteProfile: (allycode: string) => void;
}

export const incrementalOptimization$: ObservableObject<IncrementalOptimization> =
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

const syncStatus$ = syncObservable(incrementalOptimization$.indicesByProfile, {
	persist: {
		name: "IncrementalOptimization",
		indexedDB: {
			itemID: "indicesByProfile",
		},
	},
	initial: {},
});
(async () => {
	await when(syncStatus$.isPersistLoaded);
})();
