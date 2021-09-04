import * as StatTypes from "../domain/types/StatTypes";

// A map from the name of each stat as used in the mod exporter to
// the name(s) of the property(ies) used internally by the mod optimizer
export const statTypeMap: StatTypes.StatTypeMap = Object.freeze({
  'Health': ['health'],
  'Protection': ['protection'],
  'Speed': ['speed'],
  'Critical Damage': ['critDmg'],
  'Potency': ['potency'],
  'Tenacity': ['tenacity'],
  'Offense': ['physDmg', 'specDmg'],
  'Physical Damage': ['physDmg'],
  'Special Damage': ['specDmg'],
  'Critical Chance': ['physCritChance', 'specCritChance'],
  'Physical Critical Chance': ['physCritChance'],
  'Special Critical Chance': ['specCritChance'],
  'Defense': ['armor', 'resistance'],
  'Armor': ['armor'],
  'Resistance': ['resistance'],
  'Accuracy': ['accuracy'],
  'Critical Avoidance': ['critAvoid']
} as const);


