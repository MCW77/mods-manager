// state
import { type ObservableObject, observable, when } from "@legendapp/state";
import { syncObservable } from "@legendapp/state/sync";
import { persistOptions } from "#/utils/globalLegendPersistSettings";

import { profilesManagement$ } from "#/modules/profilesManagement/state/profilesManagement";

// domain
import type { ProfileOptimizationSettings } from "../domain/ProfileOptimizationSettings";

type SettingsByProfile = Record<string, ProfileOptimizationSettings>;

interface OptimizationSettings {
	activeSettings: () => ProfileOptimizationSettings;
	settingsByProfile: SettingsByProfile;
	addProfile: (allycode: string) => void;
	reset: () => void;
	deleteProfile: (allycode: string) => void;
}

const optimizationSettings$: ObservableObject<OptimizationSettings> =
	observable<OptimizationSettings>({
		activeSettings: () => {
			return optimizationSettings$.settingsByProfile[
				profilesManagement$.profiles.activeAllycode.get()
			].get() as ProfileOptimizationSettings;
		},
		settingsByProfile: {},
		addProfile: (allycode: string) => {
			return optimizationSettings$.settingsByProfile.set({
				...optimizationSettings$.settingsByProfile.peek(),
				[allycode]: {
					forceCompleteSets: false,
					lockUnselectedCharacters: false,
					modChangeThreshold: 0,
					simulate6EModSlice: false,
					simulateLevel15Mods: true,
					optimizeWithPrimaryAndSetRestrictions: false,
				},
			});
		},
		reset: () => {
			syncStatus$.reset();
		},
		deleteProfile: (allycode: string) => {
			optimizationSettings$.settingsByProfile[allycode].delete();
		},
	});

const syncStatus$ = syncObservable(
	optimizationSettings$.settingsByProfile,
	persistOptions({
		persist: {
			name: "OptimizationSettings",
			indexedDB: {
				itemID: "settingsByProfile",
			},
		},
		initial: {},
	}),
);
console.log("Waiting for OptimizationSettings to load");
await when(syncStatus$.isPersistLoaded);
console.log("OptimizationSettings loaded");
/*
(async () => {
	await when(syncStatus$.isPersistLoaded);
})();
*/

export { optimizationSettings$ };
