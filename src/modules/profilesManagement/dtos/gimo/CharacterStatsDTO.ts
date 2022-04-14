import * as CharacterStatNames from "../../domain/CharacterStatNames"
type CharacterStatNamesIndexer = Record<CharacterStatNames.All, number>;

/**
 * A Representation of the base values of any stats that are modified by mods.
 * All values should be represented as if the character were capped out at 7* g12
 * but had no mods on.
 */

interface CharacterStatsDTO extends CharacterStatNamesIndexer {
  Health: number;
  Protection: number;
  Speed: number;
  'Critical Damage %': number;
  'Potency %': number;
  'Tenacity %': number;
  'Physical Damage': number;
  'Special Damage': number;
  Armor: number;
  Resistance: number;
  'Accuracy %': number;
  'Critical Avoidance %': number;
  'Physical Critical Chance %': number;
  'Special Critical Chance %': number;
}

export type { CharacterStatsDTO };