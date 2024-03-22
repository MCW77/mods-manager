// domain
import { CharacterNames } from "../constants/characterSettings";

export type TargetStatsNames =
| 'Accuracy'
| 'Armor'
| 'Critical Avoidance'
| 'Critical Damage'
| 'Health'
| 'Health+Protection'
| 'Physical Critical Chance'
| 'Physical Damage'
| 'Potency'
| 'Protection'
| 'Resistance'
| 'Special Critical Chance'
| 'Special Damage'
| 'Speed'
| 'Tenacity'
;

export const targetStatsNames: Readonly<TargetStatsNames[]> = [
  'Accuracy',
  'Armor',
  'Critical Avoidance',
  'Critical Damage',
  'Health',
  'Health+Protection',
  'Physical Critical Chance',
  'Physical Damage',
  'Potency',
  'Protection',
  'Resistance',
  'Special Critical Chance',
  'Special Damage',
  'Speed',
  'Tenacity',
] as const;

export type TargetStat = {
  id: number;
  stat: TargetStatsNames;
  type: '+' | '*';
  minimum: number;
  maximum: number;
  relativeCharacterId: CharacterNames | 'null';
  optimizeForTarget: boolean;
};

export type TargetStats = TargetStat[];

const nextId = (targetStats: TargetStats) => {
  const ids = targetStats.map((targetStat) => targetStat.id);
  const maxId = Math.max(...ids);
  return maxId === -Infinity ? 0 : maxId + 1;
};

export const createTargetStat = (
  stat: TargetStatsNames = 'Speed',
  stats: TargetStats,
  id: number = 0,
  type: '+' | '*' = '+',
  minimum: number = 0,
  maximum: number = 0,
  relativeCharacterId: CharacterNames | 'null' = 'null',
  optimizeForTarget = true
): TargetStat => ({
  id: stats ? nextId(stats) : id,
  stat,
  type,
  minimum,
  maximum,
  relativeCharacterId,
  optimizeForTarget,
});

