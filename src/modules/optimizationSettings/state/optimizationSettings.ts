// state
import { observable } from "@legendapp/state";
import { persistObservable } from "@legendapp/state/persist"

export interface ProfileOptimizationSettings {
  forceCompleteSets: boolean;
  lockUnselectedCharacters: boolean;
  modChangeThreshold: number;
  simulate6EModSlice: boolean;
}

type SettingsByProfile = Record<string, ProfileOptimizationSettings>;

interface OptimizationSettings {
  settingsByProfile: SettingsByProfile;
  addProfile: (allyCode: string) => void;
  clearProfiles: () => void;
  deleteProfile: (allyCode: string) => void;
}

export const optimizationSettings$ = observable<OptimizationSettings>(
  {
    settingsByProfile: {},
    addProfile: (allyCode: string) => {
      return optimizationSettings$.settingsByProfile.set({
        ...optimizationSettings$.settingsByProfile.peek(),
        [allyCode]: {
          forceCompleteSets: false,
          lockUnselectedCharacters: false,
          modChangeThreshold: 0,
          simulate6EModSlice: false,
        },
      });
    },
    clearProfiles: () => {
      optimizationSettings$.settingsByProfile.set({});
    },
    deleteProfile: (allyCode: string) => {
      optimizationSettings$.settingsByProfile[allyCode].delete();
    },
  },
);

persistObservable(optimizationSettings$.settingsByProfile, {
  local: {
    name: "OptimizationSettings",
    indexedDB: {
      itemID: "settingsByProfile",
    },
  },
});
