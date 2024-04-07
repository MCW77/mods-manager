// state
import { ObservableObject, computed, observable } from "@legendapp/state";
import { persistObservable } from "@legendapp/state/persist";

import { profilesManagement$ } from "#/modules/profilesManagement/state/profilesManagement";

type indicesByProfile = Record<string, number | null>;
interface IncrementalOptimization {
	activeIndex: number | null;
	indicesByProfile: indicesByProfile;
	addProfile: (allyCode: string) => void;
	clearProfiles: () => void;
	deleteProfile: (allyCode: string) => void;
}

export const incrementalOptimization$: ObservableObject<IncrementalOptimization> = observable<IncrementalOptimization>({
	activeIndex: computed<number | null>(() =>
		incrementalOptimization$.indicesByProfile[
			profilesManagement$.profiles.activeAllycode.get()
		].get() as number | null
	),

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

persistObservable(incrementalOptimization$.indicesByProfile, {
	local: {
		name: "IncrementalOptimization",
		indexedDB: {
			itemID: "indicesByProfile",
		},
	},
});
