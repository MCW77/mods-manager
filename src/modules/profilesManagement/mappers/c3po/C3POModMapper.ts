import type * as ModTypes from "../../../../domain/types/ModTypes.js";
import { ModTiersEnum } from "../../../../constants/enums.js";

import type * as DTOs from "../../dtos/index.js";
import { fromC3PO as fromC3POPrimary } from "./C3POPrimaryStatMapper.js";
import { fromC3PO as fromC3POSecondary } from "./C3POSecondaryStatMapper.js";
import * as GIMOMods from "../../../../domain/Mod.js";
import type * as GIMOStats from "../../../../domain/Stats.js";
import type { GIMOSetStatNames } from "#/domain/GIMOStatNames.js";
import type { Pips } from "#/domain/Pips.js";

const C3PO2GIMOSetMap: {
	[key in DTOs.C3PO.Set]: GIMOSetStatNames;
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
	[key in DTOs.C3PO.Tier]: ModTiersEnum;
} = {
	5: ModTiersEnum.Gold,
	4: ModTiersEnum.Purple,
	3: ModTiersEnum.Blue,
	2: ModTiersEnum.Green,
	1: ModTiersEnum.Grey,
};

const C3PO2GIMOSlotMap: Record<DTOs.C3PO.Slots, ModTypes.GIMOSlots> = {
	"1": "square",
	"2": "arrow",
	"3": "diamond",
	"4": "triangle",
	"5": "circle",
	"6": "cross",
};

const deconstructDefinitionId = (definitionId: string) => {
	const set = C3PO2GIMOSetMap[definitionId[0] as DTOs.C3PO.Set];
	const pips = Number(definitionId[1]);
	const slot = C3PO2GIMOSlotMap[definitionId[2] as DTOs.C3PO.Slots];
	return { set, pips, slot };
};

export function fromC3PO(mod: DTOs.C3PO.C3POModDTO): GIMOMods.Mod {
	const secondaryStats: GIMOStats.SecondaryStats.SecondaryStat[] = [];
	for (const [index, secondaryStat] of mod.secondaryStat.entries()) {
		secondaryStats.push(fromC3POSecondary(String(index), secondaryStat));
	}

	const definition = deconstructDefinitionId(mod.definitionId);

	return new GIMOMods.Mod(
		mod.id,
		definition.slot,
		definition.set,
		Number(mod.level) as ModTypes.Levels,
		definition.pips as Pips,
		fromC3POPrimary(mod.primaryStat),
		secondaryStats,
		"null",
		mod.reRolledCount,
		0,
		C3PO2GIMOTiersMap[mod.tier],
	);
}
