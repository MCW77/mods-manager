import type {ElementType} from "../utils/typeHelper";

enum ModSetsEnum {
  Health = 1,
  Offense,
  Defense,
  Speed,
  Critchance,
  Critdamage,
  Potency,
  Tenacity,
};

const modSlots = ['square', 'arrow', 'diamond', 'triangle', 'circle', 'cross'];
/*
const modSlots = {
  1: 'square',
  2: 'arrow',
  3: 'diamond',
  4: 'triangle',
  5: 'circle',
  6: 'cross',
};
*/

enum ModSlotsEnum {
  Square = 1,
  Arrow,
  Diamond,
  Triangle,
  Circle,
  Cross,
};

enum ModTiersEnum {
  Grey = 1,
  Green,
  Blue,
  Purple,
  Gold,
};

enum ModSecondariesScoreTiersEnum {
  Green = 1,
  Blue,
  Purple,
  Gold,
};

export {modSlots, ModSlotsEnum, ModSetsEnum, ModTiersEnum, ModSecondariesScoreTiersEnum};
