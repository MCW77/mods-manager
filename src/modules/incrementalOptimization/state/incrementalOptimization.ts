// state
import { type ObservableObject, observable } from "@legendapp/state";
import { syncObservable } from "@legendapp/state/sync";

import { profilesManagement$ } from "#/modules/profilesManagement/state/profilesManagement";

type IndicesByProfile = Record<string, number | null>;
interface IncrementalOptimization {
	activeIndex: () => number | null;
	indicesByProfile: IndicesByProfile;
	addProfile: (allyCode: string) => void;
	clearProfiles: () => void;
	deleteProfile: (allyCode: string) => void;
}

export const incrementalOptimization$: ObservableObject<IncrementalOptimization> =
	observable<IncrementalOptimization>({
		activeIndex: () => {
			return incrementalOptimization$.indicesByProfile[
					profilesManagement$.profiles.activeAllycode.get()
				].get();
		},
		indicesByProfile: {},
		addProfile: (allyCode: string) => {
			incrementalOptimization$.indicesByProfile.set({
				...incrementalOptimization$.indicesByProfile.peek(),
				[allyCode]: null,
			});
		},
		clearProfiles: () => {
			incrementalOptimization$.indicesByProfile.set({});
		},
		deleteProfile: (allyCode: string) => {
			incrementalOptimization$.indicesByProfile[allyCode].delete();
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
