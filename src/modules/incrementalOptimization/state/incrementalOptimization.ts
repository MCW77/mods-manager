// state
import { observable } from "@legendapp/state";
import { persistObservable } from "@legendapp/state/persist";

type indicesByProfile = Record<string, number | null>;
interface IncrementalOptimization {
	indicesByProfile: indicesByProfile;
	addProfile: (allyCode: string) => void;
	clearProfiles: () => void;
	deleteProfile: (allyCode: string) => void;
}

export const incrementalOptimization$ = observable<IncrementalOptimization>({
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
		name: "OptimizationSettings",
		indexedDB: {
			itemID: "indicesByProfile",
		},
	},
});
