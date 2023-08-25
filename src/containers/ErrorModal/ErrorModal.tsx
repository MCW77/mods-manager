// react
import React from "react";
import { useDispatch, useSelector } from "react-redux";

// modules
import { App } from "../../state/modules/app";

// components
import { WarningLabel } from "../../components/WarningLabel/WarningLabel";


const ErrorModal = React.memo(
  () => {
    const dispatch = useDispatch();
    const content = useSelector(App.selectors.selectErrorMessage);

    if (content === null) return null;

    return (
      <div className={'overlay'}>
        <div className={'modal error-modal'}>
          <WarningLabel />
          <h2 key={'error-header'}>Error!</h2>
          <div key={'error-message'}>{content}</div>
          <div key={'error-actions'} className={'actions'}>
            <button
              type={'button'}
              onClick={() => {dispatch(App.actions.hideError())}}
            >
              Ok
            </button>
          </div>
        </div>
      </div>
    )
  }
);

ErrorModal.displayName = 'ErrorModal';

export { ErrorModal };
