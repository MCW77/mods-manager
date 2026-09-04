import type { C3POPrimaryStat } from "./C3POPrimaryStat";
import type { C3POSecondaryStat } from "./C3POSecondaryStat";

type C3POSet = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";

type C3POSlots = "1" | "2" | "3" | "4" | "5" | "6";
type C3POPips = "5" | "6";
type C3POTier = "1" | "2" | "3" | "4" | "5";
type C3POLevels =
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

type C3PODefinitionId = [C3POSet, C3POPips, C3POSlots];

type C3POMod = {
	id: string;
	definitionId: C3PODefinitionId;
	tier: C3POTier;
	level: C3POLevels;
	reRolledCount: number;
} & { primaryStat: C3POPrimaryStat } & {
	secondaryStat: C3POSecondaryStat[];
};

export type {
	C3PODefinitionId,
	C3POLevels,
	C3POMod,
	C3POPips,
	C3POSet,
	C3POSlots,
	C3POTier,
};
