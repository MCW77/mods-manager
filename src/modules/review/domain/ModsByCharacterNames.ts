// domain
import type { CharacterNames } from "#/constants/CharacterNames";

import type { Mod } from "#/domain/Mod";

type ModsByCharacterNames = Record<CharacterNames, Mod[]>;

export type { ModsByCharacterNames };
