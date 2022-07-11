// react
import * as React from 'react';
import { useDispatch } from "react-redux";

// styles
import './Help.css';

// actions
import {
  showFlash,
} from '../../state/actions/app';

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
        dispatch(showFlash(props.header, props.children))
      }
    />
  }
)

Help.displayName = 'Help';

export default Help;
