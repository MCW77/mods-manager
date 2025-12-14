// domain
import type { GIMOSetStatNames } from "./GIMOStatNames";
import { Stat } from "./Stat";

// #region HUStatNames
export type HUStatNames =
	| "Offense"
	| "Speedpercentadditive"
	| "Defense"
	| "Health"
	| "Crit Chance"
	| "Crit Damage"
	| "Resistance"
	| "Potency";
// #endregion

export class SetStat extends Stat {
	static statNames: GIMOSetStatNames[] = [
		"Offense %",
		"Speed %",
		"Defense %",
		"Health %",
		"Critical Chance %",
		"Critical Damage %",
		"Tenacity %",
		"Potency %",
	];

	static HU2GIMOStatNamesMap: { [key in HUStatNames]: GIMOSetStatNames } = {
		"Crit Chance": "Critical Chance %",
		"Crit Damage": "Critical Damage %",
		Defense: "Defense %",
		Health: "Health %",
		Offense: "Offense %",
		Potency: "Potency %",
		Resistance: "Tenacity %",
		Speedpercentadditive: "Speed %",
	};

	type: GIMOSetStatNames;

	constructor(type: GIMOSetStatNames, value: string) {
		super(value);
		this.type = type;
		this.displayModifier = this.type.endsWith("%") ? "%" : "";
		this.isPercentVersion =
			this.displayModifier === "%" &&
			Stat.mixedTypes.includes(this.getDisplayType());
	}

	static getClassName(set: GIMOSetStatNames): string {
		let result: string = set;
		result = result.replace(" %", "").replace(" ", "");
		result = result[0].toLowerCase() + result.slice(1);
		return result;
	}

	clone(): this {
		return new SetStat(this.type, this.stringValue) as this;
	}

	serialize(): [GIMOSetStatNames, string] {
		return [this.type, this.stringValue];
	}
}
