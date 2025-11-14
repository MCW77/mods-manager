// domain
import type { CharacterNames } from "#/constants/CharacterNames.js";

import type { Mod } from "#/domain/Mod.js";

type ModsByCharacterNames = Record<CharacterNames, Mod[]>;

export type { ModsByCharacterNames };
