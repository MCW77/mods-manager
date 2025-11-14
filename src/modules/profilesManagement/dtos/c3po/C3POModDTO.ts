import type { C3POPrimaryStatDTO } from "./C3POPrimaryStatDTO.js";
import type { C3POSecondaryStatDTO } from "./C3POSecondaryStatDTO.js";

export type Set = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";

export type Slots = "1" | "2" | "3" | "4" | "5" | "6";
export type Pips = "1" | "2" | "3" | "4" | "5" | "6";
export type Tier = "1" | "2" | "3" | "4" | "5";
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

export type DefinitionId = `${Set}${Pips}${Slots}`;

export type C3POModDTO = {
	id: string;
	definitionId: DefinitionId;
	tier: Tier;
	level: Levels;
	reRolledCount: number;
} & { primaryStat: C3POPrimaryStatDTO } & {
	secondaryStat: C3POSecondaryStatDTO[];
};
