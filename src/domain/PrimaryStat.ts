// domain
import type * as ModTypes from "./types/ModTypes";
import type * as StatTypes from "./types/StatTypes";
import { Stat } from "./Stat";

export type GIMONeutralStats = "Speed" | "Potency %" | "Tenacity %";
export type GIMOOffensiveStats =
	| "Accuracy %"
	| "Critical Chance %"
	| "Critical Damage %"
	| "Offense %";
export type GIMODefensiveStats =
	| "Critical Avoidance %"
	| "Defense %"
	| "Health %"
	| "Protection %";

export type GIMOStatNames =
	| GIMONeutralStats
	| GIMOOffensiveStats
	| GIMODefensiveStats;

export type HUNeutralStats = "Speed" | "Potency %" | "Resistance %";
export type HUOffensiveStats =
	| "Offense %"
	| "Crit Chance %"
	| "Crit Damage %"
	| "Accuracy %";
export type HUDefensiveStats =
	| "Defense %"
	| "Health %"
	| "Protection %"
	| "Crit Avoidance %";
export type HUStatNames = HUNeutralStats | HUOffensiveStats | HUDefensiveStats;

export class PrimaryStat extends Stat {
	static statNames: Readonly<GIMOStatNames[]> = [
		"Accuracy %",
		"Critical Avoidance %",
		"Critical Chance %",
		"Critical Damage %",
		"Defense %",
		"Health %",
		"Offense %",
		"Potency %",
		"Protection %",
		"Speed",
		"Tenacity %",
	] as const;

	static HU2GIMOStatNamesMap: { [key in HUStatNames]: GIMOStatNames } = {
		"Accuracy %": "Accuracy %",
		"Crit Avoidance %": "Critical Avoidance %",
		"Crit Chance %": "Critical Chance %",
		"Crit Damage %": "Critical Damage %",
		"Defense %": "Defense %",
		"Health %": "Health %",
		"Offense %": "Offense %",
		"Potency %": "Potency %",
		"Protection %": "Protection %",
		"Resistance %": "Tenacity %",
		Speed: "Speed",
	};

	static GIMO2DisplayStatNamesMap: {
		[key in GIMOStatNames]: StatTypes.DisplayStatNames;
	} = {
		"Accuracy %": "Accuracy",
		"Critical Avoidance %": "Critical Avoidance",
		"Critical Chance %": "Critical Chance",
		"Critical Damage %": "Critical Damage",
		"Defense %": "Defense",
		"Health %": "Health",
		"Offense %": "Offense",
		"Potency %": "Potency",
		"Protection %": "Protection",
		"Tenacity %": "Tenacity",
		Speed: "Speed",
	};

	// Map pips to maximum value at level 15 for each primary stat type
	static maxPrimaries: { [key in GIMOStatNames]: Map<ModTypes.Pips, string> } =
		{
			"Offense %": new Map<ModTypes.Pips, string>([
				[1, "1.88"],
				[2, "2"],
				[3, "3.88"],
				[4, "4"],
				[5, "5.88"],
				[6, "8.50"],
			]),
			"Defense %": new Map<ModTypes.Pips, string>([
				[1, "3.75"],
				[2, "4"],
				[3, "7.75"],
				[4, "8"],
				[5, "11.75"],
				[6, "20"],
			]),
			"Health %": new Map<ModTypes.Pips, string>([
				[1, "1.88"],
				[2, "2"],
				[3, "3.88"],
				[4, "4"],
				[5, "5.88"],
				[6, "16"],
			]),
			"Protection %": new Map<ModTypes.Pips, string>([
				[1, "7.5"],
				[2, "8"],
				[3, "15.5"],
				[4, "16"],
				[5, "23.5"],
				[6, "24"],
			]),
			Speed: new Map<ModTypes.Pips, string>([
				[1, "17"],
				[2, "19"],
				[3, "21"],
				[4, "26"],
				[5, "30"],
				[6, "32"],
			]),
			"Accuracy %": new Map<ModTypes.Pips, string>([
				[1, "7.5"],
				[2, "8"],
				[3, "8.75"],
				[4, "10.5"],
				[5, "12"],
				[6, "30"],
			]),
			"Critical Avoidance %": new Map<ModTypes.Pips, string>([
				[1, "15"],
				[2, "16"],
				[3, "18"],
				[4, "21"],
				[5, "24"],
				[6, "35"],
			]),
			"Critical Chance %": new Map<ModTypes.Pips, string>([
				[1, "7.50"],
				[2, "8"],
				[3, "8.75"],
				[4, "10.5"],
				[5, "12"],
				[6, "20"],
			]),
			"Critical Damage %": new Map<ModTypes.Pips, string>([
				[1, "22.50"],
				[2, "24"],
				[3, "27"],
				[4, "31.5"],
				[5, "36"],
				[6, "42"],
			]),
			"Potency %": new Map<ModTypes.Pips, string>([
				[1, "15"],
				[2, "16"],
				[3, "18"],
				[4, "21"],
				[5, "24"],
				[6, "30"],
			]),
			"Tenacity %": new Map<ModTypes.Pips, string>([
				[1, "15"],
				[2, "16"],
				[3, "18"],
				[4, "21"],
				[5, "24"],
				[6, "35"],
			]),
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

	clone(): this {
		return new PrimaryStat(this.type, this.stringValue) as this;
	}

	static fromHotUtils(type: HUStatNames, value: string) {
		return new PrimaryStat(PrimaryStat.HU2GIMOStatNamesMap[type], value);
	}

	/*
  getDisplayType(): StatTypes.AnyStat {
    return PrimaryStat.GIMO2DisplayStatNamesMap[this.type];
  }
*/

	/**
	 * Return the value this stat would have as a primary stat at level 15 for a mod of the given number of pips
	 * @param modPips ModTypes.Pips
	 */
	upgrade(modPips: ModTypes.Pips): PrimaryStat {
		return new PrimaryStat(
			this.type,
			PrimaryStat.maxPrimaries[this.type].get(modPips) ?? "0",
		);
	}

	/**
	 * Extract the type and value of this stat for serialization
	 */
	serialize(): [GIMOStatNames, string] {
		return [this.type, this.stringValue];
	}
}
