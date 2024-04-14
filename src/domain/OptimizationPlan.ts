// utils
import areObjectsEquivalent from "#/utils/areObjectsEquivalent";

// state
import { optimizationSettings$ } from "#/modules/optimizationSettings/state/optimizationSettings";

// domain
import { CharacterNames } from "#/constants/characterSettings";
import type * as ModTypes from "#/domain/types/ModTypes";

import { SetRestrictions } from "#/domain/SetRestrictions";
import { PrimaryStats } from "#/domain/Stats";
import { TargetStats } from "#/domain/TargetStat";

// #region OptimizableStats
export type OptimizableStats =
  | "Health"
  | "Protection"
  | "Speed"
  | "Critical Damage %"
  | "Potency %"
  | "Tenacity %"
  | "Physical Damage"
  | "Special Damage"
  | "Critical Chance"
  | "Armor"
  | "Resistance"
  | "Accuracy %"
  | "Critical Avoidance %"
;
// #endregion

export const statWeights = {
  'Health': 2000,
  'Protection': 4000,
  'Speed': 20,
  'Critical Damage %': 30,
  'Potency %': 15,
  'Tenacity %': 15,
  'Physical Damage': 300,
  'Special Damage': 600,
  'Offense': 300,
  'Critical Chance': 10,
  'Armor': 33,
  'Resistance': 33,
  'Accuracy %': 10,
  'Critical Avoidance %': 10,
};

export const createOptimizationPlan = (
  name: string,
  health: number = 0,
  protection: number = 0,
  speed: number = 0,
  critDmg: number = 0,
  potency: number = 0,
  tenacity: number = 0,
  physDmg: number = 0,
  specDmg: number = 0,
  critChance: number = 0,
  armor: number = 0,
  resistance: number = 0,
  accuracy: number = 0,
  critAvoid: number = 0,
  primaryStatRestrictions = {},
  setRestrictions: SetRestrictions = {},
  targetStats: TargetStats = [],
  useOnlyFullSets = false,
) => {
  return {
    name: name,
    primaryStatRestrictions: primaryStatRestrictions as PrimaryStatRestrictions,
    setRestrictions: setRestrictions,
    targetStats: targetStats,
    useOnlyFullSets: useOnlyFullSets,

    Health: health || 0,
    Protection: protection || 0,
    Speed: speed || 0,
    'Critical Damage %': critDmg || 0,
    'Potency %': potency || 0,
    'Tenacity %': tenacity || 0,
    'Physical Damage': physDmg || 0,
    'Special Damage': specDmg || 0,
    'Critical Chance': critChance || 0,
    Armor: armor || 0,
    Resistance: resistance || 0,
    'Accuracy %': accuracy || 0,
    'Critical Avoidance %': critAvoid || 0,
  }
}

export const normalize = (plan: OptimizationPlan) => {
  return {
    ...plan,
    Health: (plan.Health || 0) / statWeights.Health,
    Protection: (plan.Protection || 0) / statWeights.Protection,
    Speed: (plan.Speed || 0) / statWeights.Speed,
    'Critical Damage %': (plan["Critical Damage %"] || 0) / statWeights['Critical Damage %'],
    'Potency %': (plan["Potency %"] || 0) / statWeights['Potency %'],
    'Tenacity %': (plan["Tenacity %"] || 0) / statWeights['Tenacity %'],
    'Physical Damage': (plan["Physical Damage"] || 0) / statWeights['Physical Damage'],
    'Special Damage': (plan["Special Damage"] || 0) / statWeights['Special Damage'],
    'Critical Chance': (plan["Critical Chance"] || 0 ) / statWeights['Critical Chance'],
    Armor: (plan.Armor || 0) / statWeights.Armor,
    Resistance: (plan.Resistance || 0) / statWeights.Resistance,
    'Accuracy %': (plan["Accuracy %"] || 0) / statWeights['Accuracy %'],
    'Critical Avoidance %': (plan["Critical Avoidance %"] || 0) / statWeights['Critical Avoidance %'],
  }
}

export const denormalize = (plan: OptimizationPlan) => {
  return {
    ...plan,
    Health: (plan.Health || 0) * statWeights.Health,
    Protection: (plan.Protection || 0) * statWeights.Protection,
    Speed: (plan.Speed || 0) * statWeights.Speed,
    'Critical Damage %': (plan["Critical Damage %"] || 0) * statWeights['Critical Damage %'],
    'Potency %': (plan["Potency %"] || 0) * statWeights['Potency %'],
    'Tenacity %': (plan["Tenacity %"] || 0) * statWeights['Tenacity %'],
    'Physical Damage': (plan["Physical Damage"] || 0) * statWeights['Physical Damage'],
    'Special Damage': (plan["Special Damage"] || 0) * statWeights['Special Damage'],
    'Critical Chance': (plan["Critical Chance"] || 0 ) * statWeights['Critical Chance'],
    Armor: (plan.Armor || 0) * statWeights.Armor,
    Resistance: (plan.Resistance || 0) * statWeights.Resistance,
    'Accuracy %': (plan["Accuracy %"] || 0) * statWeights['Accuracy %'],
    'Critical Avoidance %': (plan["Critical Avoidance %"] || 0) * statWeights['Critical Avoidance %'],
  }
}

export const toRenamed = (plan: OptimizationPlan, name: string) => {
  return {
    ...plan,
    name: name
  }
}

export const shouldUpgradeMods = (target: OptimizationPlan) => {
  return optimizationSettings$.activeSettings.simulateLevel15Mods.peek() || target.targetStats.length > 0;
}

export const hasRestrictions = (target: OptimizationPlan) => {
  return Object.values(target.primaryStatRestrictions).filter(primary => !!primary).length ||
    !areObjectsEquivalent({}, target.setRestrictions);
}

export const isBlank = (target: OptimizationPlan) => {
  return (
    target.Health === 0 &&
    target.Protection === 0 &&
    target.Speed === 0 &&
    target['Critical Damage %'] === 0 &&
    target['Potency %'] === 0 &&
    target['Tenacity %'] === 0 &&
    target['Physical Damage'] === 0 &&
    target['Special Damage'] === 0 &&
    target['Critical Chance'] === 0 &&
    target.Armor === 0 &&
    target.Resistance === 0 &&
    target['Accuracy %'] === 0 &&
    target['Critical Avoidance %'] === 0
  )
}

export const hasNegativeWeights = (target: OptimizationPlan) => {
  return (
    target['Accuracy %'] < 0 ||
    target.Armor < 0 ||
    target['Critical Avoidance %'] < 0 ||
    target['Critical Chance'] < 0 ||
    target['Critical Damage %'] < 0 ||
    target.Health < 0 ||
    target['Physical Damage'] < 0 ||
    target['Potency %'] < 0 ||
    target.Protection < 0 ||
    target.Resistance < 0 ||
    target['Special Damage'] < 0 ||
    target.Speed < 0 ||
    target['Tenacity %'] < 0
  )
}

export const equals = (first: OptimizationPlan, second: OptimizationPlan) => {
  return (
    first.name === second.name &&
    first.Health === second.Health &&
    first.Protection === second.Protection &&
    first.Speed === second.Speed &&
    first['Critical Damage %'] === second['Critical Damage %'] &&
    first['Potency %'] === second['Potency %'] &&
    first['Tenacity %'] === second['Tenacity %'] &&
    first['Physical Damage'] === second['Physical Damage'] &&
    first['Special Damage'] === second['Special Damage'] &&
    first['Critical Chance'] === second['Critical Chance'] &&
    first.Armor === second.Armor &&
    first.Resistance === second.Resistance &&
    first['Accuracy %'] === second['Accuracy %'] &&
    first['Critical Avoidance %'] === second['Critical Avoidance %'] &&
    areObjectsEquivalent(first.primaryStatRestrictions, second.primaryStatRestrictions) &&
    areObjectsEquivalent(first.setRestrictions, second.setRestrictions) &&
    areObjectsEquivalent(first.targetStats, second.targetStats) &&
    first.useOnlyFullSets === second.useOnlyFullSets
  )
}

export type PrimaryStatRestrictions = Record<ModTypes.VariablePrimarySlots, PrimaryStats.GIMOStatNames>;

export interface OptimizationPlan extends Record<OptimizableStats, number>{
  name: string;

  Health: number;
  Protection: number;
  Speed: number;
  'Critical Damage %': number;
  'Potency %': number;
  'Tenacity %': number;
  'Physical Damage': number;
  'Special Damage': number;
  'Critical Chance': number;
  Armor: number;
  Resistance: number;
  'Accuracy %': number;
  'Critical Avoidance %': number;

  primaryStatRestrictions: PrimaryStatRestrictions;
  setRestrictions: SetRestrictions;
  targetStats: TargetStats;
  useOnlyFullSets: boolean;
}

export type OptimizationPlansById = Record<CharacterNames, OptimizationPlan[]>;
