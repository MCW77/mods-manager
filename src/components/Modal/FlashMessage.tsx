// react
import React from "react";
import { useDispatch, useSelector } from "react-redux";

// styles
import "./Modal.css";

// modules
import { App } from "#/state/modules/app";

// components
import { Button } from "#ui/button";


const FlashMessage = React.memo(() => {
  const dispatch = useDispatch();
  const flashMessage = useSelector(App.selectors.selectFlashMessage);

  if (flashMessage === null) return null;

  return (
    <div className={'overlay'}>
      <div className={"modal flash"}>
        <h2 className={"text-[#eeca41]"}>{flashMessage.heading}</h2>
        <div>{flashMessage.content}</div>
        <div className={'actions'}>
          <Button
            type={'button'}
            onClick={() => dispatch(App.actions.hideFlash())}
          >
            Ok
          </Button>
        </div>
      </div>
    </div>
  );
});

FlashMessage.displayName = 'FlashMessage';

export { FlashMessage };
