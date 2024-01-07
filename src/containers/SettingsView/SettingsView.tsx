// react
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from '#/state/reducers/modsOptimizer';

// styles
import './SettingsView.css';
import {
  faCircleLeft,
} from '@fortawesome/free-solid-svg-icons';

// utils
import { match } from 'ts-pattern';

// modules
import { App } from '#/state/modules/app';
import { Settings } from '#/state/modules/settings';
import { Storage } from '#/state/modules/storage';

// domain
import { SettingsSections } from '#/domain/SettingsSections';

// components
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// containers
import GeneralSettingsView from '#/containers/GeneralSettingsView/GeneralSettingsView';
import OptimizerSettingsView from '#/containers/OptimizerSettingsView/OptimizerSettingsView';

const SettingsView = () => {
  const previousSection = useSelector(App.selectors.selectPreviousSection);
  const settingsSection = useSelector(Settings.selectors.selectSettingsPosition).section;
  const dispatch: ThunkDispatch = useDispatch();
  const [t, i18n] = useTranslation('settings-ui');
  const [currentSection, changeCurrentSection] = useState(settingsSection);

  const sectionElements: Record<string, React.RefObject<HTMLDivElement>> = {
    general: React.createRef<HTMLDivElement>(),
    explorer: React.createRef<HTMLDivElement>(),
    optimizer: React.createRef<HTMLDivElement>(),
  };

  const renderSection = (sectionName: SettingsSections) => {
    let classes = sectionName;
    if (sectionName === currentSection) classes += ` selected`;

    return (
      <div
        className={classes}
        ref={sectionElements[sectionName]}
        onClick={() => changeCurrentSection(sectionName)}
      >
        {t(`${sectionName}.Title`)}
      </div>
    );
  };

  const renderTopic = () => {
    return match(currentSection)
      .with('general', () => <GeneralSettingsView />)
      .with('optimizer', () => <OptimizerSettingsView />)
      .otherwise(() => {
        return <div id={`settings-${currentSection}`}></div>;
      });
  };

  return (
    <div className={'Settings-page'} key={'settings'}>
      <nav className="sections">
        {previousSection !== 'settings' && (
          <div className="returnTo">
            <FontAwesomeIcon
              icon={faCircleLeft}
              title={`Go back`}
              onClick={() => dispatch(App.actions.changeSection(previousSection))}
            />
          </div>
        )}

        {renderSection('general')}
        {renderSection('explorer')}
        {renderSection('optimizer')}
      </nav>
      <div className={'overflow-y-auto'}>{renderTopic()}</div>
    </div>
  );
};

SettingsView.displayName = 'SettingsView';
export { SettingsView };
