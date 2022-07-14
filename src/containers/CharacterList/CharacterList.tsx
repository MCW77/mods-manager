// react
import React, { PureComponent } from "react";
import { connect, ConnectedProps } from "react-redux";
import Redux from "redux";
import { ThunkDispatch } from "../../state/reducers/modsOptimizer";

// styles
import "./CharacterList.css";

// utils
import groupByKey from "../../utils/groupByKey";

// state
import { IAppState } from "../../state/storage";

// reducers
import {
  showModal,
} from "../../state/actions/app";

// thunks
import {
  changeCharacterTarget,
  changeMinimumModDots,
  lockCharacter,
  moveSelectedCharacter,
  selectCharacter,
  setOptimizeIndex,
  toggleCharacterLock,
  toggleSliceMods,
  toggleUpgradeMods,
  unselectCharacter,
} from '../../state/thunks/characterEdit';

// domain
import { characterSettings, CharacterNames } from "../../constants/characterSettings";

import { Character } from "../../domain/Character";
import { OptimizationPlan } from "../../domain/OptimizationPlan";

// components
import { DOMContent } from "components/types";

import { CharacterAvatar } from "../../components/CharacterAvatar/CharacterAvatar";
import { Dropdown } from "../../components/Dropdown/Dropdown";

// containers
import CharacterEditForm from "../CharacterEditForm/CharacterEditForm";


class CharacterList extends PureComponent<Props> {
  characterBlockDragStart(index: number) {
    return function (event: React.DragEvent<HTMLDivElement>) {
      event.dataTransfer.dropEffect = 'move';
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', `${index}`);
      // We shouldn't have to do this, but Safari is ignoring both 'dropEffect' and 'effectAllowed' on drop
      const options = {
        'effect': 'move'
      };
      event.dataTransfer.setData('application/json', JSON.stringify(options));
    };
  }

  characterBlockDragEnter() {
    return function (event: React.DragEvent<HTMLDivElement>) {
      event.preventDefault();

      (event.target as HTMLDivElement).classList.add('drop-character');
    }
  }

  characterBlockDragOver() {
    return function (event: React.DragEvent<HTMLDivElement>) {
      event.preventDefault();
    }
  }

  characterBlockDragLeave() {
    return function (event: React.DragEvent<HTMLDivElement>) {
      event.preventDefault();
      (event.target as HTMLDivElement).classList.remove('drop-character');
    }
  }

  /**
   * @param dropCharacterIndex The index of the character on which the drop is occurring or null (No characters in the list)
   * @returns {Function}
   */
  characterBlockDrop(dropCharacterIndex: number | null) {
    const selectCharacter = this.props.selectCharacter;
    const moveCharacter = this.props.moveCharacter;
    const characters = this.props.characters;

    return function (event: React.DragEvent<HTMLDivElement>) {
      event.preventDefault();
      event.stopPropagation();
      const options = JSON.parse(event.dataTransfer.getData('application/json'));

      switch (options.effect) {
        case 'add':
          const movingCharacterID: CharacterNames = event.dataTransfer.getData('text/plain') as CharacterNames;
          const movingCharacter = characters[movingCharacterID];
          selectCharacter(movingCharacterID, movingCharacter.defaultTarget(), dropCharacterIndex);
          break;
        case 'move':
          const movingCharacterIndex = +event.dataTransfer.getData('text/plain');
          moveCharacter(movingCharacterIndex, dropCharacterIndex);
          break;
        default:
        // Do nothing
      }

      (event.target as HTMLDivElement).classList.remove('drop-character');
    }
  }

  renderCharacterBlock(character: Character, target: OptimizationPlan, index: number) {
    const defaultTargets = characterSettings[character.baseID] ?
      groupByKey(characterSettings[character.baseID].targets, target => target.name) :
      {};
    const draggable = this.props.draggable;

    const selectedPlan = target.name;
    const options = character.targets()
      .map(characterTarget => characterTarget.name)
      .filter(targetName => 'custom' !== targetName)
      .map(targetName => {
        const changeIndicator = Object.keys(defaultTargets).includes(targetName) &&
          character!.optimizerSettings.targets.map(target => target.name).includes(targetName) &&
          !defaultTargets[targetName].equals(
            character.optimizerSettings.targets.find(target => target.name === targetName)!
          ) ? '*' : '';

        return <option value={targetName} key={targetName}>{changeIndicator}{targetName}</option>;
      });

    const onSelect = function (this: CharacterList, e: React.ChangeEvent<HTMLSelectElement>) {
      const optimizationTarget = e.target.value;

      // Don't change the select value unless we explicitly do so through a state change
      e.target.value = target.name;

      if ('custom' === optimizationTarget) {
        this.showEditCharacterModal(character, index, target.rename('custom'));        
      } else if ('lock' === optimizationTarget) {
        this.props.lockCharacter(character.baseID);
      } else {
        this.props.changeCharacterTarget(
          index,
          character.targets().find(target => target.name === optimizationTarget)!
        );
      }
    };

    const baseClass = `character-block ${character.baseID}`;

    return <div className={'character-block-wrapper'}
      key={index}
      onDragEnter={this.characterBlockDragEnter()}
      onDragOver={this.characterBlockDragOver()}
      onDragLeave={this.characterBlockDragLeave()}
      onDrop={this.characterBlockDrop(index)}
      onDoubleClick={() => this.props.unselectCharacter(index)}>
      <div className={character.optimizerSettings.isLocked ? `${baseClass} locked` : baseClass}
        draggable={draggable}
        onDragStart={this.characterBlockDragStart(index)}>
        {this.renderCharacterIcons(character, target, index)}
        <CharacterAvatar character={character} />
        <div className={'character-name'}>
          {this.props.baseCharacters[character.baseID] ?
            this.props.baseCharacters[character.baseID].name :
            character.baseID}
        </div>
        <div className={'target'}>
          <label>Target:</label>
          <Dropdown value={selectedPlan} onChange={onSelect.bind(this)}>
            {options}
            <option value={'custom'}>Custom</option>
          </Dropdown>
          <button
            type={'button'}
            onClick={() => this.showEditCharacterModal(character, index, target)}>
            Edit
          </button>
        </div>
      </div>
    </div>;
  }

  /**
   * Renders the set of 10 icons that show the state of a selected character
   * @param character {Character}
   * @param target {OptimizationPlan}
   */
  renderCharacterIcons(character: Character, target: OptimizationPlan, characterIndex: number) {
    const defaultTargets = characterSettings[character.baseID] ?
      groupByKey(characterSettings[character.baseID].targets, target => target.name) :
      {};

    const levelActive = target.upgradeMods ? 'active' : '';
    const sliceActive = character.optimizerSettings.sliceMods ? 'active' : '';
    const restrictionsActive = target.hasRestrictions() ? 'active' : '';
    const targetStatActive = target.targetStats && target.targetStats.length ? 'active' : '';
    const duplicateActive = this.props.selectedCharacters
      .filter(({ character: sc }) => sc.baseID === character.baseID).length > 1 ? 'active' : '';
    const negativeWeightsActive = target.hasNegativeWeights() ? 'active' : '';
    const minimumDots = character.optimizerSettings.minimumModDots;
    const changedTargetActive = Object.keys(defaultTargets).includes(target.name) &&
      !defaultTargets[target.name].equals(target) ? 'active' : '';
    const blankTargetActive = target.isBlank() ? 'active' : '';
    const lockedActive = character.optimizerSettings.isLocked ? 'active' : '';

    let handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      this.props.changeMinimumModDots(character.baseID, Number(event.target.value));
      (document?.activeElement as HTMLSelectElement)?.blur();
    }
    handleChange = handleChange.bind(this);

    return <div className={'character-icons'}>

      <span className={`icon minimum-dots`}
        title={`This character will only use mods with at least ${minimumDots} ${1 === minimumDots ? 'dot' : 'dots'}`} >
        <select
          value={minimumDots}
          onChange={handleChange}
        >
          {[1, 2, 3, 4, 5, 6].map(dots => <option key={dots} value={dots}>{dots}</option>)}
        </select>
        <span className={` ${1 < minimumDots ? 'green active' : 'gray'}`}>{minimumDots}</span>
      </span>
      <span className={`icon level ${levelActive}`}
        onClick={() => this.props.toggleUpgradeMods(characterIndex)}
        title={levelActive ? 'Level this character\'s mods to 15' : 'Do not level this character\'s mods to 15'} />
      <span className={`icon slice ${sliceActive}`}
        onClick={() => this.props.toggleSliceMods(character.baseID)}
        title={sliceActive ? 'Slice this character\'s mods to 6E' : 'Do not slice this character\'s mods to 6E'} />
      <span className={`icon restrictions ${restrictionsActive}`}
        title={restrictionsActive ?
          'This character has restrictions active' :
          'This character has no restrictions active'} />
      <span className={`icon target ${targetStatActive}`}
        title={targetStatActive ?
          'This character has a target stat selected' :
          'This character has no target stat selected'} />
      <span className={`icon duplicate ${duplicateActive}`}
        title={duplicateActive ?
          'This character is in the list more than once' :
          'This character is only in the list once'} />
      <span className={`icon negative ${negativeWeightsActive}`}
        title={negativeWeightsActive ?
          'This character\'s target has negative stat weights' :
          'This character\'s target has no negative stat weights'} />
      <span className={`icon changed-target ${changedTargetActive}`}
        title={changedTargetActive ?
          'This character\'s target has been modified from the default' :
          'This character\'s target matches the default'} />
      <span className={`icon blank-target ${blankTargetActive}`}
        title={blankTargetActive ?
          'This character\'s target has no assigned stat weights' :
          'This character\'s target has at least one stat given a value'} />
      <span className={`icon locked ${lockedActive}`}
        onClick={() => this.props.toggleCharacterLock(character.baseID)}
        title={lockedActive ?
          'This character is locked. Its mods will not be assigned to other characters' :
          'This character is not locked'} />
    </div>;
  }

  render() {
    return (
      <div className={'character-list'}
        onDragEnter={this.characterBlockDragEnter()}
        onDragOver={this.characterBlockDragOver()}
        onDragLeave={this.characterBlockDragLeave()}
        onDrop={this.characterBlockDrop(this.props.selectedCharacters.length - 1)}>
        {0 < this.props.selectedCharacters.length &&
          // Add a block to allow characters to be dragged to the top of the list
          <div className={'top-block'}
            onDragEnd={this.characterBlockDragEnter()}
            onDragOver={this.characterBlockDragOver()}
            onDragLeave={this.characterBlockDragLeave()}
            onDrop={this.characterBlockDrop(0)}
          />
        }
        {0 < this.props.selectedCharacters.length && this.props.selectedCharacters.map(({ character, target }, index) =>
          this.renderCharacterBlock(character, target, index)
        )}

        {0 === this.props.selectedCharacters.length &&
          <div
            className={'character-block'}
            onDragEnter={this.characterBlockDragEnter()}
            onDragOver={this.characterBlockDragOver()}
            onDragLeave={this.characterBlockDragLeave()}
            onDrop={this.characterBlockDrop(null)} />
        }
      </div>
    )
  }

  showEditCharacterModal(character: Character, index: number, target: OptimizationPlan) {
    this.props.setOptimizeIndex(index);
    this.props.showModal(
      '',
      <CharacterEditForm
        character={character}
        characterIndex={index}
        target={target}
      />
    );
  }

}

const mapStateToProps = (state: IAppState) => {
  return {
    characters: state.profile?.characters ?? [],
    baseCharacters: state.baseCharacters,
    selectedCharacters: state.profile?.selectedCharacters.map(
      ({ id: characterID, target }) => ({ character: state.profile.characters[characterID], target: target })
    ) ?? []
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  showModal: (clazz: string, content: DOMContent) => dispatch(showModal(clazz, content)),
  selectCharacter: (characterID: CharacterNames, target: OptimizationPlan, prevIndex: number | null) => dispatch(selectCharacter(characterID, target, prevIndex)),
  unselectCharacter: (characterIndex: number) => dispatch(unselectCharacter(characterIndex)),
  moveCharacter: (fromIndex: number, toIndex: number | null) => dispatch(moveSelectedCharacter(fromIndex, toIndex)),
  changeCharacterTarget: (characterIndex: number, target: OptimizationPlan) => dispatch(changeCharacterTarget(characterIndex, target)),
  lockCharacter: (characterID: CharacterNames) => dispatch(lockCharacter(characterID)),
  toggleCharacterLock: (characterID: CharacterNames) => dispatch(toggleCharacterLock(characterID)),
  toggleSliceMods: (characterID: CharacterNames) => dispatch(toggleSliceMods(characterID)),
  toggleUpgradeMods: (characterIndex: number) => dispatch(toggleUpgradeMods(characterIndex)),
  changeMinimumModDots: (characterID: CharacterNames, newMinimum: number) => dispatch(changeMinimumModDots(characterID, newMinimum)),
  setOptimizeIndex: (index: number) => dispatch(setOptimizeIndex(index)),
});

type Props = PropsFromRedux & OwnProps;
type PropsFromRedux = ConnectedProps<typeof connector>;
type OwnProps = {
  selfDrop: boolean;
  draggable: boolean;
}

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(CharacterList);
