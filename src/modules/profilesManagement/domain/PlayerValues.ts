import type { CharacterNames } from "#/constants/CharacterNames";
import type * as DTOs from "../dtos";

export type PlayerValuesByCharacter = Record<
	CharacterNames,
	DTOs.GIMO.PlayerValuesDTO
>;
