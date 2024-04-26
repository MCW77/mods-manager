import type * as DTOs from "../dtos";

function addCharacterStats(
	firstStat: DTOs.GIMO.CharacterStatsDTO,
	secondStat: DTOs.GIMO.CharacterStatsDTO,
): DTOs.GIMO.CharacterStatsDTO {
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

export { addCharacterStats };
