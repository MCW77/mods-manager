// domain
import { FlatOptimizationPlan, OptimizationPlan } from "./OptimizationPlan";


export const DamageType = {
  'physical': 1,
  'special': 0,
  'mixed': .5
} as const;

export interface ICharacterSettings {
  targets: FlatOptimizationPlan[];
  extraTags: string[];
  damageType: number;
}

export class CharacterSettings implements ICharacterSettings {
  targets: OptimizationPlan[];
  extraTags: string [];
  damageType: number;

  /**
   * @param targets Array(OptimizationPlan) A default list of optimization targets to apply to a character. The first
   *                                        target is the default selected target when loading a character for the first
   *                                        time.
   * @param extraTags Array(String) A list of tags that are searchable for a character, even though they are not listed
   *                                in-game.
   * @param damageType DamageType The type of damage done by this character. This is only used to convert very old
   *                              optimization targets to a more recent format.
   */
  constructor(targets: OptimizationPlan[] = [], extraTags: string[] = [], damageType: number = DamageType.physical) {
    this.targets = targets;
    this.extraTags = extraTags;
    this.damageType = damageType;
    Object.freeze(this);
  }

  serialize() {
    return {
      targets: this.targets.map(target => target.serialize()),
      extraTags: this.extraTags,
      damageType: this.damageType
    };
  }

  static deserialize(flatSettings: ICharacterSettings) {
    if (flatSettings) {
      return new CharacterSettings(
        flatSettings.targets.map(target => OptimizationPlan.deserialize(target)),
        flatSettings.extraTags,
        flatSettings.damageType
      );
    } else {
      return null;
    }
  }
}