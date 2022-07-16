// react
import * as React from 'react';
import { useDispatch } from "react-redux";

// styles
import './Modal.css';

// actions
import {
  hideModal,
} from "../../state/actions/app";

// components
import * as UITypes from '../types';


type ComponentProps = {
  show: boolean,
  className: string,
  content: UITypes.DOMContent,
  cancelable: boolean,
}

const Modal = React.memo(
  ({
    show = false,
    className = '',
    content,
    cancelable = false, 
  }: ComponentProps) => {
    const dispatch = useDispatch();

    if (show === false) {
      return null;
    }

    const classList = `modal ${className}`;

    return (
      <div
        className={'overlay'}
        onClick={() => cancelable && dispatch(hideModal())}
      >
        <div
          className={classList}
          onClick={(e) => e.stopPropagation()}
        >
          {content}
        </div>
      </div>
    )
  }
);

Modal.displayName = 'Modal';

export { Modal };
