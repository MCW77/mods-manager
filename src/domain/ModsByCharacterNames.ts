// domain
import { CharacterNames } from "../constants/characterSettings";

import { Mod } from './Mod';


type ModsByCharacterNames = Record<CharacterNames, Mod[]>;


export type { ModsByCharacterNames };
