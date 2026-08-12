// domain
import type * as StatTypes from "./types/StatTypes";
import type { GIMOPrimaryStatNames } from "./GIMOStatNames";
import type { Pips } from "./Pips";
import { type Stat, mixedTypes, getDisplayType, createStat } from "./Stat";

type HUNeutralStats = "Speed" | "Potency %" | "Resistance %";
type HUOffensiveStats =
	| "Offense %"
	| "Crit Chance %"
	| "Crit Damage %"
	| "Accuracy %";
type HUDefensiveStats =
	| "Defense %"
	| "Health %"
	| "Protection %"
	| "Crit Avoidance %";
export type HUStatNames = HUNeutralStats | HUOffensiveStats | HUDefensiveStats;

interface PrimaryStat extends Stat {
	type: GIMOPrimaryStatNames;
}

// Map pips to maximum value at level 15 for each primary stat type
const maxPrimaries: {
	[key in GIMOPrimaryStatNames]: Map<Pips, string>;
} = {
	"Offense %": new Map<Pips, string>([
		[5, "5.88"],
		[6, "8.50"],
	]),
	"Defense %": new Map<Pips, string>([
		[5, "11.75"],
		[6, "20"],
	]),
	"Health %": new Map<Pips, string>([
		[5, "5.88"],
		[6, "16"],
	]),
	"Protection %": new Map<Pips, string>([
		[5, "23.5"],
		[6, "24"],
	]),
	Speed: new Map<Pips, string>([
		[5, "30"],
		[6, "32"],
	]),
	"Accuracy %": new Map<Pips, string>([
		[5, "12"],
		[6, "30"],
	]),
	"Critical Avoidance %": new Map<Pips, string>([
		[5, "24"],
		[6, "35"],
	]),
	"Critical Chance %": new Map<Pips, string>([
		[5, "12"],
		[6, "20"],
	]),
	"Critical Damage %": new Map<Pips, string>([
		[5, "36"],
		[6, "42"],
	]),
	"Potency %": new Map<Pips, string>([
		[5, "24"],
		[6, "30"],
	]),
	"Tenacity %": new Map<Pips, string>([
		[5, "24"],
		[6, "35"],
	]),
};

const GIMO2DisplayStatNamesMap: {
	[key in GIMOPrimaryStatNames]: StatTypes.DisplayStatNames;
} = {
	"Accuracy %": "Accuracy",
	"Critical Avoidance %": "Critical Avoidance",
	"Critical Chance %": "Critical Chance",
	"Critical Damage %": "Critical Damage",
	"Defense %": "Defense",
	"Health %": "Health",
	"Offense %": "Offense",
	"Potency %": "Potency",
	"Protection %": "Protection",
	"Tenacity %": "Tenacity",
	Speed: "Speed",
};

const HU2GIMOStatNamesMap: { [key in HUStatNames]: GIMOPrimaryStatNames } = {
	"Accuracy %": "Accuracy %",
	"Crit Avoidance %": "Critical Avoidance %",
	"Crit Chance %": "Critical Chance %",
	"Crit Damage %": "Critical Damage %",
	"Defense %": "Defense %",
	"Health %": "Health %",
	"Offense %": "Offense %",
	"Potency %": "Potency %",
	"Protection %": "Protection %",
	"Resistance %": "Tenacity %",
	Speed: "Speed",
};

/**
 * Return the value this stat would have as a primary stat at level 15 for a mod of the given number of pips
 * @param modPips ModTypes.Pips
 */
function upgradePrimayStat(stat: PrimaryStat, modPips: Pips): PrimaryStat {
	return createPrimaryStat(
		stat.type,
		maxPrimaries[stat.type].get(modPips) ?? "0",
	);
}

function fromHotUtils(type: HUStatNames, value: string) {
	return createPrimaryStat(HU2GIMOStatNamesMap[type], value);
}

function createPrimaryStat(
	type: GIMOPrimaryStatNames,
	value: string,
): PrimaryStat {
	const stat = createStat(value);
	stat.type = type;
	stat.displayModifier = type.endsWith("%") ? "%" : "";
	stat.isPercentVersion =
		stat.displayModifier === "%" && mixedTypes.includes(getDisplayType(stat));
	return stat as PrimaryStat;
}

export {
	GIMO2DisplayStatNamesMap,
	createPrimaryStat,
	fromHotUtils,
	upgradePrimayStat,
	type PrimaryStat,
};
