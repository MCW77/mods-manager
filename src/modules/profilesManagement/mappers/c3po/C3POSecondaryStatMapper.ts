import { SecondaryStats } from "../../../../domain/Stats";
import type * as C3PO from "../../dtos/c3po";

type t = C3PO.SecondaryStatNames;
export class SecondaryStatMapper {
	static C3PO2GIMOSecondaryStatNameMap: {
		[key in C3PO.SecondaryStatNames]: SecondaryStats.GIMOStatNames;
	} = {
		"": "Health",
		"Critical Chance": "Critical Chance %",
		Defense: "Defense",
		"Defense %": "Defense %",
		Health: "Health",
		"Health %": "Health %",
		Offense: "Offense",
		"Offense %": "Offense %",
		Potency: "Potency %",
		Protection: "Protection",
		"Protection %": "Protection %",
		Speed: "Speed",
		Tenacity: "Tenacity %",
	};

	static fromC3PO(
		secondary: C3PO.C3POSecondaryStatDTO,
	): SecondaryStats.SecondaryStat {
		return new SecondaryStats.SecondaryStat(
			SecondaryStatMapper.C3PO2GIMOSecondaryStatNameMap[secondary.name],
			secondary.value,
			Number(secondary.rolls) as SecondaryStats.Rolls,
		);
	}
}
