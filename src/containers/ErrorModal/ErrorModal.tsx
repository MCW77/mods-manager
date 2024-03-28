// react
import React from "react";
import { useDispatch, useSelector } from "react-redux";

// modules
import { App } from "#/state/modules/app";

// components
import { WarningLabel } from "#/components/WarningLabel/WarningLabel";
import { Button } from "#ui/button";


const ErrorModal = React.memo(() => {
  const dispatch = useDispatch();
  const content = useSelector(App.selectors.selectErrorMessage);

  if (content === null) return null;

  return (
    <div className={'overlay'}>
      <div className={'modal error-modal'}>
        <WarningLabel />
        <h2>Error!</h2>
        <div>{content}</div>
        <div className={'actions'}>
          <Button
            type={'button'}
            onClick={() => {dispatch(App.actions.hideError())}}
          >
            Ok
          </Button>
        </div>
      </div>
    </div>
  );
});

ErrorModal.displayName = 'ErrorModal';

export { ErrorModal };
