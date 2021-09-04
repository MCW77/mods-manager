import { ModTiersEnum, ModSecondariesScoreTiersEnum } from "constants/enums";
import * as ModTypes from "../types/ModTypes";

export const gimoSlots: ModTypes.GIMOSlots[] = [
  'square',
  'arrow',
  'diamond',
  'triangle',
  'circle',
  'cross',
];

export const tiersMap: Map<ModTiersEnum, string> = new Map([
  [5, 'gold'],
  [4, 'purple'],
  [3, 'blue'],
  [2, 'green'],
  [1, 'grey']
]);

export const secondaryScoresTiersMap: Map<ModSecondariesScoreTiersEnum, string> = new Map([
  [4, 'gold'],
  [3, 'purple'],
  [2, 'blue'],
  [1, 'green'],
]);