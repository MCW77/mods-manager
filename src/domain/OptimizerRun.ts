// domain
import { GIMOFlatMod } from "./types/ModTypes";

import { FlatCharacters } from "./Character";
import { IGlobalSettings } from "./PlayerProfile";
import { SelectedCharacters } from "./SelectedCharacters";


interface FlatOptimizerRun {
  allyCode: string;
  characters: FlatCharacters;
  mods: GIMOFlatMod[];
  selectedCharacters: SelectedCharacters;
  globalSettings: IGlobalSettings;
}

export default class OptimizerRun {
  allyCode: string;
  characters: FlatCharacters;
  mods: GIMOFlatMod[];
  selectedCharacters: SelectedCharacters;
  globalSettings: IGlobalSettings;

  /**
   * Note that all of the parameters for an OptimizerRun are pure Objects - no classes with extra methods built-in
   *
   * @param allyCode {string}
   * @param characters {Object<String, Object>}
   * @param mods {Array<Object>}
   * @param selectedCharacters {Array<Object>}
   * @param globalSettings {Object}
   * @param modChangeThreshold {number}
   * @param lockUnselectedCharacters {boolean}
   */
  constructor(
    allyCode: string,
    characters: FlatCharacters,
    mods: GIMOFlatMod[],
    selectedCharacters: SelectedCharacters,
    globalSettings: IGlobalSettings
  ) {
    this.allyCode = allyCode;
    this.characters = characters;
    this.mods = mods;
    this.selectedCharacters = selectedCharacters;
    this.globalSettings = globalSettings;
  }

  serialize() {
    return {
      allyCode: this.allyCode,
      characters: this.characters,
      mods: this.mods,
      selectedCharacters: this.selectedCharacters.map(({id, target}) => ({id: id, target: target})),
      globalSettings: this.globalSettings
    };
  }

  deserialize(flatRun: FlatOptimizerRun) {
    return new OptimizerRun(
      flatRun.allyCode,
      flatRun.characters,
      flatRun.mods,
      flatRun.selectedCharacters,
      flatRun.globalSettings
    );
  }

}
