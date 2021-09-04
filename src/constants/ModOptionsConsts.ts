import { ModOptions } from "../domain/types/ModOptionsTypes";

export const defaultOptions: ModOptions = {
  slot: 'square',
  set: 'health',
  rarity: 5,
  tier: 1,
  level: 1,
  primary: 'Offense %',
  secondaries: ['Speed', 'not revealed', 'not revealed', 'not revealed']
};
