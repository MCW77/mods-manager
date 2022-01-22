export type PrimaryStatNames =
  'Accuracy'
  | 'Critical Avoidance'
  | 'Critical Chance'
  | 'Critical Damage'
  | 'Defense %'
  | 'Health %'
  | 'Offense %'
  | 'Potency'
  | 'Protection %'
  | 'Speed'
  | 'Tenacity'
;

export interface C3POPrimaryStatDTO {
  primaryStatName: PrimaryStatNames,
  primaryStatValue: string,
}
