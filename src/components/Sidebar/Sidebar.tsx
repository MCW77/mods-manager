// react
import React from "react";
import { useDispatch, useSelector } from "react-redux";

// styles
import "./Sidebar.css";

// actions
import {
  toggleSidebar,
} from '../../state/actions/app';

// selectors
import { selectShowSidebar } from '../../state/reducers/app';

// components
import * as UITypes from '../types';


type ComponentProps = {
  content: UITypes.DOMContent;
}

const Sidebar = React.memo(
  ({
    content
  }: ComponentProps) => {
    const dispatch = useDispatch();
    const showSidebar = useSelector(selectShowSidebar);

    return (
      <div className="sidebar-wrapper">
        <div className={`sidebar ${showSidebar ? 'show' : 'hide'}`} key={'sidebar'}>
          {content}
        </div>
        <button
          className={`toggle-sidebar ${showSidebar ? 'hide' : 'show'}`}
          onClick={() => dispatch(toggleSidebar()) }
        >
        </button>
      </div>
    );
  }
);

Sidebar.displayName = 'Sidebar';

export { Sidebar };
