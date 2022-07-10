// react
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import Redux from "redux";

// state
import { IAppState } from "../../state/storage";

// actions
import {
  hideError,
} from "../../state/actions/app";

// components
import { WarningLabel } from "../../components/WarningLabel/WarningLabel";


class ErrorModal extends React.PureComponent<ErrorModalProps> {
  render() {
    if (!this.props.content) {
      return null;
    }

    return <div className={'overlay'}>
      <div className={'modal error-modal'}>
        <WarningLabel />
        <h2 key={'error-header'}>Error!</h2>
        <div key={'error-message'}>{this.props.content}</div>
        <div key={'error-actions'} className={'actions'}>
          <button type={'button'} onClick={this.props.close}>Ok</button>
        </div>
      </div>
    </div>;

  }
}

type ErrorModalProps = PropsFromRedux & AttributeProps;
type PropsFromRedux = ConnectedProps<typeof connector>;

type AttributeProps = {
}

const mapStateToProps = (state: IAppState) => ({
  content: state.error
});

const mapDispatchToProps = (dispatch: Redux.Dispatch<Redux.AnyAction>) => ({
  close: () => dispatch(hideError())
});

let connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(ErrorModal)
