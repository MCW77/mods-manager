// domain
import type { CharacterNames } from "#/constants/characterSettings";

import type { Mod } from "#/domain/Mod";

type ModsByCharacterNames = Record<CharacterNames, Mod[]>;

export type { ModsByCharacterNames };
