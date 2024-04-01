// state
import { observable } from "@legendapp/state";
import { configureObservablePersistence, persistObservable } from "@legendapp/state/persist"
import { ObservablePersistIndexedDB } from "@legendapp/state/persist-plugins/indexeddb"


configureObservablePersistence({
  pluginLocal: ObservablePersistIndexedDB,
  localOptions: {
    indexedDB: {
      databaseName: "GIMO",
      version: 1,
      tableNames: ["OptimizationSettings"],
    },
  },
})
export interface ProfileOptimizationSettings {
  forceCompleteSets: boolean;
  lockUnselectedCharacters: boolean;
  modChangeThreshold: number;
  simulate6EModSlice: boolean;
}

export type SettingsByProfile = Record<string, ProfileOptimizationSettings>;

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
      const settingsByProfile = optimizationSettings$.settingsByProfile.peek();
      delete settingsByProfile[allyCode];
      optimizationSettings$.settingsByProfile.set(settingsByProfile);
    },
  },
);

persistObservable(optimizationSettings$.settingsByProfile, {
  pluginLocal: ObservablePersistIndexedDB,
  local: {
    name: "OptimizationSettings",
    indexedDB: {
      itemID: "settingsByProfile",
    },
  },
});
