import type * as CharacterStatNames from "../modules/profilesManagement/domain/CharacterStatNames";

export const gimoPrimaryNeutralStats = [
	"Speed",
	"Potency %",
	"Tenacity %",
] as const;
export type GIMOPrimaryNeutralStats = (typeof gimoPrimaryNeutralStats)[number];

export const gimoPrimaryOffensiveStats = [
	"Accuracy %",
	"Critical Chance %",
	"Critical Damage %",
	"Offense %",
] as const;
export type GIMOPrimaryOffensiveStats =
	(typeof gimoPrimaryOffensiveStats)[number];

export const gimoPrimaryDefensiveStats = [
	"Critical Avoidance %",
	"Defense %",
	"Health %",
	"Protection %",
] as const;
export type GIMOPrimaryDefensiveStats =
	(typeof gimoPrimaryDefensiveStats)[number];

export const gimoPrimaryStatNames = [
	...gimoPrimaryNeutralStats,
	...gimoPrimaryOffensiveStats,
	...gimoPrimaryDefensiveStats,
] as const;

export type GIMOPrimaryStatNames =
	| GIMOPrimaryNeutralStats
	| GIMOPrimaryOffensiveStats
	| GIMOPrimaryDefensiveStats;

const gimoSecondaryNeutralStats = ["Speed", "Potency %", "Tenacity %"] as const;
const gimoSecondaryOffensiveStats = [
	"Offense",
	"Offense %",
	"Critical Chance %",
] as const;
const gimoSecondaryDefensiveStats = [
	"Defense",
	"Defense %",
	"Health",
	"Health %",
	"Protection",
	"Protection %",
] as const;
export const gimoSecondaryStatNames = [
	...gimoSecondaryNeutralStats,
	...gimoSecondaryOffensiveStats,
	...gimoSecondaryDefensiveStats,
] as const;
export type GIMOSecondaryNeutralStats =
	(typeof gimoSecondaryNeutralStats)[number];
export type GIMOSecondaryOffensiveStats =
	(typeof gimoSecondaryOffensiveStats)[number];
export type GIMOSecondaryDefensiveStats =
	(typeof gimoSecondaryDefensiveStats)[number];

export type GIMOSecondaryStatNames =
	| GIMOSecondaryNeutralStats
	| GIMOSecondaryOffensiveStats
	| GIMOSecondaryDefensiveStats;

// #region GIMOSetStatNames
export const gimoSetStatNames = [
	"Offense %",
	"Speed %",
	"Defense %",
	"Health %",
	"Critical Chance %",
	"Critical Damage %",
	"Tenacity %",
	"Potency %",
] as const;
export type GIMOSetStatNames = (typeof gimoSetStatNames)[number];
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
