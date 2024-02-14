// react
import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from '../../state/reducers/modsOptimizer';

// state
import { isBusy$ } from '#/modules/busyIndication/state/isBusy';

// modules
import { App } from '../../state/modules/app';
import { Optimize } from '../../state/modules/optimize';
import { Storage } from '../../state/modules/storage';

// components
import { CharacterAvatar } from '../CharacterAvatar/CharacterAvatar';
import { Button } from '#ui/button';


const OptimizerProgress = () => {
  const dispatch: ThunkDispatch = useDispatch();
  const progress = useSelector(Optimize.selectors.selectProgress);
  const isIncremental = useSelector(Storage.selectors.selectIsIncrementalOptimization);

  const cancel = (closeModal: boolean) => {
    dispatch(Optimize.thunks.cancelOptimizer());
    isBusy$.set(false);
    if (closeModal) {
      dispatch(App.actions.hideModal());
    }
  };

  return (
    <div>
      <h3>Optimizing Your Mods...</h3>
      <div className={'progressBox'}>
        {progress.character &&
          <div className={'character'}><CharacterAvatar character={progress.character} /></div>
        }
        <div className={'step'}>{progress.step}</div>
        <div className={'progress'}>
          <span className={'progress-bar'} id={'progress-bar'} style={{ width: `${progress.progress}%` }} />
        </div>
      </div>
      <div className={'actions'}>
        <Button
          type={'button'}
          variant={'destructive'}
          className={''}
          onClick={() => cancel(!isIncremental)}
        >
          Cancel
        </Button>
      </div>
    </div>
  )
};

OptimizerProgress.displayName = 'OptimizerProgress';

export { OptimizerProgress };
