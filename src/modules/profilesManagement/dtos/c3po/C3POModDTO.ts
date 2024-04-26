import type * as C3PODTOs from "./";

export type Set =
	| "Critical Chance"
	| "Critical Damage"
	| "Defense %"
	| "Health %"
	| "Offense %"
	| "Potency"
	| "Speed %"
	| "Tenacity";
export type Slots =
	| "Arrow"
	| "Circle"
	| "Cross"
	| "Diamond"
	| "Square"
	| "Triangle";
export type Pips = "1" | "2" | "3" | "4" | "5" | "6";
export type Tier = "A" | "B" | "C" | "D" | "E";
export type Levels =
	| "1"
	| "2"
	| "3"
	| "4"
	| "5"
	| "6"
	| "7"
	| "8"
	| "9"
	| "10"
	| "11"
	| "12"
	| "13"
	| "14"
	| "15";

export type C3POModDTO = {
	equippedUnit: string;
	setName: Set;
	slot: Slots;
	pips: Pips;
	tier: Tier;
	level: Levels;
} & C3PODTOs.C3POPrimaryStatDTO &
	C3PODTOs.C3POSecondaryStatsDTO;
