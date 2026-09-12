import {
	type CharacterStats,
	addCharacterStats,
} from "#/domain/CharacterStats";
import type { PlayerValues } from "#/domain/PlayerValues";
import * as HUCharacterStatsMapper from "./HUCharacterStatsMapper";
import type { HUPlayerValues } from "./HUPlayerValues";

const fromHU = (playerValues: HUPlayerValues): PlayerValues => {
	const baseStats: CharacterStats = HUCharacterStatsMapper.fromHU(
		playerValues.stats.base,
	);
	const gearStats: CharacterStats = HUCharacterStatsMapper.fromHU(
		playerValues.stats.gear,
	);
	const equippedStats = addCharacterStats(baseStats, gearStats);

	return {
		level: playerValues.level,
		stars: playerValues.rarity,
		gearLevel: playerValues.gearLevel,
		gearPieces: playerValues.equipment,
		galacticPower: playerValues.power,
		equippedStats: equippedStats,
		relicTier: playerValues.relicTier,
	};
};

export { fromHU };
