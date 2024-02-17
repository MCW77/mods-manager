// react
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

// styles
import './ModStats.css';

// modules
import { Data } from '../../state/modules/data';
import { Explore } from '../../state/modules/explore';
import { Storage } from '../../state/modules/storage';

// domain
import { CharacterNames } from '../../constants/characterSettings';
import { modScores } from '../../domain/constants/ModScoresConsts';

import * as Character from '#/domain/Character';
import { Mod } from '../../domain/Mod';
import { OptimizationPlan } from '../../domain/OptimizationPlan';
import { SecondaryStats, Stats } from '../../domain/Stats';

// components
import { CharacterAvatar } from '../CharacterAvatar/CharacterAvatar';
import { SellModButton } from '../SellModButton/SellModButton';

type ComponentProps = {
  mod: Mod;
  showAvatar?: boolean;
  assignedCharacter?: Character.Character | null;
  assignedTarget?: OptimizationPlan;
};

const ModStats = React.memo(
  ({
    mod,
    showAvatar = false,
    assignedCharacter,
    assignedTarget,
  }: ComponentProps) => {
    const [t, i18n] = useTranslation('domain');
    const characters = useSelector(
      Storage.selectors.selectCharactersInActiveProfile,
    );
    const baseCharacters = useSelector(Data.selectors.selectBaseCharacters);
    const scoreName = useSelector(
      Explore.selectors.selectModsViewOptions,
    ).modScore;

    const translateStat = (displayText: Stats.DisplayedStat) => {

      let seperatorPos = displayText.indexOf(' ');
      let statValue = displayText.substring(0, seperatorPos);
      let statName: Stats.DisplayStatNames = displayText.substring(seperatorPos + 1) as Stats.DisplayStatNames;
      let translatedStatName = t(`stats.${statName}`);
      let parts = [statValue, translatedStatName];

      return parts.join(' ');
    };

    const showStatElement = (
      stat: SecondaryStats.SecondaryStat,
      index: number,
    ) => {
      let displayStat = translateStat(stat.show());
      return (
        <li key={index} className={'class-' + stat.getClass()}>
          <span className={'rolls'}>({stat.rolls})</span> {displayStat}
        </li>
      );
    };

    const showStatScoreElement = (
      stat: SecondaryStats.SecondaryStat,
      index: number,
    ) => {
      if (!('score' in stat) || stat.score === undefined)
        return <li key={index}>{'--'}</li>;
      else
        return (
          <li key={index} className={'class-' + stat.score.getClass()}>
            {stat.score.show()}
          </li>
        );
    };

    const showAllStatsScoreElement = (mod: Mod, scoreName: string) => {
      return (
        <li key={5} className={'class-' + mod.getClass()}>
          {modScores.find((modScore) => modScore.name === scoreName)!
            .isFlatOrPercentage === 'IsFlat'
            ? `${mod.scores[scoreName]}`
            : `${Math.floor(mod.scores[scoreName] * 100) / 100}%`}
        </li>
      );
    };

    const character: Character.Character | null =
      mod.characterID !== null
        ? characters[mod.characterID as CharacterNames]
        : null;
    const statsDisplay =
      mod.secondaryStats.length > 0
        ? mod.secondaryStats.map((stat, index) => showStatElement(stat, index))
        : [<li key={0}>None</li>];

    const statsScoresDisplay =
      mod.secondaryStats.length > 0
        ? mod.secondaryStats.map((stat, index) =>
            showStatScoreElement(stat, index),
          )
        : [<li key={0}>None</li>];

    const allStatsScoreDisplay =
      mod.secondaryStats.length > 0
        ? showAllStatsScoreElement(mod, scoreName)
        : [<li key={0}>None</li>];

    return (
      <div className="mod-stats">
        <h4>{t(`Primary`)}</h4>
        <ul>
          <li>{translateStat(mod.primaryStat.show())}</li>
        </ul>
        <div className="secondaries-scores-container">
          <div>
            <h4>{t(`Secondary_plural`)}</h4>
            <ul className="secondary">{statsDisplay}</ul>
          </div>
          <div>
            <h4>{t(`Score_plural`)}</h4>
            <ul className="secondary-scores">
              {statsScoresDisplay}
              <li>----------</li>
              {allStatsScoreDisplay}
            </ul>
          </div>
        </div>
        {showAvatar && character && (
          <div className={'assigned-character'}>
            <h4>Assigned To</h4>
            <CharacterAvatar character={character} />
            <span className="avatar-name">
              {baseCharacters[character.baseID]
                ? baseCharacters[character.baseID].name
                : character.baseID}
            </span>
          </div>
        )}
        {showAvatar && <SellModButton mod={mod} />}
        {assignedCharacter &&
          assignedTarget &&
          mod.shouldLevel(assignedTarget) && (
            <h4 className={'gold'}>Level mod to 15!</h4>
          )}
        {assignedCharacter &&
          assignedTarget &&
          mod.shouldSlice(assignedCharacter, assignedTarget) && (
            <h4 className={'gold'}>Slice mod to 6E!</h4>
          )}
      </div>
    );
  },
);

ModStats.displayName = 'ModStats';

export { ModStats };
