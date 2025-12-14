import type { GIMOPrimaryStatNames } from "#/domain/GIMOStatNames";
import { PrimaryStats } from "../../../../domain/Stats";
import type * as C3PODTOs from "../../dtos/c3po/index";

const c3PO2GIMOPrimaryStatNameMap: {
	[key in C3PODTOs.PrimaryStatNames]: GIMOPrimaryStatNames;
} = {
	5: "Speed",
	16: "Critical Damage %",
	17: "Potency %",
	18: "Tenacity %",
	48: "Offense %",
	49: "Defense %",
	52: "Accuracy %",
	53: "Critical Chance %",
	54: "Critical Avoidance %",
	55: "Health %",
	56: "Protection %",
};

const fromC3PO = (
	primary: C3PODTOs.C3POPrimaryStatDTO,
): PrimaryStats.PrimaryStat => {
	let statValue = "";
	if (primary.stat.unitStatId === 5) {
		statValue = String(
			Math.trunc(Number(primary.stat.statValueDecimal) / 10000),
		);
	} else statValue = (Number(primary.stat.statValueDecimal) / 100).toFixed(2);

	return new PrimaryStats.PrimaryStat(
		c3PO2GIMOPrimaryStatNameMap[primary.stat.unitStatId],
		statValue,
	);
};

export { fromC3PO };
