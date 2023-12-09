// react
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

// styles
import './Modal.css';

// modules
import { App } from '../../state/modules/app';

// Components
import { Button } from '#ui/button';

type ComponentProps = {
  className?: string;
};

const FlashMessage = React.memo(({ className = '' }: ComponentProps) => {
  const dispatch = useDispatch();
  const flashMessage = useSelector(App.selectors.selectFlashMessage);
  const classList = `modal flash ${className}`;

  if (flashMessage === null) return null;

  return (
    <div className={'overlay'}>
      <div className={classList}>
        <h2>{flashMessage.heading}</h2>
        <div className={'content'}>{flashMessage.content}</div>
        <div className={'actions'}>
          <Button
            type={'button'}
            onClick={() => dispatch(App.actions.hideFlash())}
          >
            OK
          </Button>
        </div>
      </div>
    </div>
  );
});

FlashMessage.displayName = 'FlashMessage';

export { FlashMessage };
