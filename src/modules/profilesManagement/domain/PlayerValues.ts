import { CharacterNames } from "constants/characterSettings";
import * as DTOs from '../dtos';

export type PlayerValuesByCharacter = Record<CharacterNames, DTOs.GIMO.PlayerValuesDTO>;