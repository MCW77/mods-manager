import React, { PureComponent } from "react";
import * as Redux from 'redux';

import Review from "../Review/Review";
import CharacterEditView from "../CharacterEditView/CharacterEditView";

import "./OptimizerView.css";
import { connect, ConnectedProps } from "react-redux";
import { IAppState } from "state/storage";

class OptimizerView extends PureComponent<Props> {
  render() {
    return (
      <div className={'optimizer-view'}>
        {'edit' === this.props.view && <CharacterEditView/>}
        {'review' === this.props.view && <Review/>}
      </div>
    );
  }
}

const mapStateToProps = (state: IAppState) => ({
  view: state.optimizerView
});

const mapDispatchToProps = (dispatch: Redux.Dispatch<Redux.AnyAction>) => ({});

type Props = PropsFromRedux & ComponentProps;
type PropsFromRedux = ConnectedProps<typeof connector>;
type ComponentProps = {
}

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(OptimizerView);
