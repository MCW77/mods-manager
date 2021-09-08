import { CharacterNames } from "constants/characterSettings";
import { ICharacterStats, CharacterStats, IHUCharacterStats } from "./CharacterStats";

export interface IPlayerValues {
  level: number;
  stars: number;
  gearLevel: number;
  gearPieces: string[];
  galacticPower: number;
  baseStats: ICharacterStats;
  equippedStats: ICharacterStats;
  relicTier: number;
}

export interface IHUPlayerValues {
  baseId: CharacterNames;
  equipment: string[];
  gearLevel: number;
  id: string;
  level: number;
  power: number;
  rarity: number;
  relicTier: number;
  stats: {
    base: IHUCharacterStats;
    gear?: IHUCharacterStats;
  }
}

export class PlayerValues implements IPlayerValues {
  level: number;
  stars: number;
  gearLevel: number;
  gearPieces: string[];
  galacticPower: number;
  baseStats: CharacterStats;
  equippedStats: CharacterStats;
  relicTier: number;

  /**
   * @param level int
   * @param stars int
   * @param gearLevel int
   * @param gearPieces string[]
   * @param galacticPower int
   * @param baseStats CharacterStats | null
   * @param equippedStats CharacterStats | null
   * @param relicTier {Int}
   */
  constructor(
    level: number,
    stars: number,
    gearLevel: number,
    gearPieces: string[],
    galacticPower: number,
    baseStats: CharacterStats,
    equippedStats: CharacterStats,
    relicTier: number = 1
  ) {
    this.level = level;
    this.stars = stars;
    this.gearLevel = gearLevel;
    this.gearPieces = gearPieces;
    this.galacticPower = galacticPower;
    this.baseStats = baseStats;
    this.equippedStats = equippedStats;
    this.relicTier = relicTier;
    Object.freeze(this);
  }

  withBaseStats(baseStats: CharacterStats | null) {
    if (baseStats) {
      return new PlayerValues(
        this.level,
        this.stars,
        this.gearLevel,
        this.gearPieces,
        this.galacticPower,
        baseStats,
        this.equippedStats,
        this.relicTier
      );
    } else {
      return this;
    }
  }

  withEquippedStats(equippedStats: CharacterStats) {
    if (equippedStats) {
      return new PlayerValues(
        this.level,
        this.stars,
        this.gearLevel,
        this.gearPieces,
        this.galacticPower,
        this.baseStats,
        equippedStats,
        this.relicTier
      );
    } else {
      return this;
    }
  }

  serialize(): IPlayerValues {
//    const baseStats = this.baseStats ? this.baseStats.serialize() : null;
//    const equippedStats = this.equippedStats ? this.equippedStats.serialize() : null;

    return {
      level: this.level,
      stars: this.stars,
      gearLevel: this.gearLevel,
      gearPieces: this.gearPieces,
      galacticPower: this.galacticPower,
      baseStats: this.baseStats.serialize(),
      equippedStats: this.equippedStats.serialize(),
      relicTier: this.relicTier
    };
  }

 
  static fromHotUtils(huValues: IHUPlayerValues) {
    const baseStats = new CharacterStats(
      huValues.stats.base['health'] ?? 0,
      huValues.stats.base['protection'] ?? 0,
      huValues.stats.base['speed'] ?? 0,
      huValues.stats.base['potency'] ?? 0,
      huValues.stats.base['tenacity'] ?? 0,
      huValues.stats.base['Physical Damage'] ?? 0,
      huValues.stats.base['Physical Critical Chance'] ?? 0,
      huValues.stats.base['armor'] ?? 0,
      huValues.stats.base['Special Damage'] ?? 0,
      huValues.stats.base['Special Critical Chance'] ?? 0,
      huValues.stats.base['resistance'] ?? 0,
      huValues.stats.base['Critical Damage'] ?? 0,
      huValues.stats.base['Physical Critical Avoidance'] ?? 0,
      huValues.stats.base['Physical Accuracy'] ?? 0,
    );

    const gearStats = huValues.stats.gear !== undefined ?
      new CharacterStats(
        huValues.stats.gear['health'] ?? 0,
        huValues.stats.gear['protection'] ?? 0,
        huValues.stats.gear['speed'] ?? 0,
        huValues.stats.gear['potency'] ?? 0,
        huValues.stats.gear['tenacity'] ?? 0,
        huValues.stats.gear['Physical Damage'] ?? 0,
        huValues.stats.gear['Physical Critical Chance'] ?? 0,
        huValues.stats.gear['armor'] ?? 0,
        huValues.stats.gear['Special Damage'] ?? 0,
        huValues.stats.gear['Special Critical Chance'] ?? 0,
        huValues.stats.gear['resistance'] ?? 0,
        huValues.stats.gear['Critical Damage'] ?? 0,
        huValues.stats.gear['Physical Critical Avoidance'] ?? 0,
        huValues.stats.gear['Physical Accuracy'] ?? 0,
      )
    : 
      CharacterStats.nullStats.clone();

    return new PlayerValues(
      huValues.level,
      huValues.rarity,
      huValues.gearLevel,
      huValues.equipment,
      huValues.power,
      baseStats,
      baseStats.plus(gearStats),
      huValues.relicTier
    );
  }  

  static deserialize(Values: IPlayerValues) {
    
    return new PlayerValues(
      Values.level,
      Values.stars,
      Values.gearLevel,
      Values.gearPieces,
      Values.galacticPower,
      CharacterStats.deserialize(Values.baseStats),
      CharacterStats.deserialize(Values.equippedStats),
/*
      Values.baseStats === null ?
          null
        : 
          CharacterStats.deserialize(Values.baseStats),
          
      Values.equippedStats === null ?
          null
        :
          CharacterStats.deserialize(Values.equippedStats),
*/          
      Values.relicTier || 1
    );
  }

}

export type PlayerValuesByCharacter = {
  [char in CharacterNames]: PlayerValues;
}