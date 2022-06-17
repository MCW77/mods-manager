// domain
import { CharacterNames } from "../constants/characterSettings";


export type GIMOStatNames =
  | 'Health'
  | 'Protection'
  | 'Health+Protection'
  | 'Speed'
  | 'Critical Damage'
  | 'Potency'
  | 'Tenacity'
  | 'Physical Damage'
  | 'Physical Critical Chance'
  | 'Armor'
  | 'Special Damage'
  | 'Special Critical Chance'
  | 'Resistance'
  | 'Accuracy'
  | 'Critical Avoidance'
;

export type FlatTargetStatEntry = {
  key: string
  target: FlatTargetStat
}

export type TargetStatEntry = {
  key: string
  target: TargetStat
}

export type FlatTargetStats = FlatTargetStatEntry[];
export type TargetStats = TargetStatEntry[];

export interface FlatTargetStat {
  stat: GIMOStatNames
  type?: string
  minimum?: number
  maximum?: number
  relativeCharacterId: CharacterNames | 'null'
  optimizeForTarget: boolean
}

export class TargetStat {
  stat; // {String} The type of stat being targeted
  type; // {String} The operation to apply to the min and max (* or +)
  minimum; // {TargetValue} The minimum value for the stat
  maximum; // {TargetValue} The maximum value for the stat
  relativeCharacterId: CharacterNames | 'null'; // {String} A character to use as a basis for this target

  /**
   * {Boolean} Whether to run the optimization against this target (true) or
   *           only report against it in results (false)
   */
  optimizeForTarget: boolean;

  static possibleTargetStats: Readonly<GIMOStatNames[]> = [
    'Health',
    'Protection',
    'Health+Protection',
    'Speed',
    'Critical Damage',
    'Potency',
    'Tenacity',
    'Physical Damage',
    'Physical Critical Chance',
    'Armor',
    'Special Damage',
    'Special Critical Chance',
    'Resistance',
    'Accuracy',
    'Critical Avoidance',
  ] as const;


  constructor(
    stat: GIMOStatNames,
    type?: string,
    minimum?: number,
    maximum?: number,
    relativeCharacterId: CharacterNames | 'null' = 'null',
    optimizeForTarget = true,
  ) {
    this.stat = stat;
    this.type = type;
    this.minimum = minimum;
    this.maximum = maximum;
    this.relativeCharacterId = relativeCharacterId;
    this.optimizeForTarget = optimizeForTarget;

    Object.freeze(this);
  }

  static deserialize(flatTargetStat: FlatTargetStat) {
    return new TargetStat(
      flatTargetStat.stat,
      flatTargetStat.type,
      flatTargetStat.minimum,
      flatTargetStat.maximum,
      flatTargetStat.relativeCharacterId,
      flatTargetStat.optimizeForTarget,
    )
  }
}
