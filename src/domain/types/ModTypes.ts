import { CharacterNames } from "constants/characterSettings";
import { ModTiersEnum } from "../../constants/enums";
import { SetStats, PrimaryStats, SecondaryStats } from "../Stats";

export type Levels = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15;
export type Pips = 1 | 2 | 3 | 4 | 5 | 6;
export type StrPips = '1' | '2' | '3' | '4' | '5' | '6';
export type GIMOSlots = 'square' | 'arrow' | 'diamond' | 'triangle' | 'circle' | 'cross';
export type HUSlots = 'Transmitter' | 'Receiver' | 'Processor' | 'Holo-Array' | 'Data-Bus' | 'Multiplexer';
export type VariablePrimarySlots = 'arrow' | 'triangle' | 'circle' | 'cross';

type t2 = 1 | 2 | 3 | 4;
type t4 = `secondaryType_${t2}`;
type t5 = `secondaryValue_${t2}`;
type t6 = `secondaryRoll_${t2}`;

export type FlatHUModTypeIndexer = {
  [key in t4]: SecondaryStats.HUStatNames | null;
};
export type FlatGIMOModTypeIndexer = {
  [key in t4]: SecondaryStats.GIMOStatNames | null;
};
export type FlatModValueIndexer = {
  [key in t5]: string | null;
};
export type FlatModRollIndexer = {
  [key in t6]: SecondaryStats.StrRolls | null;
};

export type HUFlatMod = {
  mod_uid: string,
  primaryBonusType: PrimaryStats.HUStatNames,
  primaryBonusValue: string,
  
  secondaryType_1: SecondaryStats.HUStatNames | null,
  secondaryValue_1: string,
  secondaryRoll_1: SecondaryStats.StrRolls | null,
  secondaryType_2: SecondaryStats.HUStatNames | null,
  secondaryValue_2: string,
  secondaryRoll_2: SecondaryStats.StrRolls | null,
  secondaryType_3: SecondaryStats.HUStatNames | null,
  secondaryValue_3: string,
  secondaryRoll_3: SecondaryStats.StrRolls | null,
  secondaryType_4: SecondaryStats.HUStatNames | null,
  secondaryValue_4: string,
  secondaryRoll_4: SecondaryStats.StrRolls | null,
  
  slot: HUSlots,
  set: SetStats.HUStatNames,
  level: Levels,
  pips: Pips,
  tier: ModTiersEnum,
  characterID: CharacterNames | 'null',
} & FlatHUModTypeIndexer & FlatModValueIndexer & FlatModRollIndexer

export type GIMOFlatMod = {
  mod_uid: string,
  primaryBonusType: PrimaryStats.GIMOStatNames,
  primaryBonusValue: string,
  
  secondaryType_1: SecondaryStats.GIMOStatNames | null,
  secondaryValue_1: string,
  secondaryRoll_1: SecondaryStats.StrRolls | null,
  secondaryType_2: SecondaryStats.GIMOStatNames | null,
  secondaryValue_2: string,
  secondaryRoll_2: SecondaryStats.StrRolls | null,
  secondaryType_3: SecondaryStats.GIMOStatNames | null,
  secondaryValue_3: string,
  secondaryRoll_3: SecondaryStats.StrRolls | null,
  secondaryType_4: SecondaryStats.GIMOStatNames | null,
  secondaryValue_4: string,
  secondaryRoll_4: SecondaryStats.StrRolls | null,
  
  slot: GIMOSlots,
  set: SetStats.GIMOStatNames,
  level: Levels,
  pips: Pips,
  tier: ModTiersEnum,
  characterID: CharacterNames | 'null',
} & FlatGIMOModTypeIndexer & FlatModValueIndexer & FlatModRollIndexer
