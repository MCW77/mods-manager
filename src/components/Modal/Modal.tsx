import * as React from 'react';
import * as Redux from 'redux';
import {connect, ConnectedProps} from "react-redux";

import './Modal.css';

import {hideModal} from "../../state/actions/app";
import * as UITypes from 'components/types';

class Modal extends React.PureComponent<Props> {
  render() {
    if (!this.props.show) {
      return null;
    }

    const className = this.props.className ? ('modal ' + this.props.className) : 'modal';
    const content = this.props.content;

    return <div
      className={'overlay'}
      onClick={() => this.props.cancelable && this.props.hideModal()}
    >
      <div className={className} onClick={(e) => e.stopPropagation()}>
        {content}
      </div>
    </div>;
  }
}

type Props = PropsFromRedux & ComponentProps;
type PropsFromRedux = ConnectedProps<typeof connector>;

type ComponentProps = {
  show: boolean,
  className: string,
  content: UITypes.DOMContent,
  cancelable: boolean,
}

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch: Redux.Dispatch<Redux.AnyAction>) => ({
  hideModal: () => dispatch(hideModal())
});

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(Modal);
