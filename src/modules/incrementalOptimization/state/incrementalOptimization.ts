// state
import { type ObservableObject, observable } from "@legendapp/state";
import { syncObservable } from "@legendapp/state/sync";
import { persistOptions } from "#/utils/globalLegendPersistSettings";

import { profilesManagement$ } from "#/modules/profilesManagement/state/profilesManagement";

// domain
import type { IncrementalOptimizationObservable } from "../domain/IncrementalOptimizationObservable";

const initialIndicesByProfile = {
	id: "indicesByProfile",
	indicesByProfile: {},
} as const;

const incrementalOptimization$: ObservableObject<IncrementalOptimizationObservable> =
	observable<IncrementalOptimizationObservable>({
		activeIndex: () => {
			return incrementalOptimization$.indicesByProfile[
				profilesManagement$.profiles.activeAllycode.get()
			].get();
		},
		persistedData: initialIndicesByProfile,
		indicesByProfile: () => {
			return incrementalOptimization$.persistedData.indicesByProfile;
		},
		addProfile: (allycode: string) => {
			if (
				Object.hasOwn(
					incrementalOptimization$.indicesByProfile.peek(),
					allycode,
				)
			) {
				return;
			}
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

profilesManagement$.lastProfileAdded.onChange(({ value }) => {
	incrementalOptimization$.addProfile(value);
});

profilesManagement$.lastProfileDeleted.onChange(({ value }) => {
	if (value === "all") {
		incrementalOptimization$.reset();
		return;
	}
	incrementalOptimization$.deleteProfile(value);
});

const syncStatus$ = syncObservable(
	incrementalOptimization$.persistedData,
	persistOptions({
		persist: {
			name: "IncrementalOptimization",
			indexedDB: {
				itemID: "indicesByProfile",
			},
		},
		initial: structuredClone(initialIndicesByProfile),
	}),
);

export { incrementalOptimization$, syncStatus$ };
