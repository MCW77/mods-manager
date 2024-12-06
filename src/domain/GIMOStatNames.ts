import type * as CharacterStatNames from "../modules/profilesManagement/domain/CharacterStatNames";

export type GIMOPrimaryNeutralStats = "Speed" | "Potency %" | "Tenacity %";
export type GIMOPrimaryOffensiveStats =
	| "Accuracy %"
	| "Critical Chance %"
	| "Critical Damage %"
	| "Offense %";
export type GIMOPrimaryDefensiveStats =
	| "Critical Avoidance %"
	| "Defense %"
	| "Health %"
	| "Protection %";

export type GIMOPrimaryStatNames =
	| GIMOPrimaryNeutralStats
	| GIMOPrimaryOffensiveStats
	| GIMOPrimaryDefensiveStats;

export type GIMOSecondaryNeutralStats = "Speed" | "Potency %" | "Tenacity %";
export type GIMOSecondaryOffensiveStats =
	| "Offense"
	| "Offense %"
	| "Critical Chance %";
export type GIMOSecondaryDefensiveStats =
	| "Defense"
	| "Defense %"
	| "Health"
	| "Health %"
	| "Protection"
	| "Protection %";

export type GIMOSecondaryStatNames =
	| GIMOSecondaryNeutralStats
	| GIMOSecondaryOffensiveStats
	| GIMOSecondaryDefensiveStats;

// #region GIMOSetStatNames
export type GIMOSetStatNames =
	| "Offense %"
	| "Speed %"
	| "Defense %"
	| "Health %"
	| "Critical Chance %"
	| "Critical Damage %"
	| "Tenacity %"
	| "Potency %";
// #endregion

// #region CalculatedCharacterSummaryStatNames
export type CalculatedCharacterSummaryStatNames =
	| "Effective Health (physical)"
	| "Effective Health (special)"
	| "Average Damage (physical)"
	| "Average Damage (special)";
//#endregion

export type GIMOCharacterSummaryStatNames =
	| CharacterStatNames.All
	| CalculatedCharacterSummaryStatNames;
export type NonCalculatedGIMOStatNames =
	| GIMOPrimaryStatNames
	| GIMOSetStatNames
	| GIMOSecondaryStatNames;

export type AllGIMOStatNames =
	| NonCalculatedGIMOStatNames
	| GIMOCharacterSummaryStatNames;
