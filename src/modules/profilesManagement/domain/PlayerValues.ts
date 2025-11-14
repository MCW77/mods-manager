import type { CharacterNames } from "#/constants/CharacterNames.js";
import type * as DTOs from "../dtos/index.js";

export type PlayerValuesByCharacter = Record<
	CharacterNames,
	DTOs.GIMO.PlayerValuesDTO
>;
