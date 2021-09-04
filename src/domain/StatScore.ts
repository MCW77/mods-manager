import type {ElementType} from "../utils/typeHelper";
import { SecondaryStats } from "./Stats";
import Big from "big.js";

class StatScore {
  value: Big;
  valueAsString: string;

  static statInfo: {
    [key in SecondaryStats.GIMOStatNames]: {
      intMin: number,
      intCount: number,
      decimalPoints: number
    }
  } = {
    "Critical Chance %": {
      intMin: 1125,
      intCount: 1126,
      decimalPoints: 5
    },
    "Defense": {
      intMin: 4,
      intCount: 7,
      decimalPoints: 0
    },
    "Defense %": {
      intMin: 85,
      intCount: 86,
      decimalPoints: 4
    },
    "Health": {
      intMin: 214,
      intCount: 215,
      decimalPoints: 0
    },
    "Health %": {
      intMin: 563,
      intCount: 563,
      decimalPoints: 5
    },
    "Offense": {
      intMin: 23,
      intCount: 24,
      decimalPoints: 0
    },
    "Offense %": {
      intMin: 281,
      intCount: 283,
      decimalPoints: 5
    },
    "Potency %": {
      intMin: 1125,
      intCount: 1126,
      decimalPoints: 5
    },
    "Protection": {
      intMin: 415,
      intCount: 416,
      decimalPoints: 0
    },
    "Protection %": {
      intMin: 1125,
      intCount: 1126,
      decimalPoints: 5
    },
    "Speed": {
      intMin: 3,
      intCount: 4,
      decimalPoints: 0
    },
    "Tenacity %": {
      intMin: 1125,
      intCount: 1126,
      decimalPoints: 5
    }
  } as const;
  
  constructor (stat: SecondaryStats.SecondaryStat) {
    let currentStatInfo = StatScore.statInfo[(stat.type)];
    let statIntValue: Big;
    
    if (stat.displayModifier === '%')      
      statIntValue = stat.bigValue.mul(Big(10 ** (currentStatInfo.decimalPoints-2))); 
    else
      statIntValue = stat.bigValue;
      
    let intDistance = statIntValue.minus(Big(currentStatInfo.intMin * stat.rolls)).plus(1);
    let onePercentEquivalent = Big(currentStatInfo.intCount * stat.rolls).minus(stat.rolls).plus(1).div(100);
    this.value = intDistance.div(onePercentEquivalent);
    this.valueAsString = this.value.toFixed(2);
  }

  /**
   * Return a CSS class to represent this score
   */
  getClass() {
    switch (Math.floor(this.value.div(20).toNumber())) {
      case 4:
        return 'S';
      case 3:
        return 'A';
      case 2:
        return 'B';
      case 1:
        return 'C';
      default:
        return 'D';
    }
  }

  /**
   * Return a string that represents this score
   */
  show() {
      return `${this.valueAsString}%`
  }  
}

export default StatScore;