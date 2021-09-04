import { Stats } from "./Stats";
import StatScore from "./StatScore";

export type HUNeutralStats = 'Speed' | 'Potency %' | 'Resistance %';
export type HUOffensiveStats = 'Offense' | 'Offense %' | 'Crit Chance %';
// #region HUDefensiveStats
export type HUDefensiveStats =
  'Defense'
  | 'Defense %'
  | 'Health'
  | 'Health %'
  | 'Protection'
  | 'Protection %'
;
// #endregion
export type HUStatNames = HUNeutralStats | HUOffensiveStats | HUDefensiveStats;

export type GIMONeutralStats = 'Speed' | 'Potency %' | 'Tenacity %';
export type GIMOOffensiveStats = 'Offense' | 'Offense %' | 'Critical Chance %';;
export type GIMODefensiveStats = HUDefensiveStats;

export type GIMOStatNames = GIMONeutralStats | GIMOOffensiveStats | GIMODefensiveStats;


export type Rolls = 1 | 2 | 3 | 4 | 5;
export type StrRolls = '1' | '2' | '3' | '4' | '5';

export class SecondaryStat extends Stats.Stat {
  static statNames: Readonly<GIMOStatNames[]> = [
    'Speed',
    'Potency %',
    'Tenacity %',
    'Critical Chance %',
    'Offense',
    'Offense %',
    'Defense',
    'Defense %',
    'Health',
    'Health %',
    'Protection',
    'Protection %',
  ] as const;

  static HU2GIMOStatNamesMap: {[key in HUStatNames]: GIMOStatNames} = {
    'Crit Chance %': 'Critical Chance %',
    'Defense': 'Defense',
    'Defense %': 'Defense %',
    'Health': 'Health',
    'Health %': 'Health %',
    'Offense': 'Offense',
    'Offense %': 'Offense %',
    'Potency %': 'Potency %',
    'Protection': 'Protection',
    'Protection %': 'Protection %',
    'Resistance %': 'Tenacity %',
    'Speed': 'Speed',
  }

  static GIMO2HUStatNamesMap: {[key in GIMOStatNames]: HUStatNames} = {
    'Critical Chance %': 'Crit Chance %',
    'Defense': 'Defense',
    'Defense %': 'Defense %',
    'Health': 'Health',
    'Health %': 'Health %',
    'Offense': 'Offense',
    'Offense %': 'Offense %',
    'Potency %': 'Potency %',
    'Protection': 'Protection',
    'Protection %': 'Protection %',
    'Tenacity %': 'Resistance %',
    'Speed': 'Speed',
  }

  static upgradeFactors: {[key in GIMOStatNames]: number} = {
    'Critical Chance %': 1.045,
    'Defense': 1.63,
    'Defense %': 2.34,
    'Health': 1.26,
    'Health %': 1.86,
    'Offense': 1.10,
    'Offense %': 3.02,
    'Potency %': 1.33,
    'Protection': 1.11,
    'Protection %': 1.33,
    'Speed': 1,
    'Tenacity %': 1.33,
  };

  type: GIMOStatNames;
  rolls: Rolls;
  score!: StatScore;

  constructor(type: GIMOStatNames, value: string, rolls: Rolls = 1) {
    super(value);
    this.type = type;
    this.rolls = rolls;
    this.displayModifier = this.type.endsWith('%') ? '%' : '';
    this.isPercentVersion = this.displayModifier === '%' && Stats.Stat.mixedTypes.includes(this.getDisplayType());
  }

  clone(): this {
    return new SecondaryStat(this.type, this.stringValue, this.rolls) as this
  };

  static fromHotUtils(type: HUStatNames, value: string, rolls: StrRolls = '1') {
    return new SecondaryStat(SecondaryStat.HU2GIMOStatNamesMap[type], value, +rolls as Rolls);
  }

  calcScore() {
    this.score = new StatScore(this);    
  }

  /**
  * Return the value this stat would have if it were upgraded on a mod sliced from 5A to 6E
  * @returns {SecondaryStat}
  */
  upgrade(): SecondaryStat {
    let result = new SecondaryStat(
      this.type,
      `${this.bigValue.mul(SecondaryStat.upgradeFactors[this.type])}`,
       this.rolls
    );
    
    if (this.type === 'Speed')
      result.value = result.bigValue.plus(1).toNumber();
  
    return result;
  }
  
  downgrade(): SecondaryStat {
    let result = new SecondaryStat(
      this.type,
      `${this.bigValue.div(SecondaryStat.upgradeFactors[this.type])}`,
       this.rolls
    );
    
    if (this.type === 'Speed')
      result.value = result.bigValue.minus(1).toNumber();
  
    return result;
  }

  serialize(): [GIMOStatNames, string, StrRolls] {
    return [this.type, this.stringValue, `${this.rolls}` as StrRolls];
  }

  /**
   * Return a CSS class to represent this stat
   */
  getClass() {
    switch (this.rolls) {
      case 5:
        return 'S';
      case 4:
        return 'A';
      case 3:
        return 'B';
      case 2:
        return 'C';
      default:
        return 'D';
    }
  }

}