// utils
import {
	toScaled,
	fromScaled,
	mulScaled,
	divScaled,
} from "../utils/scaledNumber";

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

export const strRolls = ["1", "2", "3", "4", "5"] as const;
export type StrRolls = (typeof strRolls)[number];

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

	static scaledUpgradeFactors: { [key in GIMOSecondaryStatNames]: number } = {
		"Critical Chance %": toScaled(1.045),
		Defense: toScaled(1.63),
		"Defense %": toScaled(2.34),
		Health: toScaled(1.26),
		"Health %": toScaled(1.86),
		Offense: toScaled(1.1),
		"Offense %": toScaled(3.02),
		"Potency %": toScaled(1.33),
		Protection: toScaled(1.11),
		"Protection %": toScaled(1.33),
		Speed: toScaled(1),
		"Tenacity %": toScaled(1.33),
	};

	id: string;
	type: GIMOSecondaryStatNames;
	rolls: Rolls;
	score: SecondaryStatScore;

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
		this.score = { scaledValue: 0, valueAsString: "0%" };
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
		this.score = createStatScore(this);
	}

	/**
	 * Return the value this stat would have if it were upgraded on a mod sliced from 5A to 6E
	 * @returns {SecondaryStat}
	 */
	upgrade(): SecondaryStat {
		const upgradedValue = mulScaled(
			this.scaledValue,
			SecondaryStat.scaledUpgradeFactors[this.type],
		);
		const result = new SecondaryStat(
			this.id,
			this.type,
			`${fromScaled(upgradedValue)}`,
			this.rolls,
		);

		if (this.type === "Speed")
			result.value = fromScaled(result.scaledValue + toScaled(1));

		return result;
	}

	downgrade(): SecondaryStat {
		const downgradedValue = divScaled(
			this.scaledValue,
			SecondaryStat.scaledUpgradeFactors[this.type],
		);
		const result = new SecondaryStat(
			this.id,
			this.type,
			`${fromScaled(downgradedValue)}`,
			this.rolls,
		);

		if (this.type === "Speed")
			result.value = fromScaled(result.scaledValue - toScaled(1));

		return result;
	}

	serialize(): [GIMOSecondaryStatNames, string, StrRolls] {
		return [this.type, this.stringValue, `${this.rolls}` as StrRolls];
	}

	/**
	 * Return a CSS class to represent this stat
	 */
	getRollsTier() {
		return this.rolls - 1;
	}
}

interface SecondaryStatScore {
	scaledValue: number;
	valueAsString: string;
}

const statInfo: {
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

function createStatScore(stat: SecondaryStat): SecondaryStatScore {
	const currentStatInfo = statInfo[stat.type];
	let statIntValue: number;
	if (stat.displayModifier === "%")
		statIntValue = mulScaled(
			stat.scaledValue,
			toScaled(10 ** (currentStatInfo.decimalPoints - 2)),
		);
	else statIntValue = stat.scaledValue;

	const intDistance =
		statIntValue - toScaled(currentStatInfo.intMin * stat.rolls) + toScaled(1);
	const onePercentEquivalent = divScaled(
		toScaled(currentStatInfo.intCount * stat.rolls) -
			toScaled(stat.rolls) +
			toScaled(1),
		toScaled(100),
	);
	return {
		scaledValue: divScaled(intDistance, onePercentEquivalent),
		valueAsString: `${fromScaled(divScaled(intDistance, onePercentEquivalent)).toFixed(2)}%`,
	};
}

export function getStatScoreTier(statScore: SecondaryStatScore) {
	return Math.floor(fromScaled(divScaled(statScore.scaledValue, toScaled(20))));
}
