// state
import {
	type ObservableObject,
	observable,
} from "@legendapp/state";

import { profilesManagement$ } from "#/modules/profilesManagement/state/profilesManagement";
import { syncObservable } from "@legendapp/state/sync";

export interface ProfileOptimizationSettings {
	forceCompleteSets: boolean;
	lockUnselectedCharacters: boolean;
	modChangeThreshold: number;
	simulate6EModSlice: boolean;
	simulateLevel15Mods: boolean;
	optimizeWithPrimaryAndSetRestrictions: boolean;
}

type SettingsByProfile = Record<string, ProfileOptimizationSettings>;

interface OptimizationSettings {
	activeSettings: () => ProfileOptimizationSettings;
	settingsByProfile: SettingsByProfile;
	addProfile: (allycode: string) => void;
	clearProfiles: () => void;
	deleteProfile: (allycode: string) => void;
}

export const optimizationSettings$: ObservableObject<OptimizationSettings> =
	observable<OptimizationSettings>({
		activeSettings: () => {
			return	optimizationSettings$.settingsByProfile[
					profilesManagement$.profiles.activeAllycode.get()
				].get() as ProfileOptimizationSettings
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
		clearProfiles: () => {
			optimizationSettings$.settingsByProfile.set({});
		},
		deleteProfile: (allycode: string) => {
			optimizationSettings$.settingsByProfile[allycode].delete();
		},
	});

syncObservable(optimizationSettings$.settingsByProfile, {
	persist: {
		name: "OptimizationSettings",
		indexedDB: {
			itemID: "settingsByProfile",
		},
	},
});
