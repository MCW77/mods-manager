// react
import * as React from 'react';
import { useDispatch } from "react-redux";

// styles
import './Help.css';

// modules
import { App } from '../../state/modules/app';

// components
import * as UITypes from 'components/types';


type ComponentProps = {
  header: string;
  children: UITypes.DOMContent;
}

const Help = React.memo(
  (props: ComponentProps) => {
    const dispatch = useDispatch();

    return <span className={'icon help'}
      onClick={() =>
        dispatch(App.actions.showFlash(props.header, props.children))
      }
    />
  }
)

Help.displayName = 'Help';

export { Help };
