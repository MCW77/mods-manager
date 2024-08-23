// state
import { type ObservableObject, observable } from "@legendapp/state";
import { syncObservable } from "@legendapp/state/sync";

import { profilesManagement$ } from "#/modules/profilesManagement/state/profilesManagement";

type IndicesByProfile = Record<string, number | null>;
interface IncrementalOptimization {
	activeIndex: () => number | null;
	indicesByProfile: IndicesByProfile;
	addProfile: (allycode: string) => void;
	clearProfiles: () => void;
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
		clearProfiles: () => {
			incrementalOptimization$.indicesByProfile.set({});
		},
		deleteProfile: (allycode: string) => {
			incrementalOptimization$.indicesByProfile[allycode].delete();
		},
	});

syncObservable(incrementalOptimization$.indicesByProfile, {
	persist: {
		name: "IncrementalOptimization",
		indexedDB: {
			itemID: "indicesByProfile",
		},
	},
});
