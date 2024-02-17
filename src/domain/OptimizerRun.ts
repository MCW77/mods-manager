// domain
import { GIMOFlatMod } from "./types/ModTypes";

import * as Character from "./Character";
import { IGlobalSettings } from "./PlayerProfile";
import { SelectedCharacters } from "./SelectedCharacters";

export interface OptimizerRun {
  allyCode: string;
  characters: Character.Characters;
  mods: GIMOFlatMod[];
  selectedCharacters: SelectedCharacters;
  globalSettings: IGlobalSettings;
};

export const createOptimizerRun = (
  allyCode: string,
  characters: Character.Characters,
  mods: GIMOFlatMod[],
  selectedCharacters: SelectedCharacters,
  globalSettings: IGlobalSettings,
): OptimizerRun => {
  return {
    allyCode,
    characters,
    mods,
    selectedCharacters,
    globalSettings
  };
};
