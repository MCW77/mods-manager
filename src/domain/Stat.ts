import type * as StatTypes from "./types/StatTypes";
import * as StatConsts from "./constants/StatConsts";
import { CharacterSummaryStats as CSStats, PrimaryStats, SecondaryStats, SetStats} from "./Stats";
import { Character } from "./Character";
import { OptimizationPlan} from "./OptimizationPlan";

import Big from "big.js";

export type NonCalculatedGIMOStatNames =
  PrimaryStats.GIMOStatNames   |
  SetStats.GIMOStatNames       |
  SecondaryStats.GIMOStatNames
;

type AllGIMOStatNames = NonCalculatedGIMOStatNames | CSStats.GIMOStatNames;

// #region DisplayStatNames
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

// #region InternalStatNamesWithoutCC
type InternalStatNamesWithoutCC =
'health' |
'protection' |
'speed' |
'critDmg' |
'potency' |
'tenacity' |
'physDmg' |
'specDmg' |
'defense' |
'armor' |
'resistance' |
'accuracy' |
'critAvoid'
;
//#endregion

export type InternalStatNames = InternalStatNamesWithoutCC | 'specCritChance' | 'physCritChance';

type Display2InternalStatNamesMap = Readonly<{
  [key in DisplayStatNames]: Readonly<InternalStatNames[]>;
}>

type Internal2DisplayStatNamesMap = Readonly<{
  [key in InternalStatNames]: DisplayStatNames;
}>

type GIMO2DisplayStatNamesMap = Readonly<{
  [key in AllGIMOStatNames]: DisplayStatNames;
}>

type Display2GIMOStatNamesMap = Readonly<{
  [key in DisplayStatNames]: AllGIMOStatNames;
}>

export abstract class Stat {
  static display2InternalStatNamesMap: Display2InternalStatNamesMap = Object.freeze({
    'Health': ['health'],
    'Protection': ['protection'],
    'Speed': ['speed'],
    'Critical Damage': ['critDmg'],
    'Potency': ['potency'],
    'Tenacity': ['tenacity'],
    'Offense': ['physDmg', 'specDmg'],
    'Physical Damage': ['physDmg'],
    'Special Damage': ['specDmg'],
    'Critical Chance': ['physCritChance', 'specCritChance'],
    'Physical Critical Chance': ['physCritChance'],
    'Special Critical Chance': ['specCritChance'],
    'Defense': ['armor', 'resistance'],
    'Armor': ['armor'],
    'Resistance': ['resistance'],
    'Accuracy': ['accuracy'],
    'Critical Avoidance': ['critAvoid']
  } as const);
  
  static internal2DisplayStatNamesMap: Internal2DisplayStatNamesMap = {
    'health': 'Health',
    'protection': 'Protection',
    'speed': 'Speed',
    'critDmg': 'Critical Damage',
    'potency': 'Potency',
    'tenacity': 'Tenacity',
    'physDmg': 'Physical Damage',
    'specDmg': 'Special Damage',
    'physCritChance': 'Physical Critical Chance',
    'specCritChance': 'Special Critical Chance',
    'defense': 'Defense',
    'armor': 'Armor',
    'resistance': 'Resistance',
    'accuracy': 'Accuracy',
    'critAvoid': 'Critical Avoidance',
  };
  // A map from the internal name to a more human-friendly name for each stat type
  static gimo2DisplayStatNamesMap: GIMO2DisplayStatNamesMap = {
    'Health': 'Health',
    'Health %': 'Health',
    'Protection': 'Protection',
    'Protection %': 'Protection',
    'Speed': 'Speed',
    'Speed %': 'Speed',
    'Critical Damage %': 'Critical Damage',
    'Potency %': 'Potency',
    'Tenacity %': 'Tenacity',
    'Physical Damage': 'Physical Damage',
    'Special Damage': 'Special Damage',
    'Critical Chance %': 'Critical Chance',
    'Physical Critical Chance %': 'Physical Critical Chance',
    'Special Critical Chance %': 'Special Critical Chance',
    'Defense': 'Defense',
    'Defense %': 'Defense',
    'Offense': 'Offense',
    'Offense %': 'Offense',
    'Armor %': 'Armor',
    'Resistance %': 'Resistance',
    'Accuracy %': 'Accuracy',
    'Critical Avoidance %': 'Critical Avoidance'
  };

  static display2GIMOStatNamesMap: Display2GIMOStatNamesMap = {
    'Health': 'Health',
    'Protection': 'Protection',
    'Speed': 'Speed',
    'Critical Damage': 'Critical Damage %',
    'Potency': 'Potency %',
    'Tenacity': 'Tenacity %',
    'Physical Damage': 'Physical Damage',
    'Special Damage': 'Special Damage',
    'Critical Chance': 'Critical Chance %',
    'Physical Critical Chance': 'Physical Critical Chance %',
    'Special Critical Chance': 'Special Critical Chance %',
    'Defense': 'Defense',
    'Offense': 'Offense',
    'Armor': 'Armor %',
    'Resistance': 'Resistance %',
    'Accuracy': 'Accuracy %',
    'Critical Avoidance': 'Critical Avoidance %',
  };

  // A list of stat types that can be either a flat value or a percent
  static mixedTypes: DisplayStatNames[] = [
    'Health',
    'Protection',
    'Offense',
    'Physical Damage',
    'Special Damage',
    'Speed',
    'Defense',
    'Armor',
    'Resistance'
  ];

  #displayValue: string = '0';
//  displayModifier: StatTypes.Modifier;
  abstract type: AllGIMOStatNames;
//  displayType: StatTypes.AnyStat;
  protected stringValue: string = '0';
  private _value: Big = Big(0);

  displayModifier: '' | '%' = '';
  public get bigValue(): Big {
    return this._value;
  }
  get value(): number {
    return this._value.toNumber();
  }
  set value(input: number) {
    this._value = Big(input);
    this.stringValue = this._value.toString();
    this.updateDisplayValue();
  }
  isPercentVersion: boolean = false;  

  constructor(value: string) {
//    this.displayModifier = this.type.endsWith('%') || value.endsWith('%') ? '%' : '';
//    this.displayType = <StatTypes.AnyStat>(type.endsWith('%') ? type.substr(0, type.length - 1).trim() : type);
//    this.rawValue = value.replace(/[+%]/g, '');
//    this.rawValue = value;
    this.value = Number(value);
//    this.isPercent = '%' === this.displayModifier && Stat.mixedTypes.includes(this.displayType);

  }

  abstract clone(): this;
  
  getDisplayType(): DisplayStatNames {
    return Stat.gimo2DisplayStatNamesMap[this.type];
  }

  /**
   * Update the displayed value for this stat to match the value held in the stat. This is useful if the stat
   * value was updated
   */
  updateDisplayValue() {
    this.#displayValue = `${this._value.mod(1) ? Math.round(this._value.toNumber() * 100) / 100 : this._value}`;
  }

  /**
   * Return a string that represents this stat
   */
  show(): string {
    return `${this.showValue()} ${this.getDisplayType()}`      
  }

  /**
   * Return only the value of this stat as a string
   * @returns {string}
   */
  showValue(): string {
    return `${this.#displayValue}${this.displayModifier}`;
  }

  
/*
    const valueSum = this._value.plus(that._value);

    let result = this.clone();
    result.rawValue = `${valueSum}`;
    return result;
*/

  /**
   * Convert this stat to one or more with flat values, even if it had a percent-based value before
   * @param character
   * @returns {Array<Stat>}
   */
  getFlatValuesForCharacter(character: Character) {
    const statPropertyNames = Stat.display2InternalStatNamesMap[this.getDisplayType()];

    return statPropertyNames.map((statName) => {
      const displayName = Stat.internal2DisplayStatNamesMap[statName];
      const statType: AllGIMOStatNames = (Stat.mixedTypes.includes(displayName) ? displayName : `${displayName} %`) as AllGIMOStatNames;

      
      if (this.isPercentVersion && character.playerValues?.baseStats) {
        return new CSStats.CharacterSummaryStat(statType, `${this._value.mul(character?.playerValues?.baseStats[statName] ?? 0).div(100).toNumber()}`);
      } else if (!this.isPercentVersion) {
        return new CSStats.CharacterSummaryStat(statType, this.stringValue);
      } else {
        throw new Error(`Stat is given as a percentage, but ${character.baseID} has no base stats`);
      }
    });
  }


  /**
   * Get the value of this stat for optimization
   *
   * @param character {Character}
   * @param target {OptimizationPlan}
   */
  getOptimizationValue(character: Character, target: OptimizationPlan) {
    // Optimization Plans don't have separate physical and special critical chances, since both are always affected
    // equally. If this is a physical crit chance stat, then use 'critChance' as the stat type. If it's special crit
    // chance, ignore it altogether.
    if (this.getDisplayType() === 'Special Critical Chance') {
      return 0;
    }

    
    type OptStats = Readonly<StatTypes.GIMOStatTypeWithoutCC[]> | Readonly<"critChance"[]>;

    const statTypes: OptStats = 'Physical Critical Chance' === this.getDisplayType()
    ?
      ['critChance'] 
    :
      StatConsts.statTypeMap[this.getDisplayType()] as StatTypes.GIMOStatTypeWithoutCC[];

    if (!statTypes) {
      return 0;
    }

    if (this.isPercentVersion) {
      return statTypes.map((statType: StatTypes.GIMOStatTypeWithoutCC | 'critChance') =>
        target[statType] *
        Math.floor(character!.playerValues.baseStats![statType as StatTypes.GIMOStatTypeWithoutCC] * this.value / 100)
      ).reduce((a, b) => a + b, 0);
    } else {
      return statTypes.map((statType: StatTypes.GIMOStatTypeWithoutCC | 'critChance')  =>
        this._value.mul(target[statType]).toNumber()
      ).reduce((a, b) => a + b, 0);
    }
  }

  /**
   * Extract the type and value of this stat for serialization
   */

/*
  abstract serialize():
   [PrimaryStats.GIMOStatNames, string] |
   [SecondaryStats.GIMOStatNames, string, SecondaryStats.Rolls] |
   [SetStats.GIMOStatNames, string]
*/   
/*
  serialize(): [T, string, StatTypes.Rolls] {
    const percent = (
        this.isPercent || !Stat.mixedTypes.includes(this.displayType)
      ) &&
        !this.type.includes('%')
      ?
        '%'
      :
        '';

    return [this.type, `+${this.rawValue}${percent}`, this.rolls];
  }
*/    

}
