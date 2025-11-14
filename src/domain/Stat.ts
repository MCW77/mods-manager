// utils
import Big from "big.js";

// domain
import type * as CharacterStatNames from "../modules/profilesManagement/domain/CharacterStatNames.js";
import type { AllGIMOStatNames } from "./GIMOStatNames.js";

// #region DisplayStatNames
export type DisplayStatNames =
	| "Health"
	| "Protection"
	| "Speed"
	| "Critical Damage"
	| "Potency"
	| "Tenacity"
	| "Offense"
	| "Physical Damage"
	| "Special Damage"
	| "Critical Chance"
	| "Physical Critical Chance"
	| "Special Critical Chance"
	| "Defense"
	| "Armor"
	| "Resistance"
	| "Accuracy"
	| "Critical Avoidance"
	| "Effective Health (physical)"
	| "Effective Health (special)"
	| "Average Damage (physical)"
	| "Average Damage (special)";
// #endregion

type Display2CSBasicStatNamesMap = Readonly<{
	[key in DisplayStatNames]: Readonly<CharacterStatNames.All[]>;
}>;

export type GIMO2DisplayStatNamesMap = Readonly<{
	[key in AllGIMOStatNames]: DisplayStatNames;
}>;

export type DisplayedStat = `${string} ${DisplayStatNames}`;

export abstract class Stat {
	static display2CSGIMOStatNamesMap: Display2CSBasicStatNamesMap =
		Object.freeze({
			Health: ["Health"],
			Protection: ["Protection"],
			Speed: ["Speed"],
			"Critical Damage": ["Critical Damage %"],
			Potency: ["Potency %"],
			Tenacity: ["Tenacity %"],
			Offense: ["Physical Damage", "Special Damage"],
			"Physical Damage": ["Physical Damage"],
			"Special Damage": ["Special Damage"],
			"Critical Chance": [
				"Physical Critical Chance %",
				"Special Critical Chance %",
			],
			"Physical Critical Chance": ["Physical Critical Chance %"],
			"Special Critical Chance": ["Special Critical Chance %"],
			Defense: ["Armor", "Resistance"],
			Armor: ["Armor"],
			Resistance: ["Resistance"],
			Accuracy: ["Accuracy %"],
			"Critical Avoidance": ["Critical Avoidance %"],
			"Effective Health (physical)": [],
			"Effective Health (special)": [],
			"Average Damage (physical)": [],
			"Average Damage (special)": [],
		} as const);

	static gimo2DisplayStatNamesMap: GIMO2DisplayStatNamesMap = {
		Health: "Health",
		"Health %": "Health",
		Protection: "Protection",
		"Protection %": "Protection",
		Speed: "Speed",
		"Speed %": "Speed",
		"Critical Damage %": "Critical Damage",
		"Potency %": "Potency",
		"Tenacity %": "Tenacity",
		"Physical Damage": "Physical Damage",
		"Special Damage": "Special Damage",
		"Critical Chance %": "Critical Chance",
		"Physical Critical Chance %": "Physical Critical Chance",
		"Special Critical Chance %": "Special Critical Chance",
		Defense: "Defense",
		"Defense %": "Defense",
		Offense: "Offense",
		"Offense %": "Offense",
		Armor: "Armor",
		Resistance: "Resistance",
		"Accuracy %": "Accuracy",
		"Critical Avoidance %": "Critical Avoidance",
		"Effective Health (physical)": "Effective Health (physical)",
		"Effective Health (special)": "Effective Health (special)",
		"Average Damage (physical)": "Average Damage (physical)",
		"Average Damage (special)": "Average Damage (special)",
	};

	// A list of stat types that can be either a flat value or a percent
	static mixedTypes: DisplayStatNames[] = [
		"Health",
		"Protection",
		"Offense",
		"Physical Damage",
		"Special Damage",
		"Speed",
		"Defense",
		"Armor",
		"Resistance",
	];

	#displayValue = "0";
	abstract type: AllGIMOStatNames;
	protected stringValue = "0";
	private _value: Big = Big(0);
	displayModifier: "" | "%" = "";
	public get bigValue(): Big {
		return this._value;
	}
	public get valueString(): string {
		return this.stringValue;
	}
	get value(): number {
		return this._value.toNumber();
	}
	set value(input: number) {
		this._value = Big(input);
		this.stringValue = this._value.toString();
		this.updateDisplayValue();
	}
	isPercentVersion = false;

	constructor(value: string) {
		this.value = Number(value);
	}

	abstract clone(): this;

	getDisplayType(): DisplayStatNames {
		return Stat.gimo2DisplayStatNamesMap[this.type];
	}

	/**
	 * Update the displayed value for this stat to match the value held in the stat. This is useful if the stat
	 * value was updated
	 */
	updateDisplayValue() {
		this.#displayValue = `${
			this._value.mod(1)
				? Math.round(this._value.toNumber() * 100) / 100
				: this._value
		}`;
	}

	/**
	 * Return a string that represents this stat
	 */
	show(): DisplayedStat {
		return `${this.showValue()} ${this.getDisplayType()}`;
	}

	/**
	 * Return only the value of this stat as a string
	 * @returns {string}
	 */
	showValue(): `${string}${"" | "%"}` {
		return `${this.#displayValue}${this.displayModifier}`;
	}

	/*
    const valueSum = this._value.plus(that._value);

    let result = this.clone();
    result.rawValue = `${valueSum}`;
    return result;
*/
}
