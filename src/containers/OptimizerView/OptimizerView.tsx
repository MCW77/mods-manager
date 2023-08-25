// react
import React from "react";
import { useSelector } from "react-redux";

// styles
import "./OptimizerView.css";

// modules
import { Review as ReviewModule } from '../../state/modules/review';

// containers
import CharacterEditView from "../CharacterEditView/CharacterEditView";
import Review from "../Review/Review";


const OptimizerView = React.memo(
  () => {
    const view = useSelector(ReviewModule.selectors.selectOptimizerView);

    return (
      <div className={'optimizer-view'}>
        {'edit' === view && <CharacterEditView/>}
        {'review' === view && <Review/>}
      </div>
    )
  }
);

OptimizerView.displayName = 'OptimizerView';

export { OptimizerView };
