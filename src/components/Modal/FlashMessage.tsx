// react
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

// styles
import './Modal.css';

// actions
import {
  hideFlash,
} from '../../state/actions/app';

// selectors
import {
  selectFlashMessage,
} from '../../state/reducers/app';

type ComponentProps = {
  className?: string;
};

const FlashMessage = React.memo(({ className = '' }: ComponentProps) => {
  const dispatch = useDispatch();
  const flashMessage = useSelector(selectFlashMessage);
  const classList = `modal flash ${className}`;

  if (flashMessage === null) return null;

  return (
    <div className={'overlay'}>
      <div className={classList}>
        <h2>{flashMessage.heading}</h2>
        <div className={'content'}>{flashMessage.content}</div>
        <div className={'actions'}>
          <button
            type={'button'}
            onClick={() => dispatch(hideFlash())}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
});

FlashMessage.displayName = 'FlashMessage';

export { FlashMessage };
