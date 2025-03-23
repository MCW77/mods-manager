export type SetNames =
	| "Crit Chance"
	| "Crit Damage"
	| "Defense"
	| "Health"
	| "Offense"
	| "Potency"
	| "Resistance"
	| "Speedpercentadditive";

export const gimoModsets = [
	"Potency %",
	"Tenacity %",
	"Speed %",
	"Offense %",
	"Defense %",
	"Critical Chance %",
	"Critical Damage %",
	"Health %",
] as const;
export type GIMOModsetNames = (typeof gimoModsets)[number];
