import * as DTOs from '../../dtos';
import * as Mappers from '../';
import { addCharacterStats } from '../../domain/CharacterStats';

class HUPlayerValuesMapper {

  static fromHU(valuesDTO: DTOs.HU.HUPlayerValuesDTO): DTOs.GIMO.PlayerValuesDTO {
    const baseStats: DTOs.GIMO.CharacterStatsDTO = Mappers.HU.HUCharacterStatsMapper.fromHU(valuesDTO.stats.base);
    const gearStats: DTOs.GIMO.CharacterStatsDTO = Mappers.HU.HUCharacterStatsMapper.fromHU(valuesDTO.stats.gear);
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
  }
}

export { HUPlayerValuesMapper };