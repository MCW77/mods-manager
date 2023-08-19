// react
import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from '../../state/reducers/modsOptimizer';

// modules
import { Optimize } from '../../state/modules/optimize';
import { Storage } from '../../state/modules/storage';

// actions
import {
  hideModal,
  setIsBusy,
} from '../../state/actions/app';

// components
import { CharacterAvatar } from '../CharacterAvatar/CharacterAvatar';


const OptimizerProgress = () => {
  const dispatch: ThunkDispatch = useDispatch();
  const progress = useSelector(Optimize.selectors.selectProgress);
  const isIncremental = useSelector(Storage.selectors.selectIsIncrementalOptimization);

  const cancel = (closeModal: boolean) => {
    dispatch(Optimize.thunks.cancelOptimizer());
    dispatch(setIsBusy(false));
    if (closeModal) {
      dispatch(hideModal());
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
        <button
          type={'button'}
          className={'red'}
          onClick={() => cancel(!isIncremental)}
        >
          Cancel
        </button>
      </div>
    </div>
  )
};

OptimizerProgress.displayName = 'OptimizerProgress';

export { OptimizerProgress };
