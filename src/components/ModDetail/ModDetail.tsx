// react
import * as React from 'react';
import { useSelector } from 'react-redux';

// styles
import './ModDetail.css';

// modules
import { Data } from '#/state/modules/data';
import { Storage } from '#/state/modules/storage';

// domain
import * as Character from '#/domain/Character';
import { Mod } from '#/domain/Mod';
import * as OptimizationPlan from '#/domain/OptimizationPlan';

// components
import { Arrow } from '#/components/Arrow/Arrow';
import { CharacterAvatar } from '#/components/CharacterAvatar/CharacterAvatar';
import { ModImage } from '#/components/ModImage/ModImage';
import { ModStats } from '#/components/ModStats/ModStats';
import { SellModButton } from '#/components/SellModButton/SellModButton';


type ComponentProps = {
  assignedCharacter: Character.Character | null;
  assignedTarget?: OptimizationPlan.OptimizationPlan;
  mod: Mod;
  showAssigned?: boolean;
};

const ModDetail = React.memo(
  ({
    assignedCharacter,
    assignedTarget,
    mod,
    showAssigned = false,
  }: ComponentProps) => {
    const baseCharacters = useSelector(Data.selectors.selectBaseCharacters);
    const characters = useSelector(Storage.selectors.selectCharactersInActiveProfile);

    const character: Character.Character | null =
      mod.characterID !== "null"
        ? characters[mod.characterID]
        : null;

    return (
      <div className={'mod-detail'} key={mod.id}>
        <ModImage mod={mod} />
        {character && <CharacterAvatar character={character} />}
        {character &&
          <h4 className={'character-name'}>{
            baseCharacters[character.baseID]
              ? baseCharacters[character.baseID].name
              : character.baseID
          }</h4>
        }
        <div className="stats">
          <ModStats mod={mod} assignedCharacter={assignedCharacter} assignedTarget={assignedTarget} />
          {showAssigned && assignedCharacter && <div className={'assigned'}>
            <Arrow />
            <CharacterAvatar character={assignedCharacter} />
          </div>}
        </div>
        <SellModButton mod={mod} />
      </div>
    )
  }
);

ModDetail.displayName = 'ModDetail';

export { ModDetail };
