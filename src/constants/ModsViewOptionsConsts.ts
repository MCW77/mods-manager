import { ModsViewOptions } from "../domain/types/ModsViewOptionsTypes";

export const defaultOptions: ModsViewOptions = {
  filtering: {
    slot: {
      square: 0,
      arrow: 0,
      diamond: 0,
      triangle: 0,
      circle: 0,
      cross: 0
    },
    set: {
      'Potency %': 0,
      'Tenacity %': 0,
      'Speed %': 0,
      'Offense %': 0,
      'Defense %': 0,
      'Critical Damage %': 0,
      'Critical Chance %': 0,
      'Health %': 0
    },
    rarity: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0
    },
    tier: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    },
    level: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
      10: 0,
      11: 0,
      12: 0,
      13: 0,
      14: 0,
      15: 0
    },
    equipped: {
      equipped: 0,
      unequipped: 0
    },
    primary: {
      'Accuracy %': 0,
      'Critical Avoidance %': 0,
      'Critical Chance %': 0,
      'Critical Damage %': 0,
      'Defense %': 0,
      'Offense %': 0,
      'Health %': 0,
      'Potency %': 0,
      'Tenacity %': 0,
      'Protection %': 0,
      'Speed': 0
    
    },
    secondary: {
      'Critical Chance %': 0,
      'Defense %': 0,
      'Defense': 0,
      'Offense %': 0,
      'Offense': 0,
      'Health %': 0,
      'Health': 0,
      'Potency %': 0,
      'Tenacity %': 0,
      'Protection %': 0,
      'Protection': 0,
      'Speed': 0      
    },
    optimizer: {
      assigned: 0,
      unassigned: 0
    },
    secondariesscoretier: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    }
  },
  sort: ['', '', '', ''],
  isGroupingEnabled: true,
  modScore: 'PureSecondaries',
};
