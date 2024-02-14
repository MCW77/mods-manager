// utils
import areObjectsEquivalent from "#/utils/areObjectsEquivalent";

// domain
import { CharacterNames } from "#/constants/characterSettings";
import type * as ModTypes from "#/domain/types/ModTypes";

import { SetRestrictions } from "#/domain/SetRestrictions";
import { PrimaryStats } from "#/domain/Stats";
import { TargetStats } from "#/domain/TargetStat";

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
  'Critical Avoidance %': 10
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
  upgradeMods = true,
  primaryStatRestrictions = {},
  setRestrictions = {},
  targetStats: TargetStats = [],
  useOnlyFullSets = false
) => {
  return {
    name: name,
    primaryStatRestrictions: primaryStatRestrictions as PrimaryStatRestrictions,
    setRestrictions: setRestrictions as SetRestrictions,
    targetStats: targetStats,
    upgradeMods: upgradeMods,
    useOnlyFullSets: useOnlyFullSets,

    // Set raw values based on exactly what the user entered
    rawHealth: health || 0,
    rawProtection: protection || 0,
    rawSpeed: speed || 0,
    rawCritDmg: critDmg || 0,
    rawPotency: potency || 0,
    rawTenacity: tenacity || 0,
    rawPhysDmg: physDmg || 0,
    rawSpecDmg: specDmg || 0,
    rawCritChance: critChance || 0,
    rawArmor: armor || 0,
    rawResistance: resistance || 0,
    rawAccuracy: accuracy || 0,
    rawCritAvoid: critAvoid || 0,

    // Set the values that will actually be used for scoring based on the weights of each stat
    Health: (health || 0) / statWeights.Health,
    Protection: (protection || 0) / statWeights.Protection,
    Speed: (speed || 0) / statWeights.Speed,
    'Critical Damage %': (critDmg || 0) / statWeights['Critical Damage %'],
    'Potency %': (potency || 0) / statWeights['Potency %'],
    'Tenacity %': (tenacity || 0) / statWeights['Tenacity %'],
    'Physical Damage': (physDmg || 0) / statWeights['Physical Damage'],
    'Special Damage': (specDmg || 0) / statWeights['Special Damage'],
    'Critical Chance': (critChance || 0 ) / statWeights['Critical Chance'],
    Armor: (armor || 0) / statWeights.Armor,
    Resistance: (resistance || 0) / statWeights.Resistance,
    'Accuracy %': (accuracy || 0) / statWeights['Accuracy %'],
    'Critical Avoidance %': (critAvoid || 0) / statWeights['Critical Avoidance %'],
  }
}

export const toRenamed = (plan: OptimizationPlan, name: string) => {
  return {
    ...plan,
    name: name
  }
}

export const shouldUpgradeMods = (target: OptimizationPlan) => {
  return target.upgradeMods || target.targetStats.length > 0;
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
    first.upgradeMods === second.upgradeMods &&
    areObjectsEquivalent(first.primaryStatRestrictions, second.primaryStatRestrictions) &&
    areObjectsEquivalent(first.setRestrictions, second.setRestrictions) &&
    areObjectsEquivalent(first.targetStats, second.targetStats) &&
    first.useOnlyFullSets === second.useOnlyFullSets
  )
}

export type PrimaryStatRestrictions = {
  [key in ModTypes.VariablePrimarySlots]: PrimaryStats.GIMOStatNames
}

export interface OptimizationPlan {
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

  rawHealth: number;
  rawProtection: number;
  rawSpeed: number;
  rawCritDmg: number;
  rawPotency: number;
  rawTenacity: number;
  rawPhysDmg: number;
  rawSpecDmg: number;
  rawCritChance: number;
  rawArmor: number;
  rawResistance: number;
  rawAccuracy: number;
  rawCritAvoid: number;
  primaryStatRestrictions: PrimaryStatRestrictions;
  setRestrictions: SetRestrictions;
  targetStats: TargetStats;
  upgradeMods: boolean;
  useOnlyFullSets: boolean;
}

export type OptimizationPlansById = {
  [id in CharacterNames]: OptimizationPlan[]
}
