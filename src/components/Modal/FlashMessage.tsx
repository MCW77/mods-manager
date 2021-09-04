import * as React from 'react';
import * as Redux from 'redux';
import './Modal.css';
import {hideFlash} from "../../state/actions/app";
import {connect, ConnectedProps} from "react-redux";

type Props = PropsFromRedux & OwnProps;
type PropsFromRedux = ConnectedProps<typeof connector>;
type OwnProps = {
  className?: string;
}
class FlashMessage extends React.PureComponent<Props> {
  render() {
    if (!this.props.flash) {
      return null;
    }

    const className = this.props.className ? ('modal flash ' + this.props.className) : 'modal flash';

    return <div className={'overlay'}>
      <div className={className}>
        <h2>{this.props.flash.heading}</h2>
        <div className={'content'}>{this.props.flash.content}</div>
        <div className={'actions'}>
          <button type={'button'} onClick={this.props.hideFlash}>OK</button>
        </div>
      </div>
    </div>;
  }
}

interface RootState {
  flashMessage: {
    heading: string;
    content: string;
  };
}
const mapStateToProps = (state: RootState) => ({
  flash: state.flashMessage
});

const mapDispatchToProps = (dispatch: Redux.Dispatch<Redux.AnyAction>) => ({
  hideFlash: () => dispatch(hideFlash())
});

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(FlashMessage);
