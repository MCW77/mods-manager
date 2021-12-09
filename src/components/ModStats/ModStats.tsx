import React from 'react';
import {connect, ConnectedProps} from "react-redux";

import { TFunction, withTranslation, WithTranslation } from 'react-i18next';

import './ModStats.css';

import { IAppState } from '../../state/storage';
import { Character, Characters } from '../../domain/Character';
import { CharacterNames } from '../../constants/characterSettings';
import { Mod } from '../../domain/Mod';
import { modScores } from '../../domain/constants/ModScoresConsts';
import { OptimizationPlan} from '../../domain/OptimizationPlan';
import { SecondaryStats } from '../../domain/Stats';

import CharacterAvatar from "../CharacterAvatar/CharacterAvatar";
import SellModButton from "../SellModButton/SellModButton";

class ModStats extends React.PureComponent<Props> {
  render() {
    const mod = this.props.mod;
    const character: Character | null = mod.characterID !== null ? this.props.characters[mod.characterID as CharacterNames] : null;
    const showAvatar = 'showAvatar' in this.props;
    const scoreName = this.props.scoreName;
    const statsDisplay = mod.secondaryStats.length > 0 ?
      mod.secondaryStats.map(
        (stat, index) => ModStats.showStatElement(stat, index, this.props.t)
      ) : [<li key={0}>None</li>];

    const statsScoresDisplay = mod.secondaryStats.length > 0 ?
      mod.secondaryStats.map(
        (stat, index) => ModStats.showStatScoreElement(stat, index)
      ) : [<li key={0}>None</li>];

    const allStatsScoreDisplay = mod.secondaryStats.length > 0 ?
      ModStats.showAllStatsScoreElement(mod, scoreName)
    :  
      [<li key={0}>None</li>];

    const assignedCharacter = this.props.assignedCharacter;
    const assignedTarget = this.props.assignedTarget;

    return (
      <div className='mod-stats'>
        <h4>{this.props.t(`Primary`)}</h4>
        <ul>
          <li>{ModStats.translateStat(mod.primaryStat.show(), this.props.t)}</li>
        </ul>
        <div className='secondaries-scores-container'>
          <div>
            <h4>{this.props.t(`Secondary_plural`)}</h4>
            <ul className='secondary'>
              {statsDisplay}
            </ul>
          </div>
          <div>
            <h4>{this.props.t(`Score_plural`)}</h4>
            <ul className='secondary-scores'>
              {statsScoresDisplay}
              <li>----------</li>
              {allStatsScoreDisplay}
            </ul>
          </div>  
        </div>
        {showAvatar && character &&
        <div className={'assigned-character'}>
          <h4>Assigned To</h4>
          <CharacterAvatar character={character}/>
          <span className="avatar-name">
            {this.props.baseCharacters[character.baseID] ? this.props.baseCharacters[character.baseID].name : character.baseID}
          </span>
        </div>
        }
        {showAvatar && <SellModButton mod={mod} />}
        {assignedCharacter && assignedTarget && mod.shouldLevel(assignedTarget) &&
        <h4 className={'gold'}>Level mod to 15!</h4>
        }
        {assignedCharacter && assignedTarget && mod.shouldSlice(assignedCharacter, assignedTarget) &&
        <h4 className={'gold'}>Slice mod to 6E!</h4>
        }
      </div>
    );
  }

  static translateStat(displayText: string, translator: TFunction<'domain'>): string {
    let parts = displayText.split(' ');
        if (parts.length === 3){
      parts[1] = `${parts[1]} ${parts[2]}`;
      parts.length = 2;
    }
    parts[1] = translator(`stats.${parts[1]}`);
    return parts.join(' ');
  }
  /**
   * Write out the string to display a stat's value, category, and class
   *
   * @param stat object The stat to display, with 'value' and 'type' fields
   * @param index integer The array index of this stat for this mod
   */
  static showStatElement(stat: SecondaryStats.SecondaryStat, index: number, translator: TFunction<'domain'>) {
    let displayStat = ModStats.translateStat(stat.show(), translator);
    return <li key={index} className={'class-' + stat.getClass()}>
      <span className={'rolls'}>({stat.rolls})</span> {displayStat}
    </li>;
  }

  /**
   * Write out the string to display a stat's score value
   *
   * @param stat object The stat to display it's score
   * @param index integer The array index of this stat for this mod
   */
  static showStatScoreElement(stat: SecondaryStats.SecondaryStat, index: number) {
    if (!('score' in stat) || stat.score === undefined) return <li key={index}>
      {'--'}
    </li>
    else
      return <li key={index} className={'class-' + stat.score.getClass()}>
       {stat.score.show()}
    </li>;
  }

  static showAllStatsScoreElement(mod: Mod, scoreName: string) {
    return <li key={5} className={'class-' + mod.getClass()}>
      {modScores.find(modScore => modScore.name === scoreName)!.isFlatOrPercentage === 'IsFlat' ?
          `${mod.scores[scoreName]}`
        :
          `${Math.floor(mod.scores[scoreName] * 100)/100}%`}
    </li>;
  }

}

type ComponentProps = {
  mod: Mod,
  showAvatar?: boolean,
  assignedCharacter?: Character,
  assignedTarget?: OptimizationPlan,
}

type Props = PropsFromRedux & ComponentProps & WithTranslation<'domain'>;
type PropsFromRedux = ConnectedProps<typeof connector>;

const mapStateToProps = (state: IAppState) => ({
  characters: state.profile?.characters as Characters,
  baseCharacters: state.baseCharacters,
  scoreName: state.modsViewOptions.modScore,
});

const mapDispatchToProps = () => ({});

const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(withTranslation('domain')(ModStats));
