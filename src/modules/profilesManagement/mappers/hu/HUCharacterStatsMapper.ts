import type * as DTOs from "../../dtos";

class HUCharacterStatsMapper {
	static fromHU(
		statsDTO: DTOs.HU.HUCharacterStatsDTO | undefined,
	): DTOs.GIMO.CharacterStatsDTO {
		if (statsDTO === undefined)
			return {
				Health: 0,
				Protection: 0,
				Speed: 0,
				["Potency %"]: 0,
				["Tenacity %"]: 0,
				["Physical Damage"]: 0,
				["Physical Critical Chance %"]: 0,
				Armor: 0,
				["Special Damage"]: 0,
				["Special Critical Chance %"]: 0,
				Resistance: 0,
				["Critical Damage %"]: 0,
				["Critical Avoidance %"]: 0,
				["Accuracy %"]: 0,
			};

		return {
			["Accuracy %"]: (statsDTO["Physical Accuracy"] ?? 0) / 12,
			Armor: statsDTO.armor ?? 0,
			["Critical Avoidance %"]:
				(statsDTO["Physical Critical Avoidance"] ?? 0) / 24,
			["Critical Damage %"]: (statsDTO["Critical Damage"] ?? 0) * 100,
			Health: statsDTO.health ?? 0,
			["Physical Critical Chance %"]: statsDTO["Physical Critical Chance"]
				? statsDTO["Physical Critical Chance"] / 24 + 10
				: 0,
			["Physical Damage"]: statsDTO["Physical Damage"] ?? 0,
			["Potency %"]: (statsDTO.potency ?? 0) * 100,
			Protection: statsDTO.protection ?? 0,
			Resistance: statsDTO.resistance ?? 0,
			["Special Critical Chance %"]: statsDTO["Special Critical Chance"]
				? statsDTO["Special Critical Chance"] / 24 + 10
				: 0,
			["Special Damage"]: statsDTO["Special Damage"] ?? 0,
			Speed: statsDTO.speed ?? 0,
			["Tenacity %"]: (statsDTO.tenacity ?? 0) * 100,
		};
	}
}

export { HUCharacterStatsMapper };
