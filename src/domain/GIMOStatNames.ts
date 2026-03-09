// domain
import type * as ModTypes from "#/domain/types/ModTypes";
import type * as CharacterStatNames from "../modules/profilesManagement/domain/CharacterStatNames";

const gimoPrimaryNeutralStats = ["Speed", "Potency %", "Tenacity %"] as const;
type GIMOPrimaryNeutralStats = (typeof gimoPrimaryNeutralStats)[number];

const gimoPrimaryOffensiveStats = [
	"Accuracy %",
	"Critical Chance %",
	"Critical Damage %",
	"Offense %",
] as const;
type GIMOPrimaryOffensiveStats = (typeof gimoPrimaryOffensiveStats)[number];

const gimoPrimaryDefensiveStats = [
	"Critical Avoidance %",
	"Defense %",
	"Health %",
	"Protection %",
] as const;
type GIMOPrimaryDefensiveStats = (typeof gimoPrimaryDefensiveStats)[number];

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
type GIMOSecondaryNeutralStats = (typeof gimoSecondaryNeutralStats)[number];
type GIMOSecondaryOffensiveStats = (typeof gimoSecondaryOffensiveStats)[number];
type GIMOSecondaryDefensiveStats = (typeof gimoSecondaryDefensiveStats)[number];

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
type CalculatedCharacterSummaryStatNames =
	| "Effective Health (physical)"
	| "Effective Health (special)"
	| "Average Damage (physical)"
	| "Average Damage (special)";
//#endregion

export type GIMOCharacterSummaryStatNames =
	| CharacterStatNames.All
	| CalculatedCharacterSummaryStatNames;
type NonCalculatedGIMOStatNames =
	| GIMOPrimaryStatNames
	| GIMOSetStatNames
	| GIMOSecondaryStatNames;

export type AllGIMOStatNames =
	| NonCalculatedGIMOStatNames
	| GIMOCharacterSummaryStatNames;

export const arrowPrimaryStats = [
	"Speed",
	"Accuracy %",
	"Critical Avoidance %",
	"Defense %",
	"Health %",
	"Offense %",
	"Protection %",
] as const;
export type ArrowPrimaryStats = (typeof arrowPrimaryStats)[number];

export const circlePrimaryStats = ["Health %", "Protection %"] as const;
export type CirclePrimaryStats = (typeof circlePrimaryStats)[number];

export const crossPrimaryStats = [
	"Potency %",
	"Tenacity %",
	"Defense %",
	"Health %",
	"Offense %",
	"Protection %",
] as const;
export type CrossPrimaryStats = (typeof crossPrimaryStats)[number];

export const trianglePrimaryStats = [
	"Critical Chance %",
	"Critical Damage %",
	"Defense %",
	"Health %",
	"Offense %",
	"Protection %",
] as const;
export type TrianglePrimaryStats = (typeof trianglePrimaryStats)[number];

export const allowedPrimaryStatsBySlot = {
	arrow: [
		"Speed",
		"Accuracy %",
		"Critical Avoidance %",
		"Defense %",
		"Health %",
		"Offense %",
		"Protection %",
	],
	triangle: [
		"Critical Chance %",
		"Critical Damage %",
		"Defense %",
		"Health %",
		"Offense %",
		"Protection %",
	],
	circle: ["Health %", "Protection %"],
	cross: [
		"Potency %",
		"Tenacity %",
		"Defense %",
		"Health %",
		"Offense %",
		"Protection %",
	],
} as const satisfies Record<
	ModTypes.VariablePrimarySlots,
	readonly GIMOPrimaryStatNames[]
>;
