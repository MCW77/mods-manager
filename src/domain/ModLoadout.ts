// state
import { optimizationSettings$ } from "#/modules/optimizationSettings/state/optimizationSettings";

// domain
import * as ModConsts from "./constants/ModConsts";
import setBonuses from "../constants/setbonuses";
import * as CharacterStatNames from "../modules/profilesManagement/domain/CharacterStatNames";
import * as ModTypes from "./types/ModTypes";

import * as Character from "./Character";
import { Mod } from "./Mod";
import * as OptimizationPlan from "./OptimizationPlan";
import SetBonus from "./SetBonus";
import { Stats, CharacterSummaryStats as CSStats, SetStats } from "./Stats";


type SlotIndexer = {
  [key in ModTypes.GIMOSlots]: Mod | null;
}

class ModLoadout implements SlotIndexer{

  square!: Mod | null;
  arrow!: Mod | null;
  diamond!: Mod | null;
  triangle!: Mod | null;
  circle!: Mod | null;
  cross!: Mod | null;

  constructor(mods: (Mod | null)[]) {
    for (let slot of ModConsts.gimoSlots) {
      this[slot] = null;
    }

    for (let mod of mods.filter(mod => null !== mod) as Mod[]) {
      this[mod.slot] = mod;
    }
  }

  /**
   * Give a summary of the absolute stat increase given by this mod set for a given character
   *
   * @param character {Character}
   * @param target {OptimizationPlan}
   * @param withUpgrades {boolean} Whether to level and slice mods, if they've been selected for the character
   *
   * @return Object An object keyed on each stat in the mod set
   */
  getSummary(character: Character.Character, target: OptimizationPlan.OptimizationPlan, withUpgrades: boolean) {
    let loadoutSummary: {
      [key in CharacterStatNames.All]: CSStats.CharacterSummaryStat
    } = {
      'Health': new CSStats.CharacterSummaryStat('Health', '0'),
      'Protection': new CSStats.CharacterSummaryStat('Protection', '0'),
      'Speed': new CSStats.CharacterSummaryStat('Speed', '0'),
      'Critical Damage %': new CSStats.CharacterSummaryStat('Critical Damage %', '0'),
      'Potency %': new CSStats.CharacterSummaryStat('Potency %', '0'),
      'Tenacity %': new CSStats.CharacterSummaryStat('Tenacity %', '0'),
      'Physical Damage': new CSStats.CharacterSummaryStat('Physical Damage', '0'),
      'Physical Critical Chance %': new CSStats.CharacterSummaryStat('Physical Critical Chance %', '0'),
      'Armor': new CSStats.CharacterSummaryStat('Armor', '0'),
      'Special Damage': new CSStats.CharacterSummaryStat('Special Damage', '0'),
      'Special Critical Chance %': new CSStats.CharacterSummaryStat('Special Critical Chance %', '0'),
      'Resistance': new CSStats.CharacterSummaryStat('Resistance', '0'),
      'Accuracy %': new CSStats.CharacterSummaryStat('Accuracy %', '0'),
      'Critical Avoidance %': new CSStats.CharacterSummaryStat('Critical Avoidance %', '0'),
    };

    // Holds the number of mods in each set
    let smallSetCounts = new WeakMap();
    // Hold the number of mods in each set that have been or will be leveled fully (thus providing the max set bonus)
    let maxSetCounts = new WeakMap();

    for (let slot of ModConsts.gimoSlots) {
      const mod = this[slot];
      if (null === mod) {
        continue;
      }
      const set: SetBonus = setBonuses[mod.set];

      const modStats = mod.getStatSummaryForCharacter(character, target, withUpgrades);
      let stat: CharacterStatNames.All;
      for (stat in modStats) {
        loadoutSummary[stat] = loadoutSummary[stat] ? loadoutSummary[stat].plus(modStats[stat]) : modStats[stat];
      }

      // Get a count of how many mods are in each set
      const currentSmallCount = smallSetCounts.get(set) || 0;
      const currentMaxCount = maxSetCounts.get(set) || 0;
      if (set) {
        smallSetCounts.set(set, currentSmallCount + 1);
        if ((withUpgrades && optimizationSettings$.activeSettings.simulateLevel15Mods.peek()) || 15 === mod.level) {
          maxSetCounts.set(set, currentMaxCount + 1);
        }
      }
    }

    // Update the summary for each stat from each complete mod set
    for (let setKey of SetStats.SetStat.statNames) {
      const setDescription = setBonuses[setKey];

      // Add in any set bonuses
      // leveled or upgraded mods
      const maxSetMultiplier =
        Math.floor((maxSetCounts.get(setDescription) || 0) / setDescription.numberOfModsRequired);

      // Add in any set bonuses from unleveled mods
      const smallSetCount = smallSetCounts.get(setDescription);
      smallSetCounts.set(setDescription, smallSetCount - setDescription.numberOfModsRequired * maxSetMultiplier);
      const smallSetMultiplier =
        Math.floor((smallSetCounts.get(setDescription) || 0) / setDescription.numberOfModsRequired);

      const maxSetStats = setDescription.maxBonus.getFlatValuesForCharacter(character);
      maxSetStats.forEach(stat => {
        for (let i = 0; i < maxSetMultiplier; i++) {
          loadoutSummary[stat.type as CharacterStatNames.All] = loadoutSummary[stat.type as CharacterStatNames.All].plus(stat);
        }
      });

      const smallSetStats = setDescription.smallBonus.getFlatValuesForCharacter(character);
      smallSetStats.forEach(stat => {
        for (let i = 0; i < smallSetMultiplier; i++) {
          loadoutSummary[stat.type as CharacterStatNames.All] = loadoutSummary[stat.type as CharacterStatNames.All].plus(stat);
        }
      });
    }

    // Update the summary to mark the stats that should always be displayed as percentages
    // Also update all stats to be the correct precision
    Object.values(loadoutSummary).forEach(stat => {
      if (!Stats.Stat.mixedTypes.includes(stat.getDisplayType() as Stats.DisplayStatNames)) {
        stat.displayModifier = '%';
      } else {
        stat.value = Math.trunc(stat.value);
      }
      stat.updateDisplayValue();
    });

    return loadoutSummary;
  }

  /**
   * Get the value of this full mod set for optimization
   *
   * @param character {Character}
   * @param target {OptimizationPlan}
   * @param withUpgrades {Boolean} Whether to upgrade mods while calculating the value of the set
   */
  getOptimizationValue(character: Character.Character, target: OptimizationPlan.OptimizationPlan, withUpgrades: boolean = false) {
    return Object.values(this.getSummary(character, target, withUpgrades))
      .reduce((setValue, stat) => setValue + stat.getOptimizationValue(character, target), 0);
  }

  static slotSort(leftMod: Mod, rightMod: Mod) {
    const leftIndex = ModConsts.gimoSlots.indexOf(leftMod.slot);
    const rightIndex = ModConsts.gimoSlots.indexOf(rightMod.slot);

    return leftIndex - rightIndex;
  }

}

export { ModLoadout };