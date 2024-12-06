import type { GIMOSecondaryStatNames } from "#/domain/GIMOStatNames";
import { type Rolls, SecondaryStat } from "#/domain/SecondaryStat";
import type * as C3PO from "../../dtos/c3po";

const c3PO2GIMOSecondaryStatNameMap: {
	[key in C3PO.SecondaryStatNames]: GIMOSecondaryStatNames;
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

const fromC3PO = (
	id: string,
	secondary: C3PO.C3POSecondaryStatDTO,
): SecondaryStat => {
	return new SecondaryStat(
		id,
		c3PO2GIMOSecondaryStatNameMap[secondary.name],
		secondary.value,
		Number(secondary.rolls) as Rolls,
	);
};

export { fromC3PO };
