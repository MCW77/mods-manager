import type * as UtilityTypes from "../../utils/typeHelper";

type TriState = -1 | 0 | 1;

export interface SlotSettings {
  square: TriState,
  arrow: TriState,
  diamond: TriState,
  triangle: TriState,
  circle: TriState,
  cross: TriState
}

export interface SetSettings {
  'Potency %': TriState,
  'Tenacity %': TriState,
  'Speed %': TriState,
  'Offense %': TriState,
  'Defense %': TriState,
  'Critical Chance %': TriState,
  'Critical Damage %': TriState,
  'Health %': TriState
}

export interface RaritySettings {
  1: TriState,
  2: TriState,
  3: TriState,
  4: TriState,
  5: TriState,
  6: TriState,
}

interface ITierSettings {
  "1": TriState,
  "2": TriState,
  "3": TriState,
  "4": TriState,
  "5": TriState,
}

export type TierSettings = UtilityTypes.Indexed<ITierSettings>;

interface ISecondariesScoreTierSettings {
  "1": TriState,
  "2": TriState,
  "3": TriState,
  "4": TriState,
  "5": TriState,
}

export type SecondariesScoreTierSettings = UtilityTypes.Indexed<ISecondariesScoreTierSettings>;

export interface LevelSettings {
  1: TriState,
  2: TriState,
  3: TriState,
  4: TriState,
  5: TriState,
  6: TriState,
  7: TriState,
  8: TriState,
  9: TriState,
  10: TriState,
  11: TriState,
  12: TriState,
  13: TriState,
  14: TriState,
  15: TriState
}

export interface EquippedSettings {
  equipped: TriState,
  unequipped: TriState
}

export interface IPrimarySettings {
  'Accuracy %': TriState,
  'Critical Avoidance %': TriState,
  'Critical Chance %': TriState,
  'Critical Damage %': TriState,
  'Defense %': TriState,
  'Health %': TriState,
  'Offense %': TriState,
  'Potency %': TriState,
  'Protection %': TriState,
  'Speed': TriState,
  'Tenacity %': TriState,
}
export type PrimarySettings = UtilityTypes.Indexed<IPrimarySettings>;

export interface SecondarySettings {
  'Critical Chance %': TriState,
  'Defense %': TriState,
  'Defense': TriState,
  'Offense %': TriState,
  'Offense': TriState,
  'Health %': TriState,
  'Health': TriState,
  'Potency %': TriState,
  'Tenacity %': TriState,
  'Protection %': TriState,
  'Protection': TriState,
  'Speed': TriState
}

export interface OptimizerSettings {
  assigned: TriState,
  unassigned: TriState
}

export const availableFilters = [
  'slot',
  'set',
  'rarity',
  'tier',
  'level',
  'equipped',
  'primary',
  'secondary',
  'optimizer',
  'secondariesscoretier'
] as const;

export type FilterKeys = UtilityTypes.ElementType<typeof availableFilters>;

export interface FilterOptions {
  slot: SlotSettings;
  set: SetSettings;
  rarity: RaritySettings;
  tier: TierSettings;
  level: LevelSettings;
  equipped: EquippedSettings;
  primary: PrimarySettings;
  secondary: SecondarySettings;
  optimizer: OptimizerSettings;
  secondariesscoretier: SecondariesScoreTierSettings;
}

export interface GroupOptions {
  isGroupingEnabled: boolean;
}

export interface SortOptions {

}
export interface ModsViewOptions {
  filtering: FilterOptions;
  sort: string[];
  isGroupingEnabled: boolean;
  modScore: string;
}
