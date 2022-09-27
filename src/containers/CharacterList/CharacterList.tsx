// react
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "../../state/reducers/modsOptimizer";

// styles
import "./CharacterList.css";

// utils
import groupByKey from "../../utils/groupByKey";

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

// selectors
import {
  selectSelectedCharactersInActiveProfile,
} from '../../state/reducers/characterEdit';
import {
  selectBaseCharacters,
} from '../../state/reducers/data';
import {
  selectCharactersInActiveProfile,
} from '../../state/reducers/storage';

// domain
import { characterSettings, CharacterNames } from "../../constants/characterSettings";

import { Character } from "../../domain/Character";
import { OptimizationPlan } from "../../domain/OptimizationPlan";

// components
import { CharacterAvatar } from "../../components/CharacterAvatar/CharacterAvatar";
import { Dropdown } from "../../components/Dropdown/Dropdown";

// containers
import CharacterEditForm from "../CharacterEditForm/CharacterEditForm";


const CharacterList = React.memo(
  () => {
    const dispatch: ThunkDispatch = useDispatch();
    const baseCharacters = useSelector(selectBaseCharacters);
    const characters = useSelector(selectCharactersInActiveProfile);
    const selectedCharacters = useSelector(selectSelectedCharactersInActiveProfile);

    const characterBlockDragStart = (index: number) => {
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

    const characterBlockDragEnter = () => {
      return function (event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();

        (event.target as HTMLDivElement).classList.add('drop-character');
      }
    }

    const characterBlockDragOver = () => {
      return function (event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();
      }
    }

    const characterBlockDragLeave = () => {
      return function (event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();
        (event.target as HTMLDivElement).classList.remove('drop-character');
      }
    }

    /**
     * @param dropCharacterIndex The index of the character on which the drop is occurring or null (No characters in the list)
     * @returns {Function}
     */
    const characterBlockDrop = (dropCharacterIndex: number | null) => {
      return function (event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();
        event.stopPropagation();
        const options = JSON.parse(event.dataTransfer.getData('application/json'));

        switch (options.effect) {
          case 'add':
            const movingCharacterID: CharacterNames = event.dataTransfer.getData('text/plain') as CharacterNames;
            const movingCharacter = characters[movingCharacterID];
            dispatch(selectCharacter(movingCharacterID, movingCharacter.defaultTarget(), dropCharacterIndex));
            break;
          case 'move':
            const movingCharacterIndex = +event.dataTransfer.getData('text/plain');
            dispatch(moveSelectedCharacter(movingCharacterIndex, dropCharacterIndex));
            break;
          default:
          // Do nothing
        }

        (event.target as HTMLDivElement).classList.remove('drop-character');
      }
    }

    const renderCharacterBlock = (characterId: CharacterNames, target: OptimizationPlan, index: number) => {
      const character = characters[characterId];
      const defaultTargets = characterSettings[character.baseID] ?
        groupByKey(characterSettings[character.baseID].targets, target => target.name) :
        {};

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

      const onSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const optimizationTarget = e.target.value;

        // Don't change the select value unless we explicitly do so through a state change
        e.target.value = target.name;

        if ('custom' === optimizationTarget) {
          showEditCharacterModal(character, index, target.rename('custom'));        
        } else if ('lock' === optimizationTarget) {
          dispatch(lockCharacter(character.baseID));
        } else {
          dispatch(changeCharacterTarget(
            index,
            character.targets().find(target => target.name === optimizationTarget)!
          ));
        }
      };

      const baseClass = `character-block ${character.baseID}`;

      return <div className={'character-block-wrapper'}
        key={index}
        onDragEnter={characterBlockDragEnter()}
        onDragOver={characterBlockDragOver()}
        onDragLeave={characterBlockDragLeave()}
        onDrop={characterBlockDrop(index)}
        onDoubleClick={() => dispatch(unselectCharacter(index))}
      >
        <div className={character.optimizerSettings.isLocked ? `${baseClass} locked` : baseClass}
          draggable={true}
          onDragStart={characterBlockDragStart(index)}>
          {renderCharacterIcons(character, target, index)}
          <CharacterAvatar character={character} />
          <div className={'character-name'}>
            {baseCharacters[character.baseID] ?
              baseCharacters[character.baseID].name :
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
              onClick={() => showEditCharacterModal(character, index, target)}>
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
    const renderCharacterIcons = (character: Character, target: OptimizationPlan, characterIndex: number) => {
      const defaultTargets = characterSettings[character.baseID] ?
        groupByKey(characterSettings[character.baseID].targets, target => target.name) :
        {};

      const levelActive = target.upgradeMods ? 'active' : '';
      const sliceActive = character.optimizerSettings.sliceMods ? 'active' : '';
      const restrictionsActive = target.hasRestrictions() ? 'active' : '';
      const targetStatActive = target.targetStats && target.targetStats.length ? 'active' : '';
      const duplicateActive = selectedCharacters
        .filter(({ id: selectedCharId }) => selectedCharId === character.baseID).length > 1 ? 'active' : '';
      const negativeWeightsActive = target.hasNegativeWeights() ? 'active' : '';
      const minimumDots = character.optimizerSettings.minimumModDots;
      const changedTargetActive = Object.keys(defaultTargets).includes(target.name) &&
        !defaultTargets[target.name].equals(target) ? 'active' : '';
      const blankTargetActive = target.isBlank() ? 'active' : '';
      const lockedActive = character.optimizerSettings.isLocked ? 'active' : '';

      let handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch(changeMinimumModDots(character.baseID, Number(event.target.value)));
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
          onClick={() => dispatch(toggleUpgradeMods(characterIndex))}
          title={levelActive ? 'Level this character\'s mods to 15' : 'Do not level this character\'s mods to 15'} />
        <span className={`icon slice ${sliceActive}`}
          onClick={() => dispatch(toggleSliceMods(character.baseID))}
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
          onClick={() => dispatch(toggleCharacterLock(character.baseID))}
          title={lockedActive ?
            'This character is locked. Its mods will not be assigned to other characters' :
            'This character is not locked'} />
      </div>;
    }

    const showEditCharacterModal = (character: Character, index: number, target: OptimizationPlan) => {
      dispatch(setOptimizeIndex(index));
      dispatch(showModal(
        '',
        <CharacterEditForm
          character={character}
          characterIndex={index}
          target={target}
        />
      ));
    }

    return (
      <div className={'character-list'}
        onDragEnter={characterBlockDragEnter()}
        onDragOver={characterBlockDragOver()}
        onDragLeave={characterBlockDragLeave()}
        onDrop={characterBlockDrop(selectedCharacters.length - 1)}>
        {0 < selectedCharacters.length &&
          // Add a block to allow characters to be dragged to the top of the list
          <div className={'top-block'}
            onDragEnd={characterBlockDragEnter()}
            onDragOver={characterBlockDragOver()}
            onDragLeave={characterBlockDragLeave()}
            onDrop={characterBlockDrop(0)}
          />
        }
        {0 < selectedCharacters.length && selectedCharacters.map(({ id, target }, index) =>
          renderCharacterBlock(id, target, index)
        )}

        {0 === selectedCharacters.length &&
          <div
            className={'character-block'}
            onDragEnter={characterBlockDragEnter()}
            onDragOver={characterBlockDragOver()}
            onDragLeave={characterBlockDragLeave()}
            onDrop={characterBlockDrop(null)} />
        }
      </div>
    );
  }
);

CharacterList.displayName = 'CharacterList';

export { CharacterList };
