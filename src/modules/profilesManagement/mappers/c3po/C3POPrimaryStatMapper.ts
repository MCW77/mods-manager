import { PrimaryStats } from "../../../../domain/Stats";
import type * as C3PODTOs from "../../dtos/c3po";

export class PrimaryStatMapper {
	static C3PO2GIMOPrimaryStatNameMap: {
		[key in C3PODTOs.PrimaryStatNames]: PrimaryStats.GIMOStatNames;
	} = {
		Accuracy: "Accuracy %",
		"Critical Avoidance": "Critical Avoidance %",
		"Critical Chance": "Critical Chance %",
		"Critical Damage": "Critical Damage %",
		"Defense %": "Defense %",
		"Health %": "Health %",
		"Offense %": "Offense %",
		Potency: "Potency %",
		"Protection %": "Protection %",
		Speed: "Speed",
		Tenacity: "Tenacity %",
	};

	static fromC3PO(
		primary: C3PODTOs.C3POPrimaryStatDTO,
	): PrimaryStats.PrimaryStat {
		return new PrimaryStats.PrimaryStat(
			PrimaryStatMapper.C3PO2GIMOPrimaryStatNameMap[primary.primaryStatName],
			primary.primaryStatValue,
		);
	}
}
