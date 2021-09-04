import { Stats } from "./Stats";


export type GIMONeutralStats = 'Speed' | 'Potency %' | 'Tenacity %';
// #region GIMOOffensiveStats
export type GIMOOffensiveStats =
  | 'Accuracy %'
  | 'Critical Damage %'
  | 'Physical Damage'
  | 'Special Damage'
  | 'Physical Critical Chance %'
  | 'Special Critical Chance %'
;
// #endregion

// #region GIMODefensiveStats
export type GIMODefensiveStats =
  | 'Critical Avoidance %'
  | 'Health'
  | 'Protection'
  | 'Armor'
  | 'Resistance'
;
// #endregion
export type GIMOStatNames = GIMONeutralStats | GIMOOffensiveStats | GIMODefensiveStats;
// #region DisplayStatNames
export type DisplayStatNames = 
  | 'Speed'
  | 'Potency'
  | 'Tenacity'
  | 'Accuracy'
  | 'Critical Damage'
  | 'Physical Damage'
  | 'Special Damage'
  | 'Physical Critical Chance'
  | 'Special Critical Chance'
  | 'Critical Avoidance'
  | 'Health'
  | 'Protection'
  | 'Armor'
  | 'Resistance'
  | 'Effective Health (physical)'
  | 'Effective Health (special)'
  | 'Average Damage (physical)'
  | 'Average Damage (special)'
;
// #endregion

// #region InternalStatNames
type InternalStatNames =
  | 'speed'
  | 'potency'
  | 'tenacity'
  | 'accuracy'
  | 'critDmg'
  | 'physDmg'
  | 'specDmg' 
  | 'physCritChance'
  | 'specCritChance' 
  | 'critAvoid'
  | 'health'
  | 'protection'
  | 'armor'
  | 'resistance'
  | 'physEffectiveHealth'
  | 'specEffectiveHealth'
  | 'physAverageDamage'
  | 'specAverageDamage'

;  
//#endregion

type StatTypeMap = {
  [stat in Stats.NonCalculatedGIMOStatNames]: GIMOStatNames[]
}

type Display2InternalStatNamesMap = Readonly<{
  [key in DisplayStatNames]: Readonly<InternalStatNames[]>;
}>

export class CharacterSummaryStat extends Stats.Stat {


  static statTypeMap: Readonly<StatTypeMap> = {
    'Health': ['Health'],
    'Health %': ['Health'],
    'Protection': ['Protection'],
    'Protection %': ['Protection'],
    'Speed': ['Speed'],
    'Speed %': ['Speed'],
    'Critical Damage %': ['Critical Damage %'],
    'Potency %': ['Potency %'],
    'Tenacity %': ['Tenacity %'],
    'Offense': ['Physical Damage', 'Special Damage'],
    'Offense %': ['Physical Damage', 'Special Damage'],
//    'physDamage': ['physDamage'],
//    'specDamage': ['specDamage'],
    'Critical Chance %': ['Physical Critical Chance %', 'Special Critical Chance %'],
//    'physCritChanceP': ['physCritChanceP'],
//    'specCritChanceP': ['specCritChanceP'],
    'Defense': ['Armor', 'Resistance'],
    'Defense %': ['Armor', 'Resistance'],
//    'armorP': ['armor'],
//    'resistanceP': ['resistanceP'],
    'Accuracy %': ['Accuracy %'],
    'Critical Avoidance %': ['Critical Avoidance %']
  };

  static csDisplay2InternalStatNamesMap: Display2InternalStatNamesMap = Object.freeze({
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
    'Critical Avoidance': ['critAvoid'],
    'Effective Health (physical)': ['physEffectiveHealth'],
    'Effective Health (special)': ['specEffectiveHealth'],
    'Average Damage (physical)': ['physAverageDamage'],
    'Average Damage (special)': ['specAverageDamage'],
  } as const);

  static csGIMO2DisplayStatNamesMap: {[key in GIMOStatNames]: DisplayStatNames} = {
    'Health': 'Health',
    'Protection': 'Protection',
    'Speed': 'Speed',    
    'Critical Damage %': 'Critical Damage',
    'Potency %': 'Potency',
    'Tenacity %': 'Tenacity',
    'Physical Damage': 'Physical Damage',
    'Special Damage': 'Special Damage',
    'Physical Critical Chance %': 'Physical Critical Chance',
    'Special Critical Chance %': 'Special Critical Chance',
    'Armor': 'Armor',
    'Resistance': 'Resistance',
    'Accuracy %': 'Accuracy',
    'Critical Avoidance %': 'Critical Avoidance'
  };

  type: GIMOStatNames;

  constructor(type: GIMOStatNames, value: string) {
    super(value);
    this.type = type;
    this.displayModifier = this.type.endsWith('%') ? '%' : '';
//    this.isPercentVersion = this.displayModifier === '%' && Stats.Stat.mixedTypes.includes(this.getDisplayType());

  }

  clone(): this {
    return new CharacterSummaryStat(this.type, this.stringValue) as this
  };

  getDisplayType() {
    return CharacterSummaryStat.csGIMO2DisplayStatNamesMap[this.type];
  }
/*
  plus(that: Stats.Stat): CharacterSummaryStat {
    return super.plus(that) as CharacterSummaryStat
  }
*/
  /**
   * Add two stats together, producing a new stat with the sum of their values
   * @param that {CharacterSummaryStat}
   * @returns {CharacterSummmaryStat} with the same type and a value representing the sum
  */
  plus(that: CharacterSummaryStat): CharacterSummaryStat {
    if (!(that instanceof CharacterSummaryStat)) {
      throw new Error("Can't add a non-Stat to a Stat");
    }
    if (that.getDisplayType() !== this.getDisplayType() || that.isPercentVersion !== this.isPercentVersion) {
      throw new Error("Can't add two Stats of different types");
    }
    
    const result = this.clone();
    result.value = this.bigValue.plus(that.bigValue).toNumber();
    return result;
  }

  /**
   * Take the difference between this stat and that stat
   *
   * @param that {CharacterSummaryStat}
   * @returns {CharacterSummmaryStat} with the same type and a value representing the difference
   */
   minus(that: CharacterSummaryStat): CharacterSummaryStat {
    if (!(that instanceof CharacterSummaryStat)) {
      throw new Error("Can't take the difference between a Stat and a non-Stat");
    }
    if (that.type !== this.type) {
      throw new Error("Can't take the difference between Stats of different types");
    }
    let valueDiff = this.bigValue.minus(that.bigValue);
    let strValueDiff: string;
    if (valueDiff.mod(1)) {
      strValueDiff = `${valueDiff.toFixed(2)}`;
    } else {
      strValueDiff = `${valueDiff}`;
    }
    let result = this.clone();
    result.value = valueDiff.toNumber();
//    result.rawValue = strValueDiff;
    return result;
//    return new Stat(this.type, `${strValueDiff}${this.displayModifier}`);
  }

  
}