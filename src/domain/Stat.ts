// utils
import Big from "big.js";

// domain
import * as CharacterStatNames from "../modules/profilesManagement/domain/CharacterStatNames";

import * as Character from "./Character";
import * as OptimizationPlan from "./OptimizationPlan";
import { CharacterSummaryStats as CSStats, PrimaryStats, SecondaryStats, SetStats} from "./Stats";


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
  'Critical Avoidance' |
  'Effective Health (physical)' |
  'Effective Health (special)' |
  'Average Damage (physical)' |
  'Average Damage (special)'
;
// #endregion

type Display2CSBasicStatNamesMap = Readonly<{
  [key in DisplayStatNames]: Readonly<CharacterStatNames.All[]>;
}>

type GIMO2DisplayStatNamesMap = Readonly<{
  [key in AllGIMOStatNames]: DisplayStatNames;
}>

export type DisplayedStat = `${string} ${DisplayStatNames}`;

export abstract class Stat {

  static display2CSGIMOStatNamesMap: Display2CSBasicStatNamesMap = Object.freeze({
    'Health': ['Health'],
    'Protection': ['Protection'],
    'Speed': ['Speed'],
    'Critical Damage': ['Critical Damage %'],
    'Potency': ['Potency %'],
    'Tenacity': ['Tenacity %'],
    'Offense': ['Physical Damage', 'Special Damage'],
    'Physical Damage': ['Physical Damage'],
    'Special Damage': ['Special Damage'],
    'Critical Chance': ['Physical Critical Chance %', 'Special Critical Chance %'],
    'Physical Critical Chance': ['Physical Critical Chance %'],
    'Special Critical Chance': ['Special Critical Chance %'],
    'Defense': ['Armor', 'Resistance'],
    'Armor': ['Armor'],
    'Resistance': ['Resistance'],
    'Accuracy': ['Accuracy %'],
    'Critical Avoidance': ['Critical Avoidance %'],
    'Effective Health (physical)': [],
    'Effective Health (special)': [],
    'Average Damage (physical)': [],
    'Average Damage (special)': [],
  } as const);

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
    'Armor': 'Armor',
    'Resistance': 'Resistance',
    'Accuracy %': 'Accuracy',
    'Critical Avoidance %': 'Critical Avoidance',
    'Effective Health (physical)': 'Effective Health (physical)',
    'Effective Health (special)': 'Effective Health (special)',
    'Average Damage (physical)': 'Average Damage (physical)',
    'Average Damage (special)': 'Average Damage (special)',
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
  abstract type: AllGIMOStatNames;
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
    this.value = Number(value);
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
  show(): DisplayedStat {
    return `${this.showValue()} ${this.getDisplayType()}`
  }

  /**
   * Return only the value of this stat as a string
   * @returns {string}
   */
  showValue(): `${string}${''|'%'}` {
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
  getFlatValuesForCharacter(character: Character.Character) {
    const statPropertyNames = Stat.display2CSGIMOStatNamesMap[this.getDisplayType()];

    return statPropertyNames.map((statName) => {
      const displayName = Stat.gimo2DisplayStatNamesMap[statName];
      const statType: CharacterStatNames.All = (Stat.mixedTypes.includes(displayName) ? displayName : `${displayName} %`) as CharacterStatNames.All;


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
  getOptimizationValue(character: Character.Character, target: OptimizationPlan.OptimizationPlan) {
    // Optimization Plans don't have separate physical and special critical chances, since both are always affected
    // equally. If this is a physical crit chance stat, then use 'critChance' as the stat type. If it's special crit
    // chance, ignore it altogether.
    if (this.getDisplayType() === 'Special Critical Chance') {
      return 0;
    }

    type OptStats = Readonly<CharacterStatNames.WithoutCC[]> | Readonly<"Critical Chance"[]>;

    const statTypes: OptStats = 'Physical Critical Chance' === this.getDisplayType()
    ?
      ['Critical Chance']
    :
      Stat.display2CSGIMOStatNamesMap[this.getDisplayType()] as CharacterStatNames.WithoutCC[];

    if (!statTypes) {
      return 0;
    }

    if (this.isPercentVersion) {
      return statTypes.map((statType: CharacterStatNames.WithoutCC | 'Critical Chance') =>
        target[statType] *
        Math.floor(character!.playerValues.baseStats![statType as CharacterStatNames.All] * this.value / 100)
      ).reduce((a, b) => a + b, 0);
    } else {
      return statTypes.map((statType: CharacterStatNames.WithoutCC | 'Critical Chance')  =>
        this._value.mul(target[statType]).toNumber()
      ).reduce((a, b) => a + b, 0);
    }
  }
}
