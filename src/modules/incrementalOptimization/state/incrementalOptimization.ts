// state
import { type ObservableObject, observable, when } from "@legendapp/state";
import { syncObservable } from "@legendapp/state/sync";
import { persistOptions } from "#/utils/globalLegendPersistSettings";

const { profilesManagement$ } = await import(
	"#/modules/profilesManagement/state/profilesManagement"
);

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
