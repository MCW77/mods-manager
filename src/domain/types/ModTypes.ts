import type { CharacterNames } from "#/constants/CharacterNames.js";
import type { ModTiersEnum } from "../../constants/enums.js";
import type {
	GIMOPrimaryStatNames,
	GIMOSecondaryStatNames,
	GIMOSetStatNames,
} from "../GIMOStatNames.js";
import type { Pips } from "../Pips.js";
import type { HUStatNames as HUPrimaryStatNames } from "../PrimaryStat.js";
import type {
	HUStatNames as HUSecondaryStatNames,
	StrRolls,
} from "../SecondaryStat.js";
import type { HUStatNames as HUSetStatNames } from "../SetStat.js";

export const levels = [
	1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
] as const;
export type Levels = (typeof levels)[number];

export const gimoSlots = [
	"square",
	"arrow",
	"diamond",
	"triangle",
	"circle",
	"cross",
] as const;
export type GIMOSlots = (typeof gimoSlots)[number];
export type HUSlots =
	| "Transmitter"
	| "Receiver"
	| "Processor"
	| "Holo-Array"
	| "Data-Bus"
	| "Multiplexer";
export const variablePrimarySlots = [
	"arrow",
	"triangle",
	"circle",
	"cross",
] as const;
export type VariablePrimarySlots = (typeof variablePrimarySlots)[number];

type t2 = 1 | 2 | 3 | 4;
type t4 = `secondaryType_${t2}`;
type t5 = `secondaryValue_${t2}`;
type t6 = `secondaryRoll_${t2}`;

export type FlatHUModTypeIndexer = {
	[key in t4]: HUSecondaryStatNames | null;
};
export type FlatGIMOModTypeIndexer = {
	[key in t4]: GIMOSecondaryStatNames | null;
};
export type FlatModValueIndexer = {
	[key in t5]: string | null;
};
export type FlatModRollIndexer = {
	[key in t6]: StrRolls | null;
};

export type HUFlatMod = {
	mod_uid: string;
	primaryBonusType: HUPrimaryStatNames;
	primaryBonusValue: string;

	secondaryType_1: HUSecondaryStatNames | null;
	secondaryValue_1: string;
	secondaryRoll_1: StrRolls | null;
	secondaryType_2: HUSecondaryStatNames | null;
	secondaryValue_2: string;
	secondaryRoll_2: StrRolls | null;
	secondaryType_3: HUSecondaryStatNames | null;
	secondaryValue_3: string;
	secondaryRoll_3: StrRolls | null;
	secondaryType_4: HUSecondaryStatNames | null;
	secondaryValue_4: string;
	secondaryRoll_4: StrRolls | null;

	slot: HUSlots;
	set: HUSetStatNames;
	level: Levels;
	pips: Pips;
	tier: ModTiersEnum;
	characterID: CharacterNames | "null";
	reRolledCount: number;
} & FlatHUModTypeIndexer &
	FlatModValueIndexer &
	FlatModRollIndexer;

export type GIMOFlatMod = {
	mod_uid: string;
	primaryBonusType: GIMOPrimaryStatNames;
	primaryBonusValue: string;

	secondaryType_1: GIMOSecondaryStatNames | null;
	secondaryValue_1: string;
	secondaryRoll_1: StrRolls | null;
	secondaryType_2: GIMOSecondaryStatNames | null;
	secondaryValue_2: string;
	secondaryRoll_2: StrRolls | null;
	secondaryType_3: GIMOSecondaryStatNames | null;
	secondaryValue_3: string;
	secondaryRoll_3: StrRolls | null;
	secondaryType_4: GIMOSecondaryStatNames | null;
	secondaryValue_4: string;
	secondaryRoll_4: StrRolls | null;

	slot: GIMOSlots;
	set: GIMOSetStatNames;
	level: Levels;
	pips: Pips;
	tier: ModTiersEnum;
	characterID: CharacterNames | "null";
	reRolledCount: number;
	speedRemainder?: number;
} & FlatGIMOModTypeIndexer &
	FlatModValueIndexer &
	FlatModRollIndexer;
