import type { GIMOPrimaryStatNames } from "#/domain/GIMOStatNames";
import { PrimaryStats } from "../../../../domain/Stats";
import type * as C3PODTOs from "../../dtos/c3po";

const c3PO2GIMOPrimaryStatNameMap: {
	[key in C3PODTOs.PrimaryStatNames]: GIMOPrimaryStatNames;
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

const fromC3PO = (
	primary: C3PODTOs.C3POPrimaryStatDTO,
): PrimaryStats.PrimaryStat => {
	return new PrimaryStats.PrimaryStat(
		c3PO2GIMOPrimaryStatNameMap[primary.primaryStatName],
		primary.primaryStatValue,
	);
};

export { fromC3PO };
