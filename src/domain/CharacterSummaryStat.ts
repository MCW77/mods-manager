// domain
import type { GIMOCharacterSummaryStatNames } from "./GIMOStatNames.js";
import { Stat } from "./Stat.js";

// #region DisplayStatNames
export type DisplayStatNames =
	| "Speed"
	| "Potency"
	| "Tenacity"
	| "Accuracy"
	| "Critical Damage"
	| "Physical Damage"
	| "Special Damage"
	| "Physical Critical Chance"
	| "Special Critical Chance"
	| "Critical Avoidance"
	| "Health"
	| "Protection"
	| "Armor"
	| "Resistance"
	| "Effective Health (physical)"
	| "Effective Health (special)"
	| "Average Damage (physical)"
	| "Average Damage (special)";
// #endregion

// #region CalculatedStatNames
export type CalculatedStatNames =
	| "Effective Health (physical)"
	| "Effective Health (special)"
	| "Average Damage (physical)"
	| "Average Damage (special)";
//#endregion

export class CharacterSummaryStat extends Stat {
	static csGIMO2DisplayStatNamesMap: {
		[key in GIMOCharacterSummaryStatNames]: DisplayStatNames;
	} = {
		Health: "Health",
		Protection: "Protection",
		Speed: "Speed",
		"Critical Damage %": "Critical Damage",
		"Potency %": "Potency",
		"Tenacity %": "Tenacity",
		"Physical Damage": "Physical Damage",
		"Special Damage": "Special Damage",
		"Physical Critical Chance %": "Physical Critical Chance",
		"Special Critical Chance %": "Special Critical Chance",
		Armor: "Armor",
		Resistance: "Resistance",
		"Accuracy %": "Accuracy",
		"Critical Avoidance %": "Critical Avoidance",
		"Effective Health (physical)": "Effective Health (physical)",
		"Effective Health (special)": "Effective Health (special)",
		"Average Damage (physical)": "Average Damage (physical)",
		"Average Damage (special)": "Average Damage (special)",
	};

	type: GIMOCharacterSummaryStatNames;

	constructor(type: GIMOCharacterSummaryStatNames, value: string) {
		super(value);
		this.type = type;
		this.displayModifier = this.type.endsWith("%") ? "%" : "";
		//    this.isPercentVersion = this.displayModifier === '%' && Stats.Stat.mixedTypes.includes(this.getDisplayType());
	}

	clone(): this {
		return new CharacterSummaryStat(this.type, this.stringValue) as this;
	}

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
		if (
			that.getDisplayType() !== this.getDisplayType() ||
			that.isPercentVersion !== this.isPercentVersion
		) {
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
			throw new Error(
				"Can't take the difference between a Stat and a non-Stat",
			);
		}
		if (that.type !== this.type) {
			throw new Error(
				"Can't take the difference between Stats of different types",
			);
		}
		const valueDiff = this.bigValue.minus(that.bigValue);
		let _strValueDiff: string;
		if (valueDiff.mod(1)) {
			_strValueDiff = `${valueDiff.toFixed(2)}`;
		} else {
			_strValueDiff = `${valueDiff}`;
		}
		const result = this.clone();
		result.value = valueDiff.toNumber();
		//    result.rawValue = strValueDiff;
		return result;
		//    return new Stat(this.type, `${strValueDiff}${this.displayModifier}`);
	}
}
