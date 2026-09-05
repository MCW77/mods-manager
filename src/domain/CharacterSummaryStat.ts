// utils
import { fromScaled } from "../utils/scaledNumber";

// domain
import type {
	CalculatedCharacterSummaryStatNames,
	GIMOCharacterSummaryStatNames,
} from "./GIMOStatNames";
import { createStat, setStatValue, type Stat } from "./Stat";
import type * as CharacterStatNames from "#/modules/profilesManagement/domain/CharacterStatNames";

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

interface CalculatedCharacterSummaryStat extends Stat {
	type: CalculatedCharacterSummaryStatNames;
}

interface NonCalculatedCharacterSummaryStat extends Stat {
	type: CharacterStatNames.All;
}

type CharacterSummaryStat =
	| NonCalculatedCharacterSummaryStat
	| CalculatedCharacterSummaryStat;

function cloneStat<
	T extends CalculatedCharacterSummaryStat | NonCalculatedCharacterSummaryStat,
>(stat: T): T {
	return createCharacterSummaryStat(stat.type, stat.stringValue) as T;
}

/**
 * Add two stats together, producing a new stat with the sum of their values
 * @param stat1 {CharacterSummaryStat}
 * @param stat2 {CharacterSummaryStat}
 * @returns {CharacterSummmaryStat} with the same type and a value representing the sum
 */
function addCSStats<
	T extends CalculatedCharacterSummaryStat | NonCalculatedCharacterSummaryStat,
>(stat1: T, stat2: T) {
	if (
		getDisplayType(stat2) !== getDisplayType(stat1) ||
		stat2.isPercentVersion !== stat1.isPercentVersion
	) {
		throw new Error("Can't add two Stats of different types");
	}

	const result = cloneStat(stat1);
	setStatValue(result, fromScaled(stat1.scaledValue + stat2.scaledValue));
	return result;
}

/**
 * Take the difference between stat1 and stat2
 *
 * @param stat1 {CharacterSummaryStat}
 * @param stat2 {CharacterSummaryStat}
 * @returns {CharacterSummmaryStat} with the same type and a value representing the difference
 */
function subtractCSStats<
	T extends CalculatedCharacterSummaryStat | NonCalculatedCharacterSummaryStat,
>(stat1: T, stat2: T): T {
	if (stat2.type !== stat1.type) {
		throw new Error(
			"Can't take the difference between Stats of different types",
		);
	}
	const valueDiff = stat1.scaledValue - stat2.scaledValue;
	const valueDiffAsNumber = fromScaled(valueDiff);
	let _strValueDiff: string;
	if (valueDiffAsNumber % 1) {
		_strValueDiff = `${valueDiffAsNumber.toFixed(2)}`;
	} else {
		_strValueDiff = `${valueDiffAsNumber}`;
	}
	const result = cloneStat(stat1);
	setStatValue(result, valueDiffAsNumber);
	//    result.rawValue = strValueDiff;
	return result;
	//    return new Stat(this.type, `${strValueDiff}${this.displayModifier}`);
}

const csGIMO2DisplayStatNamesMap: {
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

function getDisplayType(stat: CharacterSummaryStat): DisplayStatNames {
	return csGIMO2DisplayStatNamesMap[stat.type];
}

function createCharacterSummaryStat<T extends GIMOCharacterSummaryStatNames>(
	type: T,
	value: string,
): T extends CalculatedCharacterSummaryStatNames
	? CharacterSummaryStat
	: NonCalculatedCharacterSummaryStat {
	const stat = createStat(value);
	stat.type = type;
	stat.displayModifier = stat.type.endsWith("%") ? "%" : "";
	return stat as T extends CalculatedCharacterSummaryStatNames
		? CharacterSummaryStat
		: NonCalculatedCharacterSummaryStat;
}

export {
	type CharacterSummaryStat,
	type NonCalculatedCharacterSummaryStat,
	addCSStats,
	createCharacterSummaryStat,
	getDisplayType,
	subtractCSStats,
};
