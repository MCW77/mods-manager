// domain
import type { GIMOSetStatNames } from "./GIMOStatNames";
import { type Stat, createStat, getDisplayType, mixedTypes } from "./Stat";

// #region HUStatNames
type HUStatNames =
	| "Offense"
	| "Speedpercentadditive"
	| "Defense"
	| "Health"
	| "Crit Chance"
	| "Crit Damage"
	| "Resistance"
	| "Potency";
// #endregion

interface SetStat extends Stat {
	type: GIMOSetStatNames;
}

const statNames: GIMOSetStatNames[] = [
	"Offense %",
	"Speed %",
	"Defense %",
	"Health %",
	"Critical Chance %",
	"Critical Damage %",
	"Tenacity %",
	"Potency %",
];

const HU2GIMOStatNamesMap: { [key in HUStatNames]: GIMOSetStatNames } = {
	"Crit Chance": "Critical Chance %",
	"Crit Damage": "Critical Damage %",
	Defense: "Defense %",
	Health: "Health %",
	Offense: "Offense %",
	Potency: "Potency %",
	Resistance: "Tenacity %",
	Speedpercentadditive: "Speed %",
};

function createSetStat(type: GIMOSetStatNames, value: string): SetStat {
	const stat = createStat(value);
	stat.type = type;
	stat.displayModifier = stat.type.endsWith("%") ? "%" : "";
	stat.isPercentVersion =
		stat.displayModifier === "%" && mixedTypes.includes(getDisplayType(stat));
	return stat as SetStat;
}

export {
	statNames,
	HU2GIMOStatNamesMap,
	type SetStat,
	type HUStatNames,
	createSetStat,
};
