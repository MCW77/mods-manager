// domain
import { GIMOFlatMod } from "./types/ModTypes";
import { ProfileOptimizationSettings } from "#/modules/optimizationSettings/state/optimizationSettings";

import { Characters } from "./Character";
import { SelectedCharacters } from "./SelectedCharacters";

export interface OptimizerRun {
  allyCode: string;
  characters: Characters;
  mods: GIMOFlatMod[];
  selectedCharacters: SelectedCharacters;
  globalSettings: ProfileOptimizationSettings;
};

export const createOptimizerRun = (
  allyCode: string,
  characters: Characters,
  mods: GIMOFlatMod[],
  selectedCharacters: SelectedCharacters,
  globalSettings: ProfileOptimizationSettings,
): OptimizerRun => {
  return {
    allyCode,
    characters,
    mods,
    selectedCharacters,
    globalSettings
  };
};
