import React from "react";

import './ModLoadoutDetail.css';

import { mapObject } from "../../utils/mapObject";
import { mapValues } from "lodash-es";

import { Stats } from "../../domain/Stats"
import { Character } from "../../domain/Character";
import { CharacterSummaryStats as CSStats } from "../../domain/Stats";
import ModLoadout from "../../domain/ModLoadout";
import { OptimizationPlan} from "../../domain/OptimizationPlan";

import ModLoadoutView from "../ModLoadoutView/ModLoadoutView";
import { MissedGoals } from "domain/PlayerProfile";
import { TargetStat } from "domain/TargetStat";

interface PlayerStat {
  name: Stats.DisplayStatNames,
  displayModifier: string,
  currentValue: number,
  currentStat: CSStats.CharacterSummaryStat,
  recommendedValue: number,
  optimizationValue: number,
  recommendedStat: CSStats.CharacterSummaryStat,
  diffStat: CSStats.CharacterSummaryStat,
  missedGoal: [TargetStat, number] | undefined
}

type PlayerStats = {
  [key in CSStats.GIMOStatNames]: PlayerStat
};

class ModLoadoutDetail extends React.PureComponent<ComponentProps> {
  render() {
    const modLoadout = this.props.loadout;
    const diffLoadout = this.props.diffLoadout;
    const character = this.props.character;
    const target = this.props.target;
    const showAvatars = 'undefined' !== typeof this.props.showAvatars ? this.props.showAvatars : false;
    const useUpgrades = this.props.useUpgrades;
    const missedGoals = this.props.missedGoals || [];

    const statSummary = modLoadout.getSummary(character, target, useUpgrades);
    const diffSummary = diffLoadout.getSummary(character, target, false);

    // Pull all the player's stats into an object that can be displayed without further calculation.
    const playerStats: PlayerStats = mapValues(statSummary, (stat: CSStats.CharacterSummaryStat) => {
      const diffStat = stat.minus(diffSummary[stat.type]);
/*
      if (!character.playerValues.equippedStats || !stat) {
        return {
          name: stat.getDisplayType(),
          recommendedValue: null,
          diffStat: diffStat
        };
      }
*/
      const statProperty = CSStats.CharacterSummaryStat.csDisplay2InternalStatNamesMap[stat.getDisplayType()][0];
      let statValue = character.playerValues.equippedStats[statProperty] + stat.value;

      let originalStat = diffSummary[stat.type];
      let originalStatValue = character.playerValues.equippedStats[statProperty] + originalStat.value;
      const optimizationValue = stat.getOptimizationValue(character, target);

      if (['armor', 'resistance'].includes(statProperty)) {
        // Convert armor and resistance to percent stats
        const baseStat = character.playerValues.equippedStats[statProperty];
        const baseStatValue = 100 * baseStat / (character.playerValues.level * 7.5 + baseStat);

        statValue = 100 * statValue / (character.playerValues.level * 7.5 + statValue);

        const statIncrease = statValue - baseStatValue;
        stat = new CSStats.CharacterSummaryStat(
          `${stat.getDisplayType()} %`,
          `${statIncrease % 1 ? Math.round(statIncrease * 100) / 100 : statIncrease}`
        );

        if (originalStat) {
          originalStatValue = 100 * originalStatValue / (character.playerValues.level * 7.5 + originalStatValue);
          const originalStatIncrease = originalStatValue - baseStatValue;
          originalStat = new CSStats.CharacterSummaryStat(
            `${stat.getDisplayType()} %`,
            `${originalStatIncrease % 1 ? Math.round(originalStatIncrease * 100) / 100 : originalStatIncrease}`
          );
        }
      }

      return {
        name: stat.getDisplayType(),
        displayModifier: stat.displayModifier,
        currentValue: originalStatValue,
        currentStat: originalStat,
        recommendedValue: statValue,
        optimizationValue: optimizationValue,
        recommendedStat: stat,
        diffStat: diffStat,
        missedGoal: missedGoals.find(([goal]) => goal.stat === stat.getDisplayType())
      };
    });

    // Add effective health and average damage to the stats display
    this.addCalculatedStatsToPlayerValues(playerStats);

    const statsDisplay = Object.values(playerStats).map((stat, index) => {
      if (stat.recommendedValue == null) {
        return <tr key={index}>
          <td className={'stat-type'}>{stat.name}</td>
          <td className={'stat-value'}>???(???)</td>
          {stat.diffStat &&
            <td className={'stat-diff' +
              (stat.diffStat.value > 0 ? ' increase' : stat.diffStat.value < 0 ? ' decrease' : '')
            }>
              {stat.diffStat.showValue()}
            </td>
          }
        </tr>;
      }

      const missedMessage = stat.missedGoal
        ? `Value must be between ${stat.missedGoal[0].minimum} and ${stat.missedGoal[0].maximum}`
        : undefined;

      return <tr key={index}>
        <td className={`stat-type ${missedMessage ? 'red-text' : ''}`} title={missedMessage}>{stat.name}</td>
        {stat.diffStat &&
          <td className={'stat-value'}>
            <span className={'total-value'}>
              {stat.currentValue % 1 ? stat.currentValue.toFixed(2) : stat.currentValue}
              {stat.displayModifier}{' '}
            </span>
            {stat.currentStat &&
              <span className={'mods-value'}>({stat.currentStat.showValue()})</span>
            }
          </td>
        }
        <td className={'stat-value'}>
          <span className={`total-value ${missedMessage ? 'red-text' : ''}`} title={missedMessage}>
            {stat.recommendedValue % 1 ? stat.recommendedValue.toFixed(2) : stat.recommendedValue}
            {stat.displayModifier}{' '}
          </span>
          {stat.recommendedStat &&
            <span className={'mods-value'}>({stat.recommendedStat.showValue()})</span>
          }
        </td>
        <td className={'optimizer-value ' +
          (stat.optimizationValue > 0 ? 'increase' : stat.optimizationValue < 0 ? 'decrease' : '')}>
          {(stat.optimizationValue || 0).toFixed(2)}
        </td>
        {stat.diffStat &&
          <td className={'stat-diff' +
            (stat.diffStat.value > 0 ? ' increase' : stat.diffStat.value < 0 ? ' decrease' : '')
          }>
            {stat.diffStat.showValue()}
          </td>
        }
      </tr>;
    });

    const diffSetValue = diffLoadout ? diffLoadout.getOptimizationValue(character, target, false) : null;
    const setValue = modLoadout.getOptimizationValue(character, target, useUpgrades);
    const valueChange = ((100 * setValue / diffSetValue) - 100).toFixed(2);

    return (
      <div className={'mod-set-detail'}>
        <ModLoadoutView modLoadout={modLoadout} showAvatars={showAvatars} assignedCharacter={this.props.assignedCharacter}
          assignedTarget={this.props.assignedTarget} />
        <div className={'summary'}>
          <table>
            <thead>
              <tr>
                <th colSpan={diffLoadout ? 5 : 4}>Stats Summary</th>
              </tr>
              <tr>
                <th></th>
                <th>Current</th>
                <th>Recommended</th>
                <th>Value</th>
                <th>Change</th>
              </tr>
            </thead>
            <tbody>
              {statsDisplay}
            </tbody>
          </table>
        </div>
        <div className={'set-value'}>
          {diffLoadout && <div>Previous Set Value: {diffSetValue.toFixed(2)}</div>}
          <div>
            Total Value of Set: {modLoadout.getOptimizationValue(character, target, useUpgrades).toFixed(2)}
          </div>
          {diffLoadout &&
            <div>Value Change:&nbsp;
            <span className={valueChange > 0 ? 'increase' : valueChange < 0 ? 'decrease' : ''}>
                {valueChange}%
            </span>
            </div>}
        </div>
      </div>
    );
  }

  addCalculatedStatsToPlayerValues(playerStats: PlayerStats) {
    const currentStats = {
      health: 0,
      protection: 0,
      armor: 0,
      resistance: 0,
      physDamage: 0,
      specDamage: 0,
      physCritChance: 0,
      specCritChance: 0,
      critDamage: 0,
    };
    const recommendedStats = {
      health: 0,
      protection: 0,
      armor: 0,
      resistance: 0,
      physDamage: 0,
      specDamage: 0,
      physCritChance: 0,
      specCritChance: 0,
      critDamage: 0,
    };

    Object.values(playerStats).forEach(stat => {
      switch (stat.name) {
        case 'Health':
          currentStats['health'] = stat.currentValue;
          recommendedStats['health'] = stat.recommendedValue;
          break;
        case 'Protection':
          currentStats['protection'] = stat.currentValue;
          recommendedStats['protection'] = stat.recommendedValue;
          break;
        case 'Armor':
          currentStats['armor'] = stat.currentValue;
          recommendedStats['armor'] = stat.recommendedValue;
          break;
        case 'Resistance':
          currentStats['resistance'] = stat.currentValue;
          recommendedStats['resistance'] = stat.recommendedValue;
          break;
        case 'Physical Damage':
          currentStats['physDamage'] = stat.currentValue;
          recommendedStats['physDamage'] = stat.recommendedValue;
          break;
        case 'Physical Critical Chance':
          currentStats['physCritChance'] = stat.currentValue;
          recommendedStats['physCritChance'] = stat.recommendedValue;
          break;
        case 'Special Damage':
          currentStats['specDamage'] = stat.currentValue;
          recommendedStats['specDamage'] = stat.recommendedValue;
          break;
        case 'Special Critical Chance':
          currentStats['specCritChance'] = stat.currentValue;
          recommendedStats['specCritChance'] = stat.recommendedValue;
          break;
        case 'Critical Damage':
          currentStats['critDamage'] = stat.currentValue;
          recommendedStats['critDamage'] = stat.recommendedValue;
          break;
        default:
          break;
      }
    })

    const currentEffectiveHealthPhysical =
      (currentStats.health + currentStats.protection) / (1 - (currentStats.armor / 100));
    const recommendedEffectiveHealthPhysical =
      (recommendedStats.health + recommendedStats.protection) / (1 - (recommendedStats.armor / 100));
    const currentEffectiveHealthSpecial =
      (currentStats.health + currentStats.protection) / (1 - (currentStats.resistance / 100));
    const recommendedEffectiveHealthSpecial =
      (recommendedStats.health + recommendedStats.protection) / (1 - (recommendedStats.resistance / 100));
    const currentAverageDamagePhysical = currentStats.physDamage *
      ((1 - (currentStats.physCritChance / 100)) +
        (currentStats.critDamage / 100) * (currentStats.physCritChance / 100)
      );
    const recommendedAverageDamagePhysical = recommendedStats.physDamage *
      ((1 - (recommendedStats.physCritChance / 100)) +
        (recommendedStats.critDamage / 100) * (recommendedStats.physCritChance / 100)
      );
    const currentAverageDamageSpecial = currentStats.specDamage *
      ((1 - (currentStats.specCritChance / 100)) +
        (currentStats.critDamage / 100) * (currentStats.specCritChance / 100)
      );
    const recommendedAverageDamageSpecial = recommendedStats.specDamage *
      ((1 - (recommendedStats.specCritChance / 100)) +
        (recommendedStats.critDamage / 100) * (recommendedStats.specCritChance / 100)
      );

    const statObject = (name: CSStats.DisplayStatNames, currentValue: number, recommendedValue: number) => ({
      name: name,
      displayModifier: '',
      currentValue: Math.floor(currentValue),
      currentStat: null,
      recommendedValue: Math.floor(recommendedValue),
      recommendedStat: null,
      diffStat: new CSStats.CharacterSummaryStat(name, `${Math.floor(recommendedValue - currentValue)}`)
    });

    playerStats['Effective Health (physical)'] = statObject(
      'Effective Health (physical)',
      currentEffectiveHealthPhysical,
      recommendedEffectiveHealthPhysical
    );
    playerStats['Effective Health (special)'] = statObject(
      'Effective Health (special)',
      currentEffectiveHealthSpecial,
      recommendedEffectiveHealthSpecial
    );
    playerStats['Average Damage (physical)'] = statObject(
      'Average Damage (physical)',
      currentAverageDamagePhysical,
      recommendedAverageDamagePhysical
    );
    playerStats['Average Damage (special)'] = statObject(
      'Average Damage (special)',
      currentAverageDamageSpecial,
      recommendedAverageDamageSpecial
    );
  }
}

type ComponentProps = {
  loadout: ModLoadout,
  diffLoadout: ModLoadout,
  showAvatars: boolean,
  character: Character,
  target: OptimizationPlan,
  useUpgrades: boolean,
  assignedCharacter: Character,
  assignedTarget: OptimizationPlan,
  missedGoals: MissedGoals,
}

export default ModLoadoutDetail;
