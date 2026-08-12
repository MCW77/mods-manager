// domain
import { fromScaled } from "../utils/scaledNumber";
import type { GIMOCharacterSummaryStatNames } from "./GIMOStatNames";
import { createStat, setStatValue, type Stat } from "./Stat";

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

interface CharacterSummaryStat extends Stat {
	type: GIMOCharacterSummaryStatNames;
}

function cloneStat(stat: CharacterSummaryStat): CharacterSummaryStat {
	return createCharacterSummaryStat(stat.type, stat.stringValue);
}

/**
 * Add two stats together, producing a new stat with the sum of their values
 * @param stat1 {CharacterSummaryStat}
 * @param stat2 {CharacterSummaryStat}
 * @returns {CharacterSummmaryStat} with the same type and a value representing the sum
 */
function addCSStats(
	stat1: CharacterSummaryStat,
	stat2: CharacterSummaryStat,
): CharacterSummaryStat {
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
function subtractCSStats(
	stat1: CharacterSummaryStat,
	stat2: CharacterSummaryStat,
): CharacterSummaryStat {
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

function createCharacterSummaryStat(
	type: GIMOCharacterSummaryStatNames,
	value: string,
): CharacterSummaryStat {
	const stat = createStat(value);
	stat.type = type;
	stat.displayModifier = stat.type.endsWith("%") ? "%" : "";
	return stat as CharacterSummaryStat;
}

export {
	type CharacterSummaryStat,
	addCSStats,
	createCharacterSummaryStat,
	getDisplayType,
	subtractCSStats,
};
