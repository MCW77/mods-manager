// react
import React from "react";
import { useSelector } from "react-redux";

// modules
import { Review as ReviewModule } from '#/state/modules/review';

// containers
import CharacterEditView from "#/containers/CharacterEditView/CharacterEditView";
import Review from "#/containers/Review/Review";


const OptimizerView = React.memo(
  () => {
    const view = useSelector(ReviewModule.selectors.selectOptimizerView);

    return (
      <div className={'flex items-stretch overflow-hidden flex-grow-1'}>
        {'edit' === view && <CharacterEditView/>}
        {'review' === view && <Review/>}
      </div>
    )
  }
);

OptimizerView.displayName = 'OptimizerView';

export { OptimizerView };
