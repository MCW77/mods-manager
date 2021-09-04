import * as UtilityTypes from "../../utils/typeHelper";
import * as ModTypes from "../types/ModTypes";
import { SetNames } from "./SetTypes";

export type NeutralPrimaryStats = 'Speed' | 'Potency %' | 'Resistance %';
export type OffensivePrimaryStats = 'Offense %' | 'Crit Chance %' | 'Crit Damage %' | 'Accuracy %';
export type DefensivePrimaryStats = 'Defense %' | 'Health %' | 'Protection %' | 'Crit Avoidance %';
export type PrimaryStats = NeutralPrimaryStats | OffensivePrimaryStats | DefensivePrimaryStats;

export type NeutralSecondaryStats = 'Potency %' | 'Resistance %' | 'Speed';
export type OffensiveSecondaryStats = 'Offense' | 'Offense %' | 'Crit Chance %';
export type DefensiveSecondaryStats = 'Defense' | 'Health' | 'Protection' | 'Defense %' | 'Health %' | 'Protection %';
export type SecondaryStats = NeutralSecondaryStats | OffensiveSecondaryStats | DefensiveSecondaryStats;
export type SecondaryStatsWithoutSpeed = OffensiveSecondaryStats | DefensiveSecondaryStats | 'Potency %' | 'Resistance %';

export type CalculatedStats = 'Physical Damage' | 'Special Damage' | 'Physical Critical Chance%' | 'Special Critical Chance%';
export type HotUtilsStatNames = PrimaryStats | SecondaryStats | SetNames;
export type AllStats = HotUtilsStatNames | CalculatedStats;

// #region AnyStat
export type DisplayStatNames =
  'Health' |
  'Protection' |
  'Speed' |
  'Critical Damage' |
  'Potency' |
  'Tenacity' |
  'Offense' |
  'Physical Damage' |
  'Special Damage' |
  'Critical Chance' |
  'Physical Critical Chance' |
  'Special Critical Chance' |
  'Defense' |
  'Armor' |
  'Resistance' |
  'Accuracy' |
  'Critical Avoidance'
;
// #endregion

export type Modifier = '%' | '';

// #region StatType
export type StatType =
  'Health' |
  'Health%' |
  'Protection' |
  'Protection%' |
  'Speed' |
  'Critical Damage%' |
  'Potency%' |
  'Tenacity%' |
  'Offense' |
  'Offense%' |
  'Physical Damage' |
  'Special Damage' |
  'Critical Chance%' |
  'Physical Critical Chance%' |
  'Special Critical Chance%' |
  'Defense' |
  'Defense%' |
  'Armor' |
  'Resistance' |
  'Accuracy%' |
  'Critical Avoidance%'
;
// #endregion


// #region GIMOStatTypeWithoutCC
export type GIMOStatTypeWithoutCC =
'health' |
'protection' |
'speed' |
'critDmg' |
'potency' |
'tenacity' |
'physDmg' |
'specDmg' |
//
'defense' |
//
'armor' |
'resistance' |
'accuracy' |
'critAvoid'
;
//#endregion

export type GIMOStatType = GIMOStatTypeWithoutCC | 'specCritChance' | 'physCritChance';

export type PipsToValuesMap = {
  [key in ModTypes.StrPips]: string;
};

export type SecondaryToUpgradeFactorMap = UtilityTypes.ExpandRecursively<{
  [key in SecondaryStatsWithoutSpeed]: number;
}>;

export type StatTypeMap = UtilityTypes.ExpandRecursively<Readonly<{
  [key in DisplayStatNames]: UtilityTypes.ExpandRecursively<Readonly<GIMOStatType[]>>;
}>>

