// utils
import {
	toScaled,
	fromScaled,
	mulScaled,
	divScaled,
} from "../utils/scaledNumber";

// domain
import type { GIMOSecondaryStatNames } from "./GIMOStatNames";
import {
	type Stat,
	mixedTypes,
	getDisplayType,
	setStatValue,
	createStat,
} from "./Stat";

type HUNeutralStats = "Speed" | "Potency %" | "Resistance %";
type HUOffensiveStats = "Offense" | "Offense %" | "Crit Chance %";
// #region HUDefensiveStats
type HUDefensiveStats =
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

interface SecondaryStat extends Stat {
	id: string;
	rolls: Rolls;
	score: SecondaryStatScore;
	type: GIMOSecondaryStatNames;
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

function getStatScoreTier(statScore: SecondaryStatScore) {
	return Math.floor(fromScaled(divScaled(statScore.scaledValue, toScaled(20))));
}

function cloneStat(stat: SecondaryStat): SecondaryStat {
	return createSecondaryStat(stat.id, stat.type, stat.stringValue, stat.rolls);
}

function downgradeSecondaryStat(stat: SecondaryStat): SecondaryStat {
	const downgradedValue = divScaled(
		stat.scaledValue,
		scaledUpgradeFactors[stat.type],
	);
	const result = createSecondaryStat(
		stat.id,
		stat.type,
		`${fromScaled(downgradedValue)}`,
		stat.rolls,
	);

	if (stat.type === "Speed")
		setStatValue(result, fromScaled(result.scaledValue - toScaled(1)));

	return result;
}

/**
 * Return the value this stat would have if it were upgraded on a mod sliced from 5A to 6E
 * @returns {SecondaryStat}
 */
function upgradeSecondaryStat(stat: SecondaryStat): SecondaryStat {
	const upgradedValue = mulScaled(
		stat.scaledValue,
		scaledUpgradeFactors[stat.type],
	);
	const result = createSecondaryStat(
		stat.id,
		stat.type,
		`${fromScaled(upgradedValue)}`,
		stat.rolls,
	);

	if (stat.type === "Speed")
		setStatValue(result, fromScaled(result.scaledValue + toScaled(1)));

	return result;
}

function fromHotUtils(
	id: string,
	type: HUStatNames,
	value: string,
	rolls: StrRolls = "1",
) {
	return createSecondaryStat(
		id,
		HU2GIMOStatNamesMap[type],
		value,
		+rolls as Rolls,
	);
}

function serializeSecondaryStat(
	stat: SecondaryStat,
): [GIMOSecondaryStatNames, string, StrRolls] {
	return [stat.type, stat.stringValue, `${stat.rolls}` as StrRolls];
}

/**
 * Return a CSS class to represent this stat
 */
function getRollsTier(stat: SecondaryStat): number {
	return stat.rolls - 1;
}

function calculateScore(stat: SecondaryStat): void {
	stat.score = createStatScore(stat);
}

function createSecondaryStat(
	id: string,
	type: GIMOSecondaryStatNames,
	value: string,
	rolls = 1 as Rolls,
): SecondaryStat {
	const stat = createStat(value) as SecondaryStat;
	stat.id = id;
	stat.rolls = rolls;
	stat.type = type;
	stat.displayModifier = stat.type.endsWith("%") ? "%" : "";
	stat.isPercentVersion =
		stat.displayModifier === "%" && mixedTypes.includes(getDisplayType(stat));
	stat.score = { scaledValue: 0, valueAsString: "0%" };
	return stat;
}

const HU2GIMOStatNamesMap: { [key in HUStatNames]: GIMOSecondaryStatNames } = {
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

const scaledUpgradeFactors: { [key in GIMOSecondaryStatNames]: number } = {
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

const statNames: Readonly<GIMOSecondaryStatNames[]> = [
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

export {
	calculateScore,
	cloneStat,
	createSecondaryStat,
	downgradeSecondaryStat,
	fromHotUtils,
	getRollsTier,
	getStatScoreTier,
	serializeSecondaryStat,
	upgradeSecondaryStat,
	statNames,
	type SecondaryStat,
};
