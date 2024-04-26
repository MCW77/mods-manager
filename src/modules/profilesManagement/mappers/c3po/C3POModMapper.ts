import type * as ModTypes from "../../../../domain/types/ModTypes";
import { ModTiersEnum } from "../../../../constants/enums";

import type * as DTOs from "../../dtos";
import * as C3POMappers from "./";
import * as GIMOMods from "../../../../domain/Mod";
import type * as GIMOStats from "../../../../domain/Stats";

export class ModMapper {
	static C3PO2GIMOSetMap: {
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

	static C3PO2GIMOTiersMap: {
		[key in DTOs.C3PO.Tier]: ModTiersEnum;
	} = {
		A: ModTiersEnum.Gold,
		B: ModTiersEnum.Purple,
		C: ModTiersEnum.Blue,
		D: ModTiersEnum.Green,
		E: ModTiersEnum.Grey,
	};

	private modIds: Generator<string, string, unknown>;
	constructor() {
		this.modIds = this.uniqueModIdGenerator();
	}
	private *uniqueModIdGenerator() {
		let count = 1;
		while (true) {
			yield `unequippedMod${count++}`;
		}
		return "done";
	}

	fromC3PO(mod: DTOs.C3PO.C3POModDTO): GIMOMods.Mod {
		type secondaryPos = 1 | 2 | 3 | 4;
		const secondaryStats: GIMOStats.SecondaryStats.SecondaryStat[] = [];

		const secondaryPosArray: secondaryPos[] = [1, 2, 3, 4];

		for (const pos of secondaryPosArray) {
			if (mod[`secondaryStat-${pos}-Name`] !== undefined) {
				secondaryStats.push(
					C3POMappers.SecondaryStatMapper.fromC3PO({
						name: mod[`secondaryStat-${pos}-Name`]!,
						value: mod[`secondaryStat-${pos}-Value`],
						rolls: mod[`secondaryStat-${pos}-Roll`]!,
					}),
				);
			}
		}

		return new GIMOMods.Mod(
			this.modIds.next().value,
			mod.slot.toLowerCase() as ModTypes.GIMOSlots,
			ModMapper.C3PO2GIMOSetMap[mod.setName],
			Number(mod.level) as ModTypes.Levels,
			Number(mod.pips) as ModTypes.Pips,
			C3POMappers.PrimaryStatMapper.fromC3PO({
				primaryStatName: mod.primaryStatName,
				primaryStatValue: mod.primaryStatValue,
			}),
			secondaryStats,
			"null",
			ModMapper.C3PO2GIMOTiersMap[mod.tier],
		);
	}
}
