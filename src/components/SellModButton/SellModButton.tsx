// react
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from '../../state/reducers/modsOptimizer';

// modules
import { App } from '../../state/modules/app';
import { Data } from '../../state/modules/data';
import { Storage } from '../../state/modules/storage';

// domain
import { Mod } from '../../domain/Mod';

// components
import { CharacterAvatar } from '../CharacterAvatar/CharacterAvatar';
import { ModImage } from '../ModImage/ModImage';
import { ModStats } from '../ModStats/ModStats';
import { Button } from '#ui/button';

type ComponentProps = {
  mod: Mod;
};

const SellModButton = React.memo(({ mod }: ComponentProps) => {
  const dispatch: ThunkDispatch = useDispatch();
  const characters = useSelector(
    Storage.selectors.selectCharactersInActiveProfile,
  );
  const baseCharacters = useSelector(Data.selectors.selectBaseCharacters);

  const deleteModal = () => {
    const character =
      mod.characterID !== 'null' ? characters[mod.characterID] : null;

    return (
      <div>
        <h2>Delete Mod</h2>
        <div className={'delete-mod-display'}>
          <ModImage mod={mod} />
          {character && <CharacterAvatar character={character} />}
          {character && (
            <h4 className={'character-name'}>
              {baseCharacters[character.baseID]
                ? baseCharacters[character.baseID].name
                : character.baseID}
            </h4>
          )}
          <ModStats mod={mod} />
        </div>
        <p>Are you sure you want to delete this mod from the mods optimizer?</p>
        <div className={'flex gap-2 justify-center'}>
          <Button
            type={'button'}
            onClick={() => {
              dispatch(App.actions.hideModal());
            }}
          >
            No
          </Button>
          <Button
            type={'button'}
            onClick={() => {
              dispatch(Storage.thunks.deleteMod(mod));
              dispatch(App.actions.hideModal());
            }}
            className={''}
            variant={'destructive'}
          >
            Yes, Delete Mod
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Button
      type={'button'}
      variant={'destructive'}
      size={'xs'}
      className={'absolute top-0 right-0 m-2'}
      onClick={() => dispatch(App.actions.showModal('', deleteModal()))}
    >
      X
    </Button>
  );
});

SellModButton.displayName = 'SellModButton';

export { SellModButton };
