// react
import React from "react";
import { useSelector } from "react-redux";

// styles
import "./OptimizerView.css";

// state
import { IAppState } from "../../state/storage";

// selectors
import {
  selectOptimizerView,
} from '../../state/reducers/review';

// containers
import CharacterEditView from "../CharacterEditView/CharacterEditView";
import Review from "../Review/Review";


const OptimizerView = React.memo(
  () => {
    const view = useSelector(selectOptimizerView);

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
