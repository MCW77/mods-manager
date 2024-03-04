// domain
import { GIMOFlatMod } from "./types/ModTypes";
import { ProfileOptimizationSettings } from "#/modules/optimization/state/optimization";

import * as Character from "./Character";
import { SelectedCharacters } from "./SelectedCharacters";

export interface OptimizerRun {
  allyCode: string;
  characters: Character.Characters;
  mods: GIMOFlatMod[];
  selectedCharacters: SelectedCharacters;
  globalSettings: ProfileOptimizationSettings;
};

export const createOptimizerRun = (
  allyCode: string,
  characters: Character.Characters,
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
