import areObjectsEquivalent from "../utils/areObjectsEquivalent";
import { TargetStat } from "./TargetStat";

import type * as StatTypes from "./types/StatTypes";
import type * as ModTypes from "./types/ModTypes";
import { CharacterNames } from "constants/characterSettings";

import { PrimaryStats } from "./Stats";
import { SetRestrictions } from "state/storage";

export type PrimaryStatRestrictions = {
  [key in ModTypes.VariablePrimarySlots]: PrimaryStats.GIMOStatNames 
}

interface BaseFlatOptimizationPlan {
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

  upgradeMods: boolean;
  primaryStatRestrictions: PrimaryStatRestrictions;
  setRestrictions: SetRestrictions;
  useOnlyFullSets: boolean;  
}

interface OldFlatOptimizationPlan extends BaseFlatOptimizationPlan {
  targetStat: TargetStat;
}

export interface FlatOptimizationPlan extends BaseFlatOptimizationPlan {
  targetStats: TargetStat[];
}

export type OptimizationPlansById = {
  [id in CharacterNames]: OptimizationPlan[]
}

/**
 * A class to represent the weights that should be applied to each potential stat that a mod can have when
 * trying to optimize the mods assigned to each character. Each weight is on a scale from -100 to 100
 */
export class OptimizationPlan {
  static statWeight = {
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

  upgradeMods: boolean;
  primaryStatRestrictions: PrimaryStatRestrictions;
  setRestrictions: SetRestrictions;
  targetStats: TargetStat[];
  useOnlyFullSets: boolean;

  constructor(
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
    targetStats: TargetStat[] = [],
    useOnlyFullSets = false
  ) {
    this.name = name;
    
    // Set raw values based on exactly what the user entered
    this.rawHealth = health || 0;
    this.rawProtection = protection || 0;
    this.rawSpeed = speed || 0;
    this.rawCritDmg = critDmg || 0;
    this.rawPotency = potency || 0;
    this.rawTenacity = tenacity || 0;
    this.rawPhysDmg = physDmg || 0;
    this.rawSpecDmg = specDmg || 0;
    this.rawCritChance = critChance || 0;
    this.rawArmor = armor || 0;
    this.rawResistance = resistance || 0;
    this.rawAccuracy = accuracy || 0;
    this.rawCritAvoid = critAvoid || 0;

    this.upgradeMods = upgradeMods;

    // Set the values that will actually be used for scoring based on the weights of each stat
    this.Health = this.rawHealth / OptimizationPlan.statWeight.Health;
    this.Protection = this.rawProtection / OptimizationPlan.statWeight.Protection;
    this.Speed = this.rawSpeed / OptimizationPlan.statWeight.Speed;
    this['Critical Damage %'] = this.rawCritDmg / OptimizationPlan.statWeight['Critical Damage %'];
    this['Potency %'] = this.rawPotency / OptimizationPlan.statWeight['Potency %'];
    this['Tenacity %'] = this.rawTenacity / OptimizationPlan.statWeight['Tenacity %'];
    this['Physical Damage'] = this.rawPhysDmg / OptimizationPlan.statWeight['Physical Damage'];
    this['Special Damage'] = this.rawSpecDmg / OptimizationPlan.statWeight['Special Damage'];
    this['Critical Chance'] = this.rawCritChance / OptimizationPlan.statWeight['Critical Chance'];
    this.Armor = this.rawArmor / OptimizationPlan.statWeight.Armor;
    this.Resistance = this.rawResistance / OptimizationPlan.statWeight.Resistance;
    this['Accuracy %'] = this.rawAccuracy / OptimizationPlan.statWeight['Accuracy %'];
    this['Critical Avoidance %'] = this.rawCritAvoid / OptimizationPlan.statWeight['Critical Avoidance %'];

    this.primaryStatRestrictions = primaryStatRestrictions as PrimaryStatRestrictions;
    this.setRestrictions = setRestrictions as SetRestrictions;
    this.targetStats = targetStats;
    this.useOnlyFullSets = useOnlyFullSets;
  }
/*
  constructor fromPlan(plan: Partial<OptimizationPlan>): OptimizationPlan {
    this.name = name;
    
    // Set raw values based on exactly what the user entered
    this.rawHealth = health || 0;
    this.rawProtection = protection || 0;
    this.rawSpeed = speed || 0;
    this.rawCritDmg = critDmg || 0;
    this.rawPotency = potency || 0;
    this.rawTenacity = tenacity || 0;
    this.rawPhysDmg = physDmg || 0;
    this.rawSpecDmg = specDmg || 0;
    this.rawCritChance = critChance || 0;
    this.rawArmor = armor || 0;
    this.rawResistance = resistance || 0;
    this.rawAccuracy = accuracy || 0;
    this.rawCritAvoid = critAvoid || 0;

    this.upgradeMods = upgradeMods;

    // Set the values that will actually be used for scoring based on the weights of each stat
    this.health = this.rawHealth / OptimizationPlan.statWeight.health;
    this.protection = this.rawProtection / OptimizationPlan.statWeight.protection;
    this.speed = this.rawSpeed / OptimizationPlan.statWeight.speed;
    this.critDmg = this.rawCritDmg / OptimizationPlan.statWeight.critDmg;
    this.potency = this.rawPotency / OptimizationPlan.statWeight.potency;
    this.tenacity = this.rawTenacity / OptimizationPlan.statWeight.tenacity;
    this.physDmg = this.rawPhysDmg / OptimizationPlan.statWeight.physDmg;
    this.specDmg = this.rawSpecDmg / OptimizationPlan.statWeight.specDmg;
    this.critChance = this.rawCritChance / OptimizationPlan.statWeight.critChance;
    this.armor = this.rawArmor / OptimizationPlan.statWeight.armor;
    this.resistance = this.rawResistance / OptimizationPlan.statWeight.resistance;
    this.accuracy = this.rawAccuracy / OptimizationPlan.statWeight.accuracy;
    this.critAvoid = this.rawCritAvoid / OptimizationPlan.statWeight.critAvoid;

    this.primaryStatRestrictions = primaryStatRestrictions;
    this.setRestrictions = setRestrictions;
    this.targetStats = targetStats;
    this.useOnlyFullSets = useOnlyFullSets;

  }
*/

  /**
   * Return a renamed version of this optimization plan
   *
   * @param name String
   */
  rename(name: string) {
    return new OptimizationPlan(
      name,
      this.rawHealth,
      this.rawProtection,
      this.rawSpeed,
      this.rawCritDmg,
      this.rawPotency,
      this.rawTenacity,
      this.rawPhysDmg,
      this.rawSpecDmg,
      this.rawCritChance,
      this.rawArmor,
      this.rawResistance,
      this.rawAccuracy,
      this.rawCritAvoid,
      this.upgradeMods,
      this.primaryStatRestrictions,
      this.setRestrictions,
      this.targetStats,
      this.useOnlyFullSets,
    );
  }

  withUpgradeMods(upgradeMods: boolean) {
    return new OptimizationPlan(
      this.name,
      this.rawHealth,
      this.rawProtection,
      this.rawSpeed,
      this.rawCritDmg,
      this.rawPotency,
      this.rawTenacity,
      this.rawPhysDmg,
      this.rawSpecDmg,
      this.rawCritChance,
      this.rawArmor,
      this.rawResistance,
      this.rawAccuracy,
      this.rawCritAvoid,
      upgradeMods,
      this.primaryStatRestrictions,
      this.setRestrictions,
      this.targetStats,
      this.useOnlyFullSets
    );
  }

  /**
   * Checks to see if two OptimizationPlans are equivalent
   * @param that
   */
  equals(that: OptimizationPlan) {
    return that instanceof OptimizationPlan &&
      this.name === that.name &&
      this.Health === that.Health &&
      this.Protection === that.Protection &&
      this.Speed === that.Speed &&
      this['Critical Damage %'] === that['Critical Damage %'] &&
      this['Potency %'] === that['Potency %'] &&
      this['Tenacity %'] === that['Tenacity %'] &&
      this['Physical Damage'] === that['Physical Damage'] &&
      this['Special Damage'] === that['Special Damage'] &&
      this['Critical Chance'] === that['Critical Chance'] &&
      this.Armor === that.Armor &&
      this.Resistance === that.Resistance &&
      this['Accuracy %'] === that['Accuracy %'] &&
      this['Critical Avoidance %'] === that['Critical Avoidance %'] &&
      this.upgradeMods === that.upgradeMods &&
      areObjectsEquivalent(this.primaryStatRestrictions, that.primaryStatRestrictions) &&
      areObjectsEquivalent(this.setRestrictions, that.setRestrictions) &&
      areObjectsEquivalent(this.targetStats, that.targetStats) &&
      this.useOnlyFullSets === that.useOnlyFullSets
  }

  /**
   * Returns true if any stat weight is negative
   *
   * @returns {boolean}
   */
  hasNegativeWeights() {
    return this.Health < 0 ||
      this.Protection < 0 ||
      this.Speed < 0 ||
      this['Critical Damage %'] < 0 ||
      this['Potency %'] < 0 ||
      this['Tenacity %'] < 0 ||
      this['Physical Damage'] < 0 ||
      this['Special Damage'] < 0 ||
      this['Critical Chance'] < 0 ||
      this.Armor < 0 ||
      this.Resistance < 0 ||
      this['Accuracy %'] < 0 ||
      this['Critical Avoidance %'] < 0;
  }

  /**
   * Returns true if every stat has a weight of 0
   *
   * @returns {boolean}
   */
  isBlank() {
    return this.Health === 0 &&
      this.Protection === 0 &&
      this.Speed === 0 &&
      this['Critical Damage %'] === 0 &&
      this['Potency %'] === 0 &&
      this['Tenacity %'] === 0 &&
      this['Physical Damage'] === 0 &&
      this['Special Damage'] === 0 &&
      this['Critical Chance'] === 0 &&
      this.Armor === 0 &&
      this.Resistance === 0 &&
      this['Accuracy %'] === 0 &&
      this['Critical Avoidance %'] === 0;
  }

  /**
   * Returns true if this plan includes either primary stat or set restrictions
   *
   * @returns {boolean}
   */
  hasRestrictions() {
    return Object.values(this.primaryStatRestrictions).filter(primary => !!primary).length ||
      !areObjectsEquivalent({}, this.setRestrictions);
  }

  static shouldUpgradeMods(target: OptimizationPlan) {
    return target.upgradeMods || target.targetStats.length > 0;
  }

  serialize() {
    let planObject = {} as FlatOptimizationPlan;

    planObject.name = this.name;
    planObject.Health = this.rawHealth;
    planObject.Protection = this.rawProtection;
    planObject.Speed = this.rawSpeed;
    planObject['Critical Damage %'] = this.rawCritDmg;
    planObject['Potency %'] = this.rawPotency;
    planObject['Tenacity %'] = this.rawTenacity;
    planObject['Physical Damage'] = this.rawPhysDmg;
    planObject['Special Damage'] = this.rawSpecDmg;
    planObject['Critical Chance'] = this.rawCritChance;
    planObject.Armor = this.rawArmor;
    planObject.Resistance = this.rawResistance;
    planObject['Accuracy %'] = this.rawAccuracy;
    planObject['Critical Avoidance %'] = this.rawCritAvoid;
    planObject.upgradeMods = this.upgradeMods;
    planObject.primaryStatRestrictions = this.primaryStatRestrictions;
    planObject.setRestrictions = this.setRestrictions;
    planObject.targetStats = this.targetStats;
    planObject.useOnlyFullSets = this.useOnlyFullSets;

    return planObject;
  }

  /**
   * Deserialize an OptimizationPlan from serialized FlatOptimizationPlan
   *
   * @param plan FlatOptimizationPlan
   * @returns OptimizationPlan
   */
  static deserialize(plan: FlatOptimizationPlan) {
    const targetStats: TargetStat[] = plan.targetStats.map(targetStat =>
      new TargetStat(
        targetStat.stat,
        targetStat.type || '+',
        targetStat.minimum,
        targetStat.maximum,
        targetStat.relativeCharacterId,
        targetStat.optimizeForTarget
      )
    );

    return new OptimizationPlan(
      plan.name || 'unnamed',
      plan.Health,
      plan.Protection,
      plan.Speed,
      plan['Critical Damage %'],
      plan['Potency %'],
      plan['Tenacity %'],
      plan['Physical Damage'],
      plan['Special Damage'],
      plan['Critical Chance'],
      plan.Armor,
      plan.Resistance,
      plan['Accuracy %'],
      plan['Critical Avoidance %'],
      'undefined' !== typeof plan.upgradeMods ? plan.upgradeMods : true,
      plan.primaryStatRestrictions || {},
      plan.setRestrictions || {},
      targetStats,
      plan.useOnlyFullSets || false
    );
  }
}
