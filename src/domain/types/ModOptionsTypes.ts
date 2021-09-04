import {ModTiersEnum } from "constants/enums";
import type {ElementType} from "../../utils/typeHelper";
import * as ModTypes from "./ModTypes";
import { PrimaryStats, SecondaryStats } from "../Stats";

export const availableOptions = [
  'slot',
  'set',
  'rarity',
  'tier',
  'level',
  'primary',
  'secondaries',
] as const;

export type OptionKeys = ElementType<typeof availableOptions>;

export type ModOptions = {
  slot: ModTypes.GIMOSlots;
  set: ModTypes.Sets;
  rarity: ModTypes.Pips;
  tier: ModTiersEnum;
  level: ModTypes.Levels;
  primary: PrimaryStats.HUStatNames;
  secondaries: (SecondaryStats.HUStatNames | 'not revealed')[];
}