import type * as CharacterStatNames from "./CharacterStatNames";
type CharacterStatNamesIndexer = Record<CharacterStatNames.All, number>;

/**
 * A Representation of the base values of any stats that are modified by mods.
 * All values should be represented as if the character were capped out at 7* g12
 * but had no mods on.
 */

interface CharacterStats extends CharacterStatNamesIndexer {
	Health: number;
	Protection: number;
	Speed: number;
	"Critical Damage %": number;
	"Potency %": number;
	"Tenacity %": number;
	"Physical Damage": number;
	"Special Damage": number;
	Armor: number;
	Resistance: number;
	"Accuracy %": number;
	"Critical Avoidance %": number;
	"Physical Critical Chance %": number;
	"Special Critical Chance %": number;
}

function addCharacterStats(
	firstStat: CharacterStats,
	secondStat: CharacterStats,
): CharacterStats {
	const addedStat = { ...firstStat };

	addedStat["Accuracy %"] += secondStat["Accuracy %"];
	addedStat.Armor += secondStat.Armor;
	addedStat["Critical Avoidance %"] += secondStat["Critical Avoidance %"];
	addedStat["Critical Damage %"] += secondStat["Critical Damage %"];
	addedStat.Health += secondStat.Health;
	addedStat["Physical Critical Chance %"] +=
		secondStat["Physical Critical Chance %"];
	addedStat["Physical Damage"] += secondStat["Physical Damage"];
	addedStat["Potency %"] += secondStat["Potency %"];
	addedStat.Protection += secondStat.Protection;
	addedStat.Resistance += secondStat.Resistance;
	addedStat["Special Critical Chance %"] +=
		secondStat["Special Critical Chance %"];
	addedStat["Special Damage"] += secondStat["Special Damage"];
	addedStat.Speed += secondStat.Speed;
	addedStat["Tenacity %"] += secondStat["Tenacity %"];

	return addedStat;
}

export { type CharacterStats, addCharacterStats };
