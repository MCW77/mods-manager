/**
 * Class to hold information about how a particular player is using the optimizer - their character setup and mods
 */
import { mapValues } from "lodash-es";

import * as ModTypes from "./types/ModTypes";
import { CharacterNames } from "constants/characterSettings";

import { Character, Characters, FlatCharacters, ICharacter } from "./Character";
import { Mod } from "./Mod";
import { OptimizationPlan, FlatOptimizationPlan } from "./OptimizationPlan";
import OptimizerRun from "./OptimizerRun";

import { SelectedCharacters, FlatSelectedCharacters } from "./SelectedCharacters";
import { TargetStat, FlatTargetStat } from "./TargetStat";
import { PlayerValuesByCharacter } from "modules/profilesManagement/domain/PlayerValues";


type FlatMissedGoals = [FlatTargetStat, number][];
export type MissedGoals = [TargetStat, number][];

export interface IFlatModSuggestion {
  id: CharacterNames;
  target: FlatOptimizationPlan;
  assignedMods: string[];
  missedGoals: FlatMissedGoals;
  messages?: string[];

}
export interface IModSuggestion {
  id: CharacterNames;
  target: OptimizationPlan;
  assignedMods: string[];
  missedGoals: MissedGoals;
  messages?: string[];
}

export interface IGlobalSettings {
  modChangeThreshold: number;
  lockUnselectedCharacters: boolean;
  forceCompleteSets: boolean;
};

export interface IFlatPlayerProfile {
  allyCode: string;
  playerName: string;
  characters: {[key in CharacterNames]: ICharacter};
  mods: ModTypes.GIMOFlatMod[];
  selectedCharacters: FlatSelectedCharacters;
  modAssignments: IFlatModSuggestion[];
  globalSettings: IGlobalSettings;
  hotUtilsSessionId?: string | null;
  incrementalOptimizeIndex: number | null
}

export class PlayerProfile {
  allyCode: string;
  playerName: string;
  characters: Characters;
  playerValues: PlayerValuesByCharacter
  mods: Mod[];
  selectedCharacters: SelectedCharacters;
  modAssignments: IModSuggestion[];
  globalSettings: IGlobalSettings;
  hotUtilsSessionId: string | null;
  incrementalOptimizeIndex: number | null;

  static Default: PlayerProfile = new PlayerProfile(
    "",
    "",
    {} as PlayerValuesByCharacter,
    {} as Characters,
    [],
    [],
    [],
    {
      modChangeThreshold: 0,
      lockUnselectedCharacters: true,
      forceCompleteSets: true
    },
    null,
    null,
  );

  static defaultGlobalSettings: IGlobalSettings = {
    modChangeThreshold: 0,
    lockUnselectedCharacters: false,
    forceCompleteSets: false
  };

  /**
   * @param allyCode {string} The ally code for the player whose data this is
   * @param playerName {string} The player name associated with this profile
   * @param characters {Object<string, Character>} A map from character IDs to character objects
   * @param mods {Array<Mod>} An array of Mods
   * @param selectedCharacters {Array<ISelectedCharacter>} An array of Objects with Character IDs and OptimizationPlans
   * @param modAssignments {Array<Object>} An array of character definitions and assigned mods
   * @param globalSettings {Object} An object containing settings that apply in the context of a player, rather than a
   *                                character
   * @param incrementalOptimizeIndex {number | null} Specify to terminate optimization at a specific character, for incremental optimization
   * @param previousSettings {Object} Deprecated - An object that holds the previous values for characters, mods,
   *                                  selectedCharacters, and modChangeThreshold. If none of these have changed, then
   *                                  modAssignments shouldn't change on a reoptimization.
   */
  constructor(
    allyCode: string,
    playerName: string,
    playerValues: PlayerValuesByCharacter = {} as PlayerValuesByCharacter,
    characters: Characters = {} as Characters,
    mods: Mod[] = [],
    selectedCharacters: SelectedCharacters = [],
    modAssignments: IModSuggestion[] = [],
    globalSettings: IGlobalSettings = PlayerProfile.defaultGlobalSettings,
    hotUtilsSessionId: string | null = null,
    incrementalOptimizeIndex: number | null = null,
  ) {
    this.allyCode = allyCode;
    this.playerName = playerName;
    this.playerValues = playerValues;
    this.characters = characters;
    this.mods = mods;
    this.selectedCharacters = selectedCharacters;
    this.modAssignments = modAssignments;
    this.globalSettings = globalSettings;
    this.hotUtilsSessionId = hotUtilsSessionId;
    this.incrementalOptimizeIndex = incrementalOptimizeIndex;
  }

  withPlayerName(name: string) {
    if (name) {
      return new PlayerProfile(
        this.allyCode,
        name,
        this.playerValues,
        this.characters,
        this.mods,
        this.selectedCharacters,
        this.modAssignments,
        this.globalSettings,
        this.hotUtilsSessionId,
        this.incrementalOptimizeIndex,
      )
    } else {
      return this;
    }
  }

  withCharacters(characters: Characters) {
    if (characters) {
      return new PlayerProfile(
        this.allyCode,
        this.playerName,
        this.playerValues,
        characters,
        this.mods,
        this.selectedCharacters,
        this.modAssignments,
        this.globalSettings,
        this.hotUtilsSessionId,
        this.incrementalOptimizeIndex,
      );
    } else {
      return this;
    }
  }

  withMods(mods: Mod[]) {
    if (mods) {
      return new PlayerProfile(
        this.allyCode,
        this.playerName,
        this.playerValues,
        this.characters,
        mods,
        this.selectedCharacters,
        this.modAssignments,
        this.globalSettings,
        this.hotUtilsSessionId,
        this.incrementalOptimizeIndex,
      );
    } else {
      return this;
    }
  }

  withSelectedCharacters(selectedCharacters: SelectedCharacters) {
    if (selectedCharacters) {
      return new PlayerProfile(
        this.allyCode,
        this.playerName,
        this.playerValues,
        this.characters,
        this.mods,
        selectedCharacters,
        this.modAssignments,
        this.globalSettings,
        this.hotUtilsSessionId,
        this.incrementalOptimizeIndex,
      );
    } else {
      return this;
    }
  }

  withModAssignments(modAssignments: IModSuggestion[]) {
    if (modAssignments) {
      // TODO 
/*
      this.mods.forEach((mod: Mod, i: number, mods: Mod[]) => {
        mod.assignedID = modAssignments.includes(mod.characterID) ? mod.characterID : 'null'
      });
*/
      return new PlayerProfile(
        this.allyCode,
        this.playerName,
        this.playerValues,
        this.characters,
        this.mods,
        this.selectedCharacters,
        modAssignments,
        this.globalSettings,
        this.hotUtilsSessionId,
        this.incrementalOptimizeIndex,
      );
    } else {
      return this;
    }
  }

  withGlobalSettings(globalSettings: IGlobalSettings) {
    return new PlayerProfile(
      this.allyCode,
      this.playerName,
      this.playerValues,
      this.characters,
      this.mods,
      this.selectedCharacters,
      this.modAssignments,
      globalSettings,
      this.hotUtilsSessionId,
      this.incrementalOptimizeIndex,
    );
  }

  withHotUtilsSessionId(id: string | null) {
    if (id === null) return this;
    return new PlayerProfile(
      this.allyCode,
      this.playerName,
      this.playerValues,
      this.characters,
      this.mods,
      this.selectedCharacters,
      this.modAssignments,
      this.globalSettings,
      id,
      this.incrementalOptimizeIndex,
    )
  }

  withOptimizeIndex(index: number | null) {
    return new PlayerProfile(
      this.allyCode,
      this.playerName,
      this.playerValues,
      this.characters,
      this.mods,
      this.selectedCharacters,
      this.modAssignments,
      this.globalSettings,
      this.hotUtilsSessionId,
      index,
    );
  }
  
  /**
   * Convert this full PlayerProfile into only what is needed to store the values form an optimizer run
   * @returns OptimizerRun
   */
  toOptimizerRun() {
    return new OptimizerRun(
      this.allyCode,
      mapValues(this.characters, (character: Character) => character.serialize()) as FlatCharacters,
      this.mods.map(mod => mod.serialize()),
      this.selectedCharacters,
      this.globalSettings,
    );
  }

  serialize() {
    return {
      allyCode: this.allyCode,
      playerName: this.playerName,
      characters: mapValues(this.characters, (character: Character) =>
        'function' === typeof character.serialize ? character.serialize() : character
      ),
      mods: this.mods.map(mod => mod.serialize()),
      selectedCharacters: this.selectedCharacters.map(({ id, target }) => ({ id: id, target: target!.serialize() })),
      modAssignments: this.modAssignments,
      globalSettings: this.globalSettings,
      hotUtilsSessionId: this.hotUtilsSessionId,
      incrementalOptimizeIndex: this.incrementalOptimizeIndex,
    };
  }

  static deserialize(flatPlayerProfile: IFlatPlayerProfile): PlayerProfile {
    if (flatPlayerProfile) {
      return new PlayerProfile(
        flatPlayerProfile.allyCode,
        flatPlayerProfile.playerName,
        {} as PlayerValuesByCharacter,
        mapValues(flatPlayerProfile.characters, Character.deserialize) as Characters,
        flatPlayerProfile.mods.map(Mod.deserialize),
        flatPlayerProfile.selectedCharacters.map(({ id, target }) => ({ id: id, target: OptimizationPlan.deserialize(target) })),
        
        flatPlayerProfile.modAssignments.map(({id, target, assignedMods, missedGoals, messages}) => {
                    return {
            id: id,
            target: OptimizationPlan.deserialize(target),
            assignedMods: assignedMods,
            missedGoals: missedGoals.map((missedGoal) => {
              let [targetStat, goalValue] = missedGoal;
              return [TargetStat.deserialize(targetStat), goalValue]
            }),
            messages: messages
          }  as IModSuggestion
        }) as IModSuggestion[],
        Object.assign({}, PlayerProfile.defaultGlobalSettings, flatPlayerProfile.globalSettings),
        flatPlayerProfile.hotUtilsSessionId || null,
        flatPlayerProfile.incrementalOptimizeIndex || null,
      )
    } else {
      return PlayerProfile.Default;
    }
  }

}

