/**
 * A class to represent the base values of any stats that are modified by mods.
 * All values should be represented as if the character were capped out at 7* g12
 * but had no mods on.
 */

 type CharacterStatNames =
 'health'
 | 'protection'
 | 'speed'
 | 'critDmg'
 | 'potency'
 | 'tenacity'
 | 'physDmg'
 | 'specDmg'
 | 'armor'
 | 'resistance'
 | 'accuracy'
 | 'critAvoid'
 | 'physCritRating'
 | 'specCritRating'
 | 'physCritChance'
 | 'specCritChance'
 ;

 export interface IHUCharacterStats {
  health: number;
  protection: number;
  speed: number;
  potency: number;
  tenacity: number;
  'Physical Damage': number;
  'Physical Critical Chance': number;
  armor: number;
  'Special Damage': number;
  'Special Critical Chance': number;
  resistance: number;
  'Critical Damage': number;
  'Physical Critical Avoidance': number;
  'Physical Accuracy': number;
}

export type CharacterStatNamesIndexer = {
  [key in CharacterStatNames]: number
}

export interface ICharacterStats extends CharacterStatNamesIndexer {
  health: number;
  protection: number;
  speed: number;
  critDmg: number;
  potency: number;
  tenacity: number;
  physDmg: number;
  specDmg: number;
  armor: number;
  resistance: number;
  accuracy: number;
  critAvoid: number;
  physCritRating: number;
  specCritRating: number;
}

export class CharacterStats implements ICharacterStats {
  static nullStats = Object.freeze(new CharacterStats(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0));

  health: number;
  protection: number;
  speed: number;
  potency: number;
  tenacity: number;
  physDmg: number;
  physCritRating: number;
  armor: number;
  specDmg: number;
  specCritRating: number;
  resistance: number;
  physCritChance: number;
  specCritChance: number;
  critDmg: number;
  accuracy: number;
  critAvoid: number;

  /**
   * Constructor for the CharacterStats class
   *
   * @param health Number
   * @param protection Number
   * @param speed Number
   * @param potency Number Character potency, as a percent (0-1)
   * @param tenacity Number Character tenacity, as a percent (0-1)
   * @param physDmg Number
   * @param physCritRating Number
   * @param armor Number
   * @param specDmg Number
   * @param specCritRating Number
   * @param resistance Number
   */
  constructor(
    health: number,
    protection: number,
    speed: number,
    potency: number,
    tenacity: number,
    physDmg: number,
    physCritRating: number,
    armor: number,
    specDmg: number,
    specCritRating: number,
    resistance: number,
    critDmg: number,
    critAvoid: number,
    accuracy: number,
  ) {
    // General stats
    this.health = health;
    this.protection = protection;
    this.speed = speed;
    this.potency = potency * 100;
    this.tenacity = tenacity * 100;
    this.critDmg = critDmg * 100;
    this.critAvoid = critAvoid / 24;
    this.accuracy = accuracy / 12;
    // Physical stats
    this.physDmg = physDmg;
    this.physCritRating = physCritRating;
    this.armor = armor;

    // Special stats
    this.specDmg = specDmg;
    this.specCritRating = specCritRating;
    this.resistance = resistance;

    // Derived stats
    this.physCritChance = physCritRating / 24 + 10;
    this.specCritChance = specCritRating / 24 + 10;
  }

  clone() {
    return new CharacterStats(
      this.health,
      this.protection,
      this.speed,
      this.potency,
      this.tenacity,
      this.physDmg,
      this.physCritRating,
      this.armor,
      this.specDmg,
      this.specCritRating,
      this.resistance,
      this.critDmg,
      this.critAvoid,
      this.accuracy,
    )
  }

  /**
   * Checks to see whether all required stats have valid values
   *
   * @returns boolean
   */
  isValid():boolean {
    return this.isNumberValid(this.health) &&
      this.isNumberValid(this.protection) &&
      this.isNumberValid(this.speed) &&
      this.isNumberValid(this.potency) &&
      this.isNumberValid(this.tenacity) &&
      this.isNumberValid(this.physDmg) &&
      this.isNumberValid(this.physCritRating) &&
      this.isNumberValid(this.armor) &&
      this.isNumberValid(this.specDmg) &&
      this.isNumberValid(this.specCritRating) &&
      this.isNumberValid(this.resistance);
  }

  /**
   * Check a single value to see whether it is a valid number (defined, not null, not NaN)
   *
   * @param number
   * @returns boolean
   */
  isNumberValid(number: number) {
    return typeof number !== 'undefined' && null !== number && !isNaN(number);
  }

  /**
   * Add two CharacterStats objects together, returning the result in a new object
   * @param that CharacterStats
   */
  plus(that: CharacterStats) {
    return new CharacterStats(
      this.health + that.health,
      this.protection + that.protection,
      this.speed + that.speed,
      (this.potency + that.potency) / 100,
      (this.tenacity + that.tenacity) / 100,
      this.physDmg + that.physDmg,
      this.physCritRating + that.physCritRating,
      this.armor + that.armor,
      this.specDmg + that.specDmg,
      this.specCritRating + that.specCritRating,
      this.resistance + that.resistance,
      (this.critDmg + that.critDmg) / 100,
      (this.critAvoid + that.critAvoid) * 24,
      (this.accuracy + that.accuracy) * 12,
    )
  }

  serialize() {
    return this as ICharacterStats;
  }

  static deserialize(flatStats: ICharacterStats) {
    return new CharacterStats(
      flatStats.health,
      flatStats.protection,
      flatStats.speed,
      flatStats.potency / 100,
      flatStats.tenacity / 100,
      flatStats.physDmg,
      flatStats.physCritRating,
      flatStats.armor,
      flatStats.specDmg,
      flatStats.specCritRating,
      flatStats.resistance,
      flatStats.critDmg / 100,
      flatStats.critAvoid * 24,
      flatStats.accuracy * 12
    );
  }
}

const NullCharacterStats = new CharacterStats(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
Object.freeze(NullCharacterStats);

export { NullCharacterStats };
