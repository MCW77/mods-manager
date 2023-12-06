import { CharacterNames } from "#/constants/characterSettings";
import * as DTOs from '../';

interface HUPlayerValuesDTO {
  baseId: CharacterNames;
  equipment: string[];
  gearLevel: number;
  id: string;
  level: number;
  power: number;
  rarity: number;
  relicTier: number;
  stats: {
    base: DTOs.HU.HUCharacterStatsDTO;
    gear?: DTOs.HU.HUCharacterStatsDTO;
  }
}

export type { HUPlayerValuesDTO };