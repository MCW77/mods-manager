import type * as ModTypes from "../../../../domain/types/ModTypes";
import { ModTiersEnum } from "../../../../constants/enums";

import type * as DTOs from "../../dtos";
import { fromC3PO as fromC3POPrimary } from "./C3POPrimaryStatMapper";
import { fromC3PO as fromC3POSecondary } from "./C3POSecondaryStatMapper";
import * as GIMOMods from "../../../../domain/Mod";
import type * as GIMOStats from "../../../../domain/Stats";

const C3PO2GIMOSetMap: {
	[key in DTOs.C3PO.Set]: GIMOStats.SetStats.GIMOStatNames;
} = {
	"Critical Chance": "Critical Chance %",
	"Critical Damage": "Critical Damage %",
	"Defense %": "Defense %",
	"Health %": "Health %",
	"Offense %": "Offense %",
	Potency: "Potency %",
	"Speed %": "Speed %",
	Tenacity: "Tenacity %",
};

const C3PO2GIMOTiersMap: {
	[key in DTOs.C3PO.Tier]: ModTiersEnum;
} = {
	A: ModTiersEnum.Gold,
	B: ModTiersEnum.Purple,
	C: ModTiersEnum.Blue,
	D: ModTiersEnum.Green,
	E: ModTiersEnum.Grey,
};

const modIds: Generator<string, string, unknown> =
	(function* uniqueModIdGenerator() {
		let count = 1;
		while (true) {
			yield `unequippedMod${count++}`;
		}
		return "done";
	})();

export function fromC3PO(mod: DTOs.C3PO.C3POModDTO): GIMOMods.Mod {
	type secondaryPos = "1" | "2" | "3" | "4";
	const secondaryStats: GIMOStats.SecondaryStats.SecondaryStat[] = [];

	const secondaryPosArray: secondaryPos[] = ["1", "2", "3", "4"];

	for (const pos of secondaryPosArray) {
		if (mod[`secondaryStat-${pos}-Name`] !== undefined) {
			secondaryStats.push(
				fromC3POSecondary(pos, {
					name: mod[`secondaryStat-${pos}-Name`],
					value: mod[`secondaryStat-${pos}-Value`],
					rolls: mod[`secondaryStat-${pos}-Roll`],
				}),
			);
		}
	}

	return new GIMOMods.Mod(
		modIds.next().value,
		mod.slot.toLowerCase() as ModTypes.GIMOSlots,
		C3PO2GIMOSetMap[mod.setName],
		Number(mod.level) as ModTypes.Levels,
		Number(mod.pips) as ModTypes.Pips,
		fromC3POPrimary({
			primaryStatName: mod.primaryStatName,
			primaryStatValue: mod.primaryStatValue,
		}),
		secondaryStats,
		"null",
		0,
		C3PO2GIMOTiersMap[mod.tier],
	);
}
