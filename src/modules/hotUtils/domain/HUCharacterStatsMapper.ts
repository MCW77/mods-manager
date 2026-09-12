import type { CharacterStats } from "#/domain/CharacterStats";
import type { HUCharacterStats } from "./HUCharacterStats";

const fromHU = (stats: HUCharacterStats | undefined): CharacterStats => {
	if (stats === undefined)
		return {
			Health: 0,
			Protection: 0,
			Speed: 0,
			"Potency %": 0,
			"Tenacity %": 0,
			"Physical Damage": 0,
			"Physical Critical Chance %": 0,
			Armor: 0,
			"Special Damage": 0,
			"Special Critical Chance %": 0,
			Resistance: 0,
			"Critical Damage %": 0,
			"Critical Avoidance %": 0,
			"Accuracy %": 0,
		};

	return {
		"Accuracy %": (stats["Physical Accuracy"] ?? 0) / 12,
		Armor: stats.armor ?? 0,
		"Critical Avoidance %": (stats["Physical Critical Avoidance"] ?? 0) / 24,
		"Critical Damage %": (stats["Critical Damage"] ?? 0) * 100,
		Health: stats.health ?? 0,
		"Physical Critical Chance %": stats["Physical Critical Chance"]
			? stats["Physical Critical Chance"] / 24 + 10
			: 0,
		"Physical Damage": stats["Physical Damage"] ?? 0,
		"Potency %": (stats.potency ?? 0) * 100,
		Protection: stats.protection ?? 0,
		Resistance: stats.resistance ?? 0,
		"Special Critical Chance %": stats["Special Critical Chance"]
			? stats["Special Critical Chance"] / 24 + 10
			: 0,
		"Special Damage": stats["Special Damage"] ?? 0,
		Speed: stats.speed ?? 0,
		"Tenacity %": (stats.tenacity ?? 0) * 100,
	};
};

export { fromHU };
