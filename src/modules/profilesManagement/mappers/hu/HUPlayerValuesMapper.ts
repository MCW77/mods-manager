import type * as DTOs from "../../dtos/index";
import * as HUCharacterStatsMapper from "./HUCharacterStatsMapper";
import { addCharacterStats } from "../../domain/CharacterStats";

const fromHU = (
	valuesDTO: DTOs.HU.HUPlayerValuesDTO,
): DTOs.GIMO.PlayerValuesDTO => {
	const baseStats: DTOs.GIMO.CharacterStatsDTO = HUCharacterStatsMapper.fromHU(
		valuesDTO.stats.base,
	);
	const gearStats: DTOs.GIMO.CharacterStatsDTO = HUCharacterStatsMapper.fromHU(
		valuesDTO.stats.gear,
	);
	const equippedStats = addCharacterStats(baseStats, gearStats);

	return {
		level: valuesDTO.level,
		stars: valuesDTO.rarity,
		gearLevel: valuesDTO.gearLevel,
		gearPieces: valuesDTO.equipment,
		galacticPower: valuesDTO.power,
		baseStats: baseStats,
		equippedStats: equippedStats,
		relicTier: valuesDTO.relicTier,
	};
};

export { fromHU };
