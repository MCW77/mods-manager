import * as StatTypes from "../types/StatTypes";
export {statTypeMap} from "../../constants/statTypeMap";

// import {statTypeMap as statTypeMapImport} from "../../constants/statTypeMap";

// export const statTypeMap = statTypeMapImport;

export const Stats: StatTypes.DisplayStatNames[] = [
  'Health',
  'Protection',
  'Speed',
  'Critical Damage',
  'Potency',
  'Tenacity',
  'Offense',
  'Physical Damage',
  'Special Damage',
  'Critical Chance',
  'Physical Critical Chance',
  'Special Critical Chance',
  'Defense',
  'Armor',
  'Resistance',
  'Accuracy',
  'Critical Avoidance'
];

export const gimoStatTypes: StatTypes.GIMOStatType[] = [
  'health' ,
  'protection' ,
  'speed' ,
  'critDmg' ,
  'potency' ,
  'tenacity' ,
  'physDmg' ,
  'specDmg' ,
  'physCritChance' ,
  'specCritChance' ,
  'armor' ,
  'resistance' ,
  'accuracy' ,
  'critAvoid'
] as StatTypes.GIMOStatType[];

export const modStats = [
  'None',
  'None',
  'Potency %',
  'Critical Chance %',
  'Critical Damage %',
  'Critical Avoidance %',
  'Defense',
  'Defense %',
  'Accuracy %',
  'Health',
  'Health %',
  'Protection',
  'Protection %',
  'Offense',
  'Offense %',
  'Tenacity %',
  'Speed'
] as const;

export const primaryStats = [
  'Accuracy %',
  'Critical Chance %',
  'Critical Damage %',
  'Critical Avoidance %',
  'Defense %',
  'Health %',
  'Offense %',
  'Potency %',
  'Protection %',
  'Speed',
  'Tenacity %',
] as const;

export const secondaryStats = [
  'Critical Chance %',
  'Critical Damage %',
  'Defense',
  'Defense %',
  'Health',
  'Health %',
  'Offense',
  'Offense %',
  'Potency %',
  'Protection',
  'Protection %',
  'Speed',
  'Resistance %',
] as const;