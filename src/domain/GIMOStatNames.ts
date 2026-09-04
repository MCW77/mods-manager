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

const gimoPrimaryStatNames = [
	...gimoPrimaryNeutralStats,
	...gimoPrimaryOffensiveStats,
	...gimoPrimaryDefensiveStats,
] as const;

type GIMOPrimaryStatNames =
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
const gimoSecondaryStatNames = [
	...gimoSecondaryNeutralStats,
	...gimoSecondaryOffensiveStats,
	...gimoSecondaryDefensiveStats,
] as const;
type GIMOSecondaryNeutralStats = (typeof gimoSecondaryNeutralStats)[number];
type GIMOSecondaryOffensiveStats = (typeof gimoSecondaryOffensiveStats)[number];
type GIMOSecondaryDefensiveStats = (typeof gimoSecondaryDefensiveStats)[number];

type GIMOSecondaryStatNames =
	| GIMOSecondaryNeutralStats
	| GIMOSecondaryOffensiveStats
	| GIMOSecondaryDefensiveStats;

// #region GIMOSetStatNames
const gimoSetStatNames = [
	"Offense %",
	"Speed %",
	"Defense %",
	"Health %",
	"Critical Chance %",
	"Critical Damage %",
	"Tenacity %",
	"Potency %",
] as const;
type GIMOSetStatNames = (typeof gimoSetStatNames)[number];
// #endregion

// #region CalculatedCharacterSummaryStatNames
type CalculatedCharacterSummaryStatNames =
	| "Effective Health (physical)"
	| "Effective Health (special)"
	| "Average Damage (physical)"
	| "Average Damage (special)";
//#endregion

type GIMOCharacterSummaryStatNames =
	| CharacterStatNames.All
	| CalculatedCharacterSummaryStatNames;
type NonCalculatedGIMOStatNames =
	| GIMOPrimaryStatNames
	| GIMOSetStatNames
	| GIMOSecondaryStatNames;

type AllGIMOStatNames =
	| NonCalculatedGIMOStatNames
	| GIMOCharacterSummaryStatNames;

const arrowPrimaryStats = [
	"Speed",
	"Accuracy %",
	"Critical Avoidance %",
	"Defense %",
	"Health %",
	"Offense %",
	"Protection %",
] as const;
type ArrowPrimaryStat = (typeof arrowPrimaryStats)[number];
type ArrowPrimaryStats = ArrowPrimaryStat[];

const circlePrimaryStats = ["Health %", "Protection %"] as const;
type CirclePrimaryStat = (typeof circlePrimaryStats)[number];
type CirclePrimaryStats = CirclePrimaryStat[];

const crossPrimaryStats = [
	"Potency %",
	"Tenacity %",
	"Defense %",
	"Health %",
	"Offense %",
	"Protection %",
] as const;
type CrossPrimaryStat = (typeof crossPrimaryStats)[number];
type CrossPrimaryStats = CrossPrimaryStat[];

const trianglePrimaryStats = [
	"Critical Chance %",
	"Critical Damage %",
	"Defense %",
	"Health %",
	"Offense %",
	"Protection %",
] as const;
type TrianglePrimaryStat = (typeof trianglePrimaryStats)[number];
type TrianglePrimaryStats = TrianglePrimaryStat[];

const allowedPrimaryStatsBySlot = {
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

export {
	type AllGIMOStatNames,
	type ArrowPrimaryStat,
	type ArrowPrimaryStats,
	type CalculatedCharacterSummaryStatNames,
	type CirclePrimaryStat,
	type CirclePrimaryStats,
	type CrossPrimaryStat,
	type CrossPrimaryStats,
	type GIMOCharacterSummaryStatNames,
	type GIMOPrimaryStatNames,
	type GIMOSecondaryStatNames,
	type GIMOSetStatNames,
	type TrianglePrimaryStat,
	type TrianglePrimaryStats,
	allowedPrimaryStatsBySlot,
	arrowPrimaryStats,
	circlePrimaryStats,
	crossPrimaryStats,
	gimoPrimaryStatNames,
	gimoSecondaryStatNames,
	gimoSetStatNames,
	trianglePrimaryStats,
};
