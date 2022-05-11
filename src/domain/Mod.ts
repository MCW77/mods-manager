import { ModTiersEnum } from "../constants/enums";
import type * as ModTypes from "./types/ModTypes";
import { OptimizationPlan} from "./OptimizationPlan";
import { Character } from "./Character";
import { modScores } from "./constants/ModScoresConsts";
import { Stats, CharacterSummaryStats as CSStats, PrimaryStats, SecondaryStats, SetStats } from "./Stats";
import { CharacterNames } from "constants/characterSettings";
import * as CharacterStatNames from "../modules/profilesManagement/domain/CharacterStatNames";
import Big from "big.js";

const CSStat = CSStats.CharacterSummaryStat;
type CSStat = CSStats.CharacterSummaryStat;

const HU2GIMOSlotsMap: {
  [key in ModTypes.HUSlots]: ModTypes.GIMOSlots
} = {
  'Transmitter': 'square',
  'Receiver': 'arrow',
  'Processor': 'diamond',
  'Holo-Array': 'triangle',
  'Data-Bus': 'circle',
  'Multiplexer': 'cross',
} as const;

export class Mod {
  id: string;
  slot: ModTypes.GIMOSlots;
  set: SetStats.GIMOStatNames;
  level: ModTypes.Levels;
  pips: ModTypes.Pips;
  primaryStat: PrimaryStats.PrimaryStat;
  secondaryStats: SecondaryStats.SecondaryStat[];
  tier: ModTiersEnum;
  characterID: CharacterNames | 'null';
  totalRolls: number;
  maxRoll: number;
  scores: {
    [key: string]: number
  } = {};
  assignedID: CharacterNames | 'null';

  static firstTimeSetupOfAccessors: boolean = true;
  
  static setupSetAccessor() {
    Object.defineProperty(Mod.prototype, 'Set', {
      get: function(): SetStats.GIMOStatNames {
        return (this as Mod).set;
      },
      configurable: true,
    });      
  }

  static setupStatAccessors() {
    for (let stat of SecondaryStats.SecondaryStat.statNames) {
      Object.defineProperty(Mod.prototype, 'StatScore' + stat, {
        get: function():number {
          const foundStat: SecondaryStats.SecondaryStat | undefined = (this as Mod).secondaryStats.find(
            (traversedStat: SecondaryStats.SecondaryStat) => traversedStat.type === stat
          );
          return foundStat ? Number(foundStat.score.value) : 0;
        },
        configurable: true,
      });
      Object.defineProperty(Mod.prototype, 'Stat' + stat, {
        get: function():number {
          const foundStat: SecondaryStats.SecondaryStat | undefined = (this as Mod).secondaryStats.find(
            (traversedStat: SecondaryStats.SecondaryStat) => traversedStat.type === stat
          );
          return foundStat ? foundStat.value : 0;
        },
        configurable: true,
      });
    }
  }

  static setupModScoreAccessors() {
    for (let modScore of modScores) {
      Object.defineProperty(Mod.prototype, 'ModScore' + modScore.name, {
        get: function():number {
          return (this as Mod).scores[modScore.name] ?? 0
        },
        configurable: true,
      });
    }

  }

  static setupAccessors(): void {
    Mod.setupModScoreAccessors();
  }

  constructor(id: string, slot: ModTypes.GIMOSlots, set: SetStats.GIMOStatNames, level: ModTypes.Levels, pips: ModTypes.Pips, primaryStat: PrimaryStats.PrimaryStat, secondaryStats: SecondaryStats.SecondaryStat[], characterID: CharacterNames | 'null', tier: ModTiersEnum = 1) {
    this.id = id;
    this.slot = slot;
    this.set = set;
    this.level = level;
    this.pips = pips;
    this.primaryStat = primaryStat;
    this.secondaryStats = secondaryStats;
    this.characterID = characterID;
    this.tier = tier;
    this.secondaryStats.forEach(stat => {
      if (this.pips === 6) {
        let tempStat = stat.downgrade();
        tempStat.calcScore();
        stat.score = tempStat.score; 
      } else {
        stat.calcScore();
      }
    });
    this.totalRolls = this.secondaryStats.reduce((acc, stat) => acc + stat.rolls, 0);
    this.maxRoll = this.secondaryStats.map(stat => stat.rolls).sort().slice(-1)[0] ?? 0;
    this.calculateScores();
    this.assignedID = 'null';
  }

  isAssigned() {
    return this.assignedID !== 'null';
  }
  
  calculateScores(): void {
    for (let scoreDef of modScores) {
      this.scores[scoreDef.name] = scoreDef.scoringAlgorithm(this);
    }
  }

  equip(characterID: CharacterNames) {
    return new Mod(
      this.id,
      this.slot,
      this.set,
      this.level,
      this.pips,
      this.primaryStat,
      this.secondaryStats,
      characterID,
      this.tier
    );
  }

  unequip() {
    return new Mod(
      this.id,
      this.slot,
      this.set,
      this.level,
      this.pips,
      this.primaryStat,
      this.secondaryStats,
      'null',
      this.tier
    );
  }

  /**
   * Simulate leveling this mod up to level 15, upgrading the primary stat as needed, but not changing any of the
   * secondary stats
   * @returns {Mod}
   */
  levelUp() {
    return new Mod(
      this.id,
      this.slot,
      this.set,
      15,
      this.pips,
      this.primaryStat.upgrade(this.pips),
      this.secondaryStats,
      this.characterID,
      this.tier
    );
  }

  /**
   * Upgrade all of the stats on this mod to see what it would be like after slicing from 5A to 6E
   * @returns {Mod}
   */
  slice() {
    return new Mod(
      this.id,
      this.slot,
      this.set,
      this.level,
      6,
      this.primaryStat.upgrade(6),
      this.secondaryStats.map(stat => stat.upgrade()),
      this.characterID,
      1
    );
  }

  shouldLevel(target: OptimizationPlan) {
    return OptimizationPlan.shouldUpgradeMods(target) && this.level < 15;
  }

  shouldSlice(character: Character, target: OptimizationPlan) {
    return character.optimizerSettings.sliceMods && this.pips === 5 &&
      (this.level === 15 || this.shouldLevel(target))
  }

  /**
   * Get a summary of how this mod affects a character's stats
   * @param character {Character}
   * @param target {OptimizationPlan}
   * @param withUpgrades {boolean} Whether to level and slice the mod, if they've been selected for the character
   * @returns {Object<String, Number>} A map from stat name to value
   */
  getStatSummaryForCharacter(character: Character, target: OptimizationPlan, withUpgrades = true) {
    let workingMod: Mod = this;

    const summary: {
      [key in CharacterStatNames.All]: CSStats.CharacterSummaryStat
    } = {
      'Health': new CSStat('Health', '0'),
      'Protection': new CSStat('Protection', '0'),
      'Speed': new CSStat('Speed', '0'),
      'Critical Damage %': new CSStat('Critical Damage %', '0'),
      'Potency %': new CSStat('Potency %', '0'),
      'Tenacity %': new CSStat('Tenacity %', '0'),
      'Physical Damage': new CSStat('Physical Damage', '0'),
      'Physical Critical Chance %': new CSStat('Physical Critical Chance %', '0'),
      'Armor': new CSStat('Armor', '0'),
      'Special Damage': new CSStat('Special Damage', '0'),
      'Special Critical Chance %': new CSStat('Special Critical Chance %', '0'),
      'Resistance': new CSStat('Resistance', '0'),
      'Accuracy %': new CSStat('Accuracy %', '0'),
      'Critical Avoidance %': new CSStat('Critical Avoidance %', '0')
    };

    if (withUpgrades) {
      // Upgrade or slice each mod as necessary based on the optimizer settings and level of the mod
      if (15 > workingMod.level && target.upgradeMods) {
        workingMod = workingMod.levelUp();
      }
      if (15 === workingMod.level && 5 === workingMod.pips && character.optimizerSettings.sliceMods) {
        workingMod = workingMod.slice();
      }
    }

    for (let modStat of [workingMod.primaryStat as Stats.Stat].concat(workingMod.secondaryStats)) {
      const flatStats = modStat.getFlatValuesForCharacter(character);
      flatStats.forEach(stat => summary[stat.type as CharacterStatNames.All] = summary[stat.type as CharacterStatNames.All].plus(stat));
    }

    return summary;
  }

  /**
   * Convert this mod to a simple JSON object so that it can be stringified
   */
  serialize() {

    let pBT: PrimaryStats.GIMOStatNames;
    let pBV: string;
    [pBT, pBV] = this.primaryStat.serialize();

    let modObject: ModTypes.GIMOFlatMod = {
      mod_uid: this.id,
      slot: this.slot,
      set: this.set,
      level: this.level,
      pips: this.pips,
      characterID: this.characterID,
      tier: this.tier,
      primaryBonusType: pBT,
      primaryBonusValue: pBV,
      secondaryType_1: 'Health',
      secondaryValue_1: '400',
      secondaryRoll_1: '1',
      secondaryType_2: 'Health %',
      secondaryValue_2: '0.8',
      secondaryRoll_2: '1',
      secondaryType_3: 'Speed',
      secondaryValue_3: '5',
      secondaryRoll_3: '1',
      secondaryType_4: 'Offense',
      secondaryValue_4: '45',
      secondaryRoll_4: '1',
    };
    
    for (let i = 0; i < 4; i++) {
      if (i < this.secondaryStats.length) {
        let mO = this.secondaryStats[i].serialize();        
        [
          modObject[`secondaryType_${i + 1}` as keyof ModTypes.FlatGIMOModTypeIndexer],
          modObject[`secondaryValue_${i + 1}`as keyof ModTypes.FlatModValueIndexer],
          modObject[`secondaryRoll_${i + 1}` as keyof ModTypes.FlatModRollIndexer]
        ] = mO;
      } else {
        modObject[`secondaryType_${i + 1}` as keyof ModTypes.FlatGIMOModTypeIndexer] = null;
        modObject[`secondaryValue_${i + 1}` as keyof ModTypes.FlatModValueIndexer] = '';
        modObject[`secondaryRoll_${i + 1}` as keyof ModTypes.FlatModRollIndexer] = null;
      }
    }

    return modObject;
  }

  getClass() {
    switch (
      Math.floor(
        Big(this.scores['PureSecondaries']).div(Big(20)).toNumber()
      )
    ) {
      case 4:
        return 'S';
      case 3:
        return 'A';
      case 2:
        return 'B';
      case 1:
        return 'C';
      default:
        return 'D';
    }
  }

  static fromHotUtils(flatMod: ModTypes.HUFlatMod) {
    type secondaryPos = 1 | 2 | 3 | 4;
    const secondaryStats: SecondaryStats.SecondaryStat[] = [];
    ([1, 2, 3, 4] as secondaryPos[]).forEach((pos) => {
      if (flatMod[`secondaryType_${pos}` as keyof ModTypes.FlatHUModTypeIndexer] !== undefined) {
        secondaryStats.push(SecondaryStats.SecondaryStat.fromHotUtils(
          flatMod[`secondaryType_${pos}` as keyof ModTypes.FlatHUModTypeIndexer]!,
          flatMod[`secondaryValue_${pos}` as keyof ModTypes.FlatModValueIndexer],
          flatMod[`secondaryRoll_${pos}` as keyof ModTypes.FlatModRollIndexer]!
        ));
      }
    });

    return new Mod(
      flatMod.mod_uid,
      HU2GIMOSlotsMap[flatMod.slot],
      SetStats.SetStat.HU2GIMOStatNamesMap[flatMod.set],
      flatMod.level,
      flatMod.pips,
      PrimaryStats.PrimaryStat.fromHotUtils(flatMod.primaryBonusType, flatMod.primaryBonusValue),
      secondaryStats,
      flatMod.characterID ?? 'null',
      flatMod.tier
    );
  }

  static deserialize(mod: ModTypes.GIMOFlatMod) {
    const primaryStat = new PrimaryStats.PrimaryStat(mod.primaryBonusType, mod.primaryBonusValue);
    let secondaryStats: SecondaryStats.SecondaryStat[] = [];

    if (null !== mod.secondaryType_1 && '' !== mod.secondaryValue_1) {
      secondaryStats.push(new SecondaryStats.SecondaryStat(
        mod.secondaryType_1!,
        mod.secondaryValue_1,
        +mod.secondaryRoll_1! as SecondaryStats.Rolls ?? 1
      ));
    }
    if (null !== mod.secondaryType_2 && '' !== mod.secondaryValue_2) {
      secondaryStats.push(new SecondaryStats.SecondaryStat(
        mod.secondaryType_2,
        mod.secondaryValue_2,
        +mod.secondaryRoll_2! as SecondaryStats.Rolls ?? 1
      ));
    }
    if (null !== mod.secondaryType_3 && '' !== mod.secondaryValue_3) {
      secondaryStats.push(new SecondaryStats.SecondaryStat(
        mod.secondaryType_3,
        mod.secondaryValue_3,
        +mod.secondaryRoll_3! as SecondaryStats.Rolls ?? 1
      ));
    }
    if (null !== mod.secondaryType_4 && '' !== mod.secondaryValue_4) {
      secondaryStats.push(new SecondaryStats.SecondaryStat(
        mod.secondaryType_4,
        mod.secondaryValue_4,
        +mod.secondaryRoll_4! as SecondaryStats.Rolls ?? 1
      ));
    }
    
    return new Mod(
      mod.mod_uid,
      mod.slot,
      mod.set,
      mod.level,
      mod.pips,
      primaryStat,
      secondaryStats,
      mod.characterID,
      mod.tier
    )
  }
}

Mod.setupSetAccessor();
Mod.setupStatAccessors();