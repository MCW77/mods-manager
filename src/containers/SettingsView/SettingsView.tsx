import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { ThunkDispatch } from "state/reducers/modsOptimizer";
import { withTranslation, WithTranslation } from "react-i18next";

import "./SettingsView.css";

import { IAppState } from "state/storage";

class SettingsView extends React.PureComponent<Props> {
  render() {
    return [
      <div className={'Settings-page'} key={'settings-page'}>
      </div>  
    ];
  }
}

const mapStateToProps = (state: IAppState) => {
  return {
    version: state.version,
  }
};

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
});

type Props = PropsFromRedux & OwnProps & WithTranslation<['global-ui']>;
type PropsFromRedux = ConnectedProps<typeof connector>;
type OwnProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(withTranslation(['global-ui'])(SettingsView));