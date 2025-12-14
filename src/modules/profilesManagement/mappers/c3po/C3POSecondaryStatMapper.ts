import type { GIMOSecondaryStatNames } from "#/domain/GIMOStatNames";
import { type Rolls, SecondaryStat } from "#/domain/SecondaryStat";
import type * as C3PO from "../../dtos/c3po/index";

const c3PO2GIMOSecondaryStatNameMap: {
	[key in C3PO.SecondaryStatNames]: GIMOSecondaryStatNames;
} = {
	1: "Health",
	5: "Speed",
	17: "Potency %",
	18: "Tenacity %",
	28: "Protection",
	41: "Offense",
	42: "Defense",
	48: "Offense %",
	49: "Defense %",
	53: "Critical Chance %",
	55: "Health %",
	56: "Protection %",
};

const fromC3PO = (
	id: string,
	secondary: C3PO.C3POSecondaryStatDTO,
): SecondaryStat => {
	let statValue = "";
	if (
		secondary.stat.unitStatId === 1 ||
		secondary.stat.unitStatId === 5 ||
		secondary.stat.unitStatId === 28 ||
		secondary.stat.unitStatId === 41 ||
		secondary.stat.unitStatId === 42
	) {
		statValue = String(
			Math.trunc(Number(secondary.stat.statValueDecimal) / 10000),
		);
	} else statValue = (Number(secondary.stat.statValueDecimal) / 100).toFixed(2);
	return new SecondaryStat(
		id,
		c3PO2GIMOSecondaryStatNameMap[secondary.stat.unitStatId],
		statValue,
		secondary.statRolls as Rolls,
	);
};

export { fromC3PO };
