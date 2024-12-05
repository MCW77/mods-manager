// domain
import { Stat } from "./Stat";

// #region GIMOStatNames
export type GIMOStatNames =
	| "Offense %"
	| "Speed %"
	| "Defense %"
	| "Health %"
	| "Critical Chance %"
	| "Critical Damage %"
	| "Tenacity %"
	| "Potency %";
// #endregion

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
	static statNames: GIMOStatNames[] = [
		"Offense %",
		"Speed %",
		"Defense %",
		"Health %",
		"Critical Chance %",
		"Critical Damage %",
		"Tenacity %",
		"Potency %",
	];

	static HU2GIMOStatNamesMap: { [key in HUStatNames]: GIMOStatNames } = {
		"Crit Chance": "Critical Chance %",
		"Crit Damage": "Critical Damage %",
		Defense: "Defense %",
		Health: "Health %",
		Offense: "Offense %",
		Potency: "Potency %",
		Resistance: "Tenacity %",
		Speedpercentadditive: "Speed %",
	};

	type: GIMOStatNames;

	constructor(type: GIMOStatNames, value: string) {
		super(value);
		this.type = type;
		this.displayModifier = this.type.endsWith("%") ? "%" : "";
		this.isPercentVersion =
			this.displayModifier === "%" &&
			Stat.mixedTypes.includes(this.getDisplayType());
	}

	static getClassName(set: GIMOStatNames): string {
		let result: string = set;
		result = result.replace(" %", "").replace(" ", "");
		result = result[0].toLowerCase() + result.slice(1);
		return result;
	}

	clone(): this {
		return new SetStat(this.type, this.stringValue) as this;
	}

	serialize(): [GIMOStatNames, string] {
		return [this.type, this.stringValue];
	}
}
