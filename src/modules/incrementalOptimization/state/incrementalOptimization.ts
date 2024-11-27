// state
import { type ObservableObject, observable, when } from "@legendapp/state";
import { syncObservable } from "@legendapp/state/sync";
import { persistOptions } from "#/utils/globalLegendPersistSettings";

/*
const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader");

const profilesManagement$ = stateLoader$.profilesManagement$;
*/
const { profilesManagement$ } = await import(
	"#/modules/profilesManagement/state/profilesManagement"
);

// domain
import type { IncrementalOptimizationObservable } from "../domain/IncrementalOptimizationObservable";

const incrementalOptimization$: ObservableObject<IncrementalOptimizationObservable> =
	observable<IncrementalOptimizationObservable>({
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
await when(syncStatus$.isPersistLoaded);

export { incrementalOptimization$ };
