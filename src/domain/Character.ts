import { OptimizationPlan} from "./OptimizationPlan";
import { characterSettings, CharacterNames } from "../constants/characterSettings";
import * as DTOs from "../modules/profilesManagement/dtos";
import { IOptimizerSettings, OptimizerSettings } from "./OptimizerSettings";
import groupByKey from "../utils/groupByKey";

export interface ICharacter {
  baseID: CharacterNames;
  playerValues: DTOs.GIMO.PlayerValuesDTO;
  optimizerSettings: IOptimizerSettings;
};

export type FlatCharacters = {
  [key in CharacterNames]: ICharacter
}

export type Characters = {
  [key in CharacterNames]: Character
}

export class Character implements ICharacter {
  baseID: CharacterNames;
  playerValues: DTOs.GIMO.PlayerValuesDTO;
  optimizerSettings: OptimizerSettings;

  /**
   * @param baseID String
   * @param playerValues {PlayerValues} The player-specific character values from the game, like level, stars, etc.
   * @param optimizerSettings {OptimizerSettings} Settings specific to the optimizer,
   *                                            such as what target to use, and whether to lock mods
   */
  constructor(
    baseID: CharacterNames,
    playerValues: DTOs.GIMO.PlayerValuesDTO,
    optimizerSettings: OptimizerSettings,
  ) {
    this.baseID = baseID;
    this.playerValues = playerValues;
    this.optimizerSettings = optimizerSettings;

    Object.freeze(this);
  }

  /**
   * Return a shallow copy of this character
   */
  clone() {
    return new Character(
      this.baseID,
      Object.assign({}, this.playerValues),
      Object.assign({}, this.optimizerSettings)
    );
  }

  /**
   * Create a new Character object that matches this one, but with playerValues overridden
   * @param playerValues
   */
  withPlayerValues(playerValues: DTOs.GIMO.PlayerValuesDTO) {
    if (playerValues) {
      return new Character(
        this.baseID,
        playerValues,
        this.optimizerSettings
      );
    } else {
      return this;
    }
  }

  /**
   * Create a new Character object that matches this one, but with optimizerSettings overridden
   * @param optimizerSettings
   */
  withOptimizerSettings(optimizerSettings: OptimizerSettings) {
    return new Character(
      this.baseID,
      this.playerValues,
      optimizerSettings
    );
  }

  /**
   * Reset the current target to match the default, and update it in optimizer settings as well
   */
  withResetTarget(targetName: string) {
    const target = characterSettings[this.baseID] ?
      characterSettings[this.baseID].targets.find(target => target.name === targetName)!
    :
      null
    return new Character(
      this.baseID,
      this.playerValues,
      this.optimizerSettings.withTarget(target)
    );
  }

  /**
   * Return a new Character object that matches this one, but with all targets reset to match their defaults
   */
  withResetTargets() {
    return new Character(
      this.baseID,
      this.playerValues,
      this.optimizerSettings.withTargetOverrides(
        characterSettings[this.baseID] ? characterSettings[this.baseID].targets : []
      )
    );
  }

  /**
   * Return a new Character object that matches this one, but with the given target deleted
   * @param targetName {String} The name of the target to delete
   */
  withDeletedTarget(targetName: string) {
    const newOptimizerSettings =
      this.optimizerSettings.withDeletedTarget(targetName);

    return new Character(
      this.baseID,
      this.playerValues,
      newOptimizerSettings
    );
  }

  /**
   * Get a set of all targets that can be set for this character
   */
  targets() {
    const defaultTargets = groupByKey(
      characterSettings[this.baseID] ? characterSettings[this.baseID].targets : [],
      target => target.name
    );
    const playerTargets = groupByKey(this.optimizerSettings.targets, target => target.name);

    return Object.values(Object.assign({}, defaultTargets, playerTargets));
  }

  defaultTarget() {
    return this.targets()[0] || new OptimizationPlan('unnamed');
  }

  /**
   * Comparison function useful for sorting characters by Galactic Power. If that has a higher GP, returns a value > 0.
   * If this has a higher GP, returns a value < 0. If the GPs are the same, returns a value to sort by character name.
   * @param that Character
   */
  compareGP(that: Character) {
    if (that.playerValues.galacticPower === this.playerValues.galacticPower) {
      return this.baseID.localeCompare(that.baseID);
    }
    return that.playerValues.galacticPower - this.playerValues.galacticPower;
  }

  serialize() {
    return {
      baseID: this.baseID,
      playerValues: this.playerValues,
      optimizerSettings: this.optimizerSettings.serialize()
    } as ICharacter;

    
  }

  static deserialize(character: ICharacter) {
    return new Character(
      character.baseID,
      character.playerValues,
      OptimizerSettings.deserialize(character.optimizerSettings) ?? OptimizerSettings.Default
    );
  }
}
