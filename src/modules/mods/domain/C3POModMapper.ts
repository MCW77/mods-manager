import { fromC3PO as fromC3POPrimary } from "./C3POPrimaryStatMapper";
import { fromC3PO as fromC3POSecondary } from "./C3POSecondaryStatMapper";

import { ModTiersEnum } from "#/constants/enums";
import type * as ModTypes from "#/domain/types/ModTypes";
import type {
	C3PODefinitionId,
	C3POMod,
	C3POPips,
	C3POSet,
	C3POSlots,
	C3POTier,
} from "./C3POMod";
import type { GIMOSetStatNames } from "#/domain/GIMOStatNames";
import { createMod, type Mod } from "#/domain/Mod";
import type { Pips } from "#/domain/Pips";
import type { SecondaryStat } from "#/domain/SecondaryStat";

const C3PO2GIMOSetMap: {
	[key in C3POSet]: GIMOSetStatNames;
} = {
	"1": "Health %",
	"2": "Offense %",
	"3": "Defense %",
	"4": "Speed %",
	"5": "Critical Chance %",
	"6": "Critical Damage %",
	"7": "Potency %",
	"8": "Tenacity %",
};

const C3PO2GIMOTiersMap: {
	[key in C3POTier]: ModTiersEnum;
} = {
	5: ModTiersEnum.Gold,
	4: ModTiersEnum.Purple,
	3: ModTiersEnum.Blue,
	2: ModTiersEnum.Green,
	1: ModTiersEnum.Grey,
};

const C3PO2GIMOPipsMap = {
	"5": 5,
	"6": 6,
} as const satisfies Record<C3POPips, Pips>;

const C3PO2GIMOSlotMap: Record<C3POSlots, ModTypes.GIMOSlots> = {
	"1": "square",
	"2": "arrow",
	"3": "diamond",
	"4": "triangle",
	"5": "circle",
	"6": "cross",
};

const deconstructDefinitionId = (definitionId: C3PODefinitionId) => {
	const set = C3PO2GIMOSetMap[definitionId[0]];
	const pips = C3PO2GIMOPipsMap[definitionId[1]];
	const slot = C3PO2GIMOSlotMap[definitionId[2]];
	return { set, pips, slot };
};

export function fromC3PO(mod: C3POMod): Mod {
	const secondaryStats: SecondaryStat[] = [];
	for (const [index, secondaryStat] of mod.secondaryStat.entries()) {
		secondaryStats.push(fromC3POSecondary(String(index), secondaryStat));
	}

	const definition = deconstructDefinitionId(mod.definitionId);

	return createMod(
		mod.id,
		definition.slot,
		definition.set,
		Number(mod.level) as ModTypes.Levels,
		definition.pips,
		fromC3POPrimary(mod.primaryStat),
		secondaryStats,
		"null",
		mod.reRolledCount,
		0,
		C3PO2GIMOTiersMap[mod.tier],
	);
}
