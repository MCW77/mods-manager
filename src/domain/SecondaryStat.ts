// utils
import Big from "big.js";

// domain
import type { GIMOSecondaryStatNames } from "./GIMOStatNames";
import { Stat } from "./Stat";

export type HUNeutralStats = "Speed" | "Potency %" | "Resistance %";
export type HUOffensiveStats = "Offense" | "Offense %" | "Crit Chance %";
// #region HUDefensiveStats
export type HUDefensiveStats =
	| "Defense"
	| "Defense %"
	| "Health"
	| "Health %"
	| "Protection"
	| "Protection %";
// #endregion
export type HUStatNames = HUNeutralStats | HUOffensiveStats | HUDefensiveStats;

export type Rolls = 1 | 2 | 3 | 4 | 5;
export type StrRolls = "1" | "2" | "3" | "4" | "5";

export class SecondaryStat extends Stat {
	static statNames: Readonly<GIMOSecondaryStatNames[]> = [
		"Speed",
		"Potency %",
		"Tenacity %",
		"Critical Chance %",
		"Offense",
		"Offense %",
		"Defense",
		"Defense %",
		"Health",
		"Health %",
		"Protection",
		"Protection %",
	] as const;

	static HU2GIMOStatNamesMap: { [key in HUStatNames]: GIMOSecondaryStatNames } =
		{
			"Crit Chance %": "Critical Chance %",
			Defense: "Defense",
			"Defense %": "Defense %",
			Health: "Health",
			"Health %": "Health %",
			Offense: "Offense",
			"Offense %": "Offense %",
			"Potency %": "Potency %",
			Protection: "Protection",
			"Protection %": "Protection %",
			"Resistance %": "Tenacity %",
			Speed: "Speed",
		};

	static upgradeFactors: { [key in GIMOSecondaryStatNames]: number } = {
		"Critical Chance %": 1.045,
		Defense: 1.63,
		"Defense %": 2.34,
		Health: 1.26,
		"Health %": 1.86,
		Offense: 1.1,
		"Offense %": 3.02,
		"Potency %": 1.33,
		Protection: 1.11,
		"Protection %": 1.33,
		Speed: 1,
		"Tenacity %": 1.33,
	};

	id: string;
	type: GIMOSecondaryStatNames;
	rolls: Rolls;
	score!: StatScore;

	constructor(
		id: string,
		type: GIMOSecondaryStatNames,
		value: string,
		rolls: Rolls = 1,
	) {
		super(value);
		this.id = id;
		this.type = type;
		this.rolls = rolls;
		this.displayModifier = this.type.endsWith("%") ? "%" : "";
		this.isPercentVersion =
			this.displayModifier === "%" &&
			Stat.mixedTypes.includes(this.getDisplayType());
	}

	clone(): this {
		return new SecondaryStat(
			this.id,
			this.type,
			this.stringValue,
			this.rolls,
		) as this;
	}

	static fromHotUtils(
		id: string,
		type: HUStatNames,
		value: string,
		rolls: StrRolls = "1",
	) {
		return new SecondaryStat(
			id,
			SecondaryStat.HU2GIMOStatNamesMap[type],
			value,
			+rolls as Rolls,
		);
	}

	calcScore() {
		this.score = new StatScore(this);
	}

	/**
	 * Return the value this stat would have if it were upgraded on a mod sliced from 5A to 6E
	 * @returns {SecondaryStat}
	 */
	upgrade(): SecondaryStat {
		const result = new SecondaryStat(
			this.id,
			this.type,
			`${this.bigValue.mul(SecondaryStat.upgradeFactors[this.type])}`,
			this.rolls,
		);

		if (this.type === "Speed")
			result.value = result.bigValue.plus(1).toNumber();

		return result;
	}

	downgrade(): SecondaryStat {
		const result = new SecondaryStat(
			this.id,
			this.type,
			`${this.bigValue.div(SecondaryStat.upgradeFactors[this.type])}`,
			this.rolls,
		);

		if (this.type === "Speed")
			result.value = result.bigValue.minus(1).toNumber();

		return result;
	}

	serialize(): [GIMOSecondaryStatNames, string, StrRolls] {
		return [this.type, this.stringValue, `${this.rolls}` as StrRolls];
	}

	/**
	 * Return a CSS class to represent this stat
	 */
	getClass() {
		switch (this.rolls) {
			case 5:
				return "S";
			case 4:
				return "A";
			case 3:
				return "B";
			case 2:
				return "C";
			default:
				return "D";
		}
	}
}

class StatScore {
	value: Big;
	valueAsString: string;

	static statInfo: {
		[key in GIMOSecondaryStatNames]: {
			intMin: number;
			intCount: number;
			decimalPoints: number;
		};
	} = {
		"Critical Chance %": {
			intMin: 1125,
			intCount: 1126,
			decimalPoints: 5,
		},
		Defense: {
			intMin: 4,
			intCount: 7,
			decimalPoints: 0,
		},
		"Defense %": {
			intMin: 85,
			intCount: 86,
			decimalPoints: 4,
		},
		Health: {
			intMin: 214,
			intCount: 215,
			decimalPoints: 0,
		},
		"Health %": {
			intMin: 563,
			intCount: 563,
			decimalPoints: 5,
		},
		Offense: {
			intMin: 23,
			intCount: 24,
			decimalPoints: 0,
		},
		"Offense %": {
			intMin: 281,
			intCount: 283,
			decimalPoints: 5,
		},
		"Potency %": {
			intMin: 1125,
			intCount: 1126,
			decimalPoints: 5,
		},
		Protection: {
			intMin: 415,
			intCount: 416,
			decimalPoints: 0,
		},
		"Protection %": {
			intMin: 1125,
			intCount: 1126,
			decimalPoints: 5,
		},
		Speed: {
			intMin: 3,
			intCount: 4,
			decimalPoints: 0,
		},
		"Tenacity %": {
			intMin: 1125,
			intCount: 1126,
			decimalPoints: 5,
		},
	} as const;

	constructor(stat: SecondaryStat) {
		const currentStatInfo = StatScore.statInfo[stat.type];
		let statIntValue: Big;

		if (stat.displayModifier === "%")
			statIntValue = stat.bigValue.mul(
				Big(10 ** (currentStatInfo.decimalPoints - 2)),
			);
		else statIntValue = stat.bigValue;

		const intDistance = statIntValue
			.minus(Big(currentStatInfo.intMin * stat.rolls))
			.plus(1);
		const onePercentEquivalent = Big(currentStatInfo.intCount * stat.rolls)
			.minus(stat.rolls)
			.plus(1)
			.div(100);
		this.value = intDistance.div(onePercentEquivalent);
		this.valueAsString = this.value.toFixed(2);
	}

	/**
	 * Return a CSS class to represent this score
	 */
	getClass() {
		switch (Math.floor(this.value.div(20).toNumber())) {
			case 4:
				return "S";
			case 3:
				return "A";
			case 2:
				return "B";
			case 1:
				return "C";
			default:
				return "D";
		}
	}

	/**
	 * Return a string that represents this score
	 */
	show() {
		return `${this.valueAsString}%`;
	}
}
