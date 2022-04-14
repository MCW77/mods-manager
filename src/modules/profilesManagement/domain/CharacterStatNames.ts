type NeutralStats = 'Speed' | 'Potency %' | 'Tenacity %';

// #region GIMOOffensiveStats
type OffensiveStatsWithoutCC =
  | 'Accuracy %'
  | 'Critical Damage %'
  | 'Physical Damage'
  | 'Special Damage'
;
// #endregion
type CritChanceStats = 
  | 'Physical Critical Chance %'
  | 'Special Critical Chance %'
;

// #region GIMODefensiveStats
type DefensiveStats =
  | 'Critical Avoidance %'
  | 'Health'
  | 'Protection'
  | 'Armor'
  | 'Resistance'
;
// #endregion

type WithoutCC = NeutralStats | OffensiveStatsWithoutCC | DefensiveStats;
type All = WithoutCC | CritChanceStats;

export type { WithoutCC, All };