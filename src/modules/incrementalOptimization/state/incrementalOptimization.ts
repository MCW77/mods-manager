// state
import { type ObservableObject, observable, when } from "@legendapp/state";
import { syncObservable } from "@legendapp/state/sync";
import { persistOptions } from "#/utils/globalLegendPersistSettings.js";

const { profilesManagement$ } = await import(
	"#/modules/profilesManagement/state/profilesManagement.js"
);

// domain
import type { IncrementalOptimizationObservable } from "../domain/IncrementalOptimizationObservable.js";

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
await when(syncStatus$.isPersistLoaded);

export { incrementalOptimization$ };
