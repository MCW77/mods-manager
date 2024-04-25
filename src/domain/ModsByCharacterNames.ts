// domain
import type { CharacterNames } from "../constants/characterSettings";

import type { Mod } from "./Mod";

type ModsByCharacterNames = Record<CharacterNames, Mod[]>;

export type { ModsByCharacterNames };
