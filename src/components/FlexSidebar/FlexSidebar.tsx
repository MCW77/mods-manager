// react
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

// styles
import './FlexSidebar.css';
import {
  faAngleLeft,
} from '@fortawesome/free-solid-svg-icons';

// components
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


interface Props {
  isCollapsed?: boolean;
  mainContent: JSX.Element | JSX.Element[];
  sidebarContent: JSX.Element | JSX.Element[];
}

const FlexSidebar = (props: Props) => {
  const [t, i18n] = useTranslation('global-ui');
  const [isCollapsed, setCollapsed] = useState(props.isCollapsed ?? false);

  return (
    <div className={`flexsidebar-container ${isCollapsed ? 'collapsed' : ''}`}>
      <span
        className={`flexsidebar-toggle ${isCollapsed ? 'show' : 'collapse'}`}
        onClick={() => {
          setCollapsed(!isCollapsed);
        }}
      >
        <FontAwesomeIcon
          icon={faAngleLeft}
          title={`${isCollapsed ? t('sidebar.Toggle-show', 'show sidebar') : t(`sidebar.Toggle-collapse`, 'collapse sidebar')}`}
        />
      </span>
      <div className={`flexsidebar`}>
        {props.sidebarContent}
      </div>
      <div className={`flexsidebar-maincontent`}>
        {props.mainContent}
      </div>
    </div>
  );
};

export { FlexSidebar };
