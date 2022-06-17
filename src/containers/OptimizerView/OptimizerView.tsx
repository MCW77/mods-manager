// react
import React, { PureComponent } from "react";
import { connect, ConnectedProps } from "react-redux";
import * as Redux from 'redux';

// styles
import "./OptimizerView.css";

// state
import { IAppState } from "../../state/storage";

// containers
import CharacterEditView from "../CharacterEditView/CharacterEditView";
import Review from "../Review/Review";


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
