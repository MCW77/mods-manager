// state
import {
	type ObservableComputed,
	type ObservableObject,
	computed,
	observable,
} from "@legendapp/state";
import { persistObservable } from "@legendapp/state/persist";

import { profilesManagement$ } from "#/modules/profilesManagement/state/profilesManagement";

export interface ProfileOptimizationSettings {
	forceCompleteSets: boolean;
	lockUnselectedCharacters: boolean;
	modChangeThreshold: number;
	simulate6EModSlice: boolean;
	simulateLevel15Mods: boolean;
}

type SettingsByProfile = Record<string, ProfileOptimizationSettings>;

interface OptimizationSettings {
	activeSettings: ObservableComputed<ProfileOptimizationSettings>;
	settingsByProfile: SettingsByProfile;
	addProfile: (allyCode: string) => void;
	clearProfiles: () => void;
	deleteProfile: (allyCode: string) => void;
}

export const optimizationSettings$: ObservableObject<OptimizationSettings> =
	observable<OptimizationSettings>({
		activeSettings: computed<ProfileOptimizationSettings>(
			() =>
				optimizationSettings$.settingsByProfile[
					profilesManagement$.profiles.activeAllycode.get()
				].get() as ProfileOptimizationSettings,
		),
		settingsByProfile: {},
		addProfile: (allyCode: string) => {
			return optimizationSettings$.settingsByProfile.set({
				...optimizationSettings$.settingsByProfile.peek(),
				[allyCode]: {
					forceCompleteSets: false,
					lockUnselectedCharacters: false,
					modChangeThreshold: 0,
					simulate6EModSlice: false,
					simulateLevel15Mods: true,
				},
			});
		},
		clearProfiles: () => {
			optimizationSettings$.settingsByProfile.set({});
		},
		deleteProfile: (allyCode: string) => {
			optimizationSettings$.settingsByProfile[allyCode].delete();
		},
	});

persistObservable(optimizationSettings$.settingsByProfile, {
	local: {
		name: "OptimizationSettings",
		indexedDB: {
			itemID: "settingsByProfile",
		},
	},
});
