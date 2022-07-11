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


interface ComponentProps {
  isCollapsed?: boolean;
  mainContent: JSX.Element | JSX.Element[];
  sidebarContent: JSX.Element | JSX.Element[];
}

const FlexSidebar = ({
  isCollapsed = false,
  mainContent,
  sidebarContent,
}: ComponentProps) => {
  const [t, i18n] = useTranslation('global-ui');
  const [isCollapsed2, setCollapsed] = useState(isCollapsed);

  return (
    <div className={`flexsidebar-container ${isCollapsed2 ? 'collapsed' : ''}`}>
      <span
        className={`flexsidebar-toggle ${isCollapsed2 ? 'show' : 'collapse'}`}
        onClick={() => {
          setCollapsed(!isCollapsed2);
        }}
      >
        <FontAwesomeIcon
          icon={faAngleLeft}
          title={`${isCollapsed2 ? t('sidebar.Toggle-show', 'show sidebar') : t(`sidebar.Toggle-collapse`, 'collapse sidebar')}`}
        />
      </span>
      <div className={`flexsidebar`}>
        {sidebarContent}
      </div>
      <div className={`flexsidebar-maincontent`}>
        {mainContent}
      </div>
    </div>
  );
};

FlexSidebar.displayName = 'FlexSidebar';

export { FlexSidebar };
