// utils
import { toScaled, fromScaled } from "../utils/scaledNumber";

// domain
import type * as CharacterStatNames from "../modules/profilesManagement/domain/CharacterStatNames";
import type { AllGIMOStatNames } from "./GIMOStatNames";

// #region DisplayStatNames
type DisplayStatNames =
	| "Health"
	| "Protection"
	| "Speed"
	| "Critical Damage"
	| "Potency"
	| "Tenacity"
	| "Offense"
	| "Physical Damage"
	| "Special Damage"
	| "Critical Chance"
	| "Physical Critical Chance"
	| "Special Critical Chance"
	| "Defense"
	| "Armor"
	| "Resistance"
	| "Accuracy"
	| "Critical Avoidance"
	| "Effective Health (physical)"
	| "Effective Health (special)"
	| "Average Damage (physical)"
	| "Average Damage (special)";
// #endregion

type Display2CSBasicStatNamesMap = Readonly<{
	[key in DisplayStatNames]: Readonly<CharacterStatNames.All[]>;
}>;

type GIMO2DisplayStatNamesMap = Readonly<{
	[key in AllGIMOStatNames]: DisplayStatNames;
}>;

type DisplayedStat = `${string} ${DisplayStatNames}`;

interface Stat {
	displayValue: string;
	stringValue: string;
	scaledValue: number; // Stores scaled integer (value * 1,000,000)
	type: AllGIMOStatNames;
	displayModifier: "" | "%";
	isPercentVersion: boolean;
}

const display2CSGIMOStatNamesMap: Display2CSBasicStatNamesMap = Object.freeze({
	Health: ["Health"],
	Protection: ["Protection"],
	Speed: ["Speed"],
	"Critical Damage": ["Critical Damage %"],
	Potency: ["Potency %"],
	Tenacity: ["Tenacity %"],
	Offense: ["Physical Damage", "Special Damage"],
	"Physical Damage": ["Physical Damage"],
	"Special Damage": ["Special Damage"],
	"Critical Chance": [
		"Physical Critical Chance %",
		"Special Critical Chance %",
	],
	"Physical Critical Chance": ["Physical Critical Chance %"],
	"Special Critical Chance": ["Special Critical Chance %"],
	Defense: ["Armor", "Resistance"],
	Armor: ["Armor"],
	Resistance: ["Resistance"],
	Accuracy: ["Accuracy %"],
	"Critical Avoidance": ["Critical Avoidance %"],
	"Effective Health (physical)": [],
	"Effective Health (special)": [],
	"Average Damage (physical)": [],
	"Average Damage (special)": [],
} as const);

const gimo2DisplayStatNamesMap: GIMO2DisplayStatNamesMap = {
	Health: "Health",
	"Health %": "Health",
	Protection: "Protection",
	"Protection %": "Protection",
	Speed: "Speed",
	"Speed %": "Speed",
	"Critical Damage %": "Critical Damage",
	"Potency %": "Potency",
	"Tenacity %": "Tenacity",
	"Physical Damage": "Physical Damage",
	"Special Damage": "Special Damage",
	"Critical Chance %": "Critical Chance",
	"Physical Critical Chance %": "Physical Critical Chance",
	"Special Critical Chance %": "Special Critical Chance",
	Defense: "Defense",
	"Defense %": "Defense",
	Offense: "Offense",
	"Offense %": "Offense",
	Armor: "Armor",
	Resistance: "Resistance",
	"Accuracy %": "Accuracy",
	"Critical Avoidance %": "Critical Avoidance",
	"Effective Health (physical)": "Effective Health (physical)",
	"Effective Health (special)": "Effective Health (special)",
	"Average Damage (physical)": "Average Damage (physical)",
	"Average Damage (special)": "Average Damage (special)",
};

// A list of stat types that can be either a flat value or a percent
const mixedTypes: DisplayStatNames[] = [
	"Health",
	"Protection",
	"Offense",
	"Physical Damage",
	"Special Damage",
	"Speed",
	"Defense",
	"Armor",
	"Resistance",
];

function getDisplayType(stat: Stat): DisplayStatNames {
	return gimo2DisplayStatNamesMap[stat.type];
}

/**
 * Return only the value of the stat as a string
 * @returns {string}
 */
function getDisplayValueString(stat: Stat): string {
	return `${stat.displayValue}${stat.displayModifier}`;
}

/**
 * Return the value and it's type of the stat as a string
 * @returns {string}
 */
function getDisplayValueAndTypeString(stat: Stat): DisplayedStat {
	return `${getDisplayValueString(stat)} ${getDisplayType(stat)}`;
}

/**
 * Update the displayed value for this stat to match the value held in the stat. This is useful if the stat
 * value was updated
 */
function updateDisplayValue(stat: Stat): void {
	const numValue = fromScaled(stat.scaledValue);
	stat.displayValue = `${
		numValue % 1 ? Math.round(numValue * 100) / 100 : numValue
	}`;
}

function getStatValue(stat: Stat): number {
	return fromScaled(stat.scaledValue);
}

function setStatValue(stat: Stat, value: number): void {
	stat.scaledValue = toScaled(value);
	stat.stringValue = fromScaled(stat.scaledValue).toString();
	updateDisplayValue(stat);
}

function createStat(value: string): Stat {
	const stat: Stat = {
		displayValue: "0",
		stringValue: "0",
		scaledValue: 0,
		type: "Health",
		displayModifier: "",
		isPercentVersion: false,
	};
	setStatValue(stat, Number(value));
	return stat;
}

export {
	display2CSGIMOStatNamesMap,
	gimo2DisplayStatNamesMap,
	mixedTypes,
	type DisplayStatNames,
	type DisplayedStat,
	type Stat,
	createStat,
	getDisplayType,
	getDisplayValueString,
	getDisplayValueAndTypeString,
	updateDisplayValue,
	getStatValue,
	setStatValue,
};
