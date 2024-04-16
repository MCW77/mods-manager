// react
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { observer } from '@legendapp/state/react';

// styles
import './SettingsView.css';
import {
  faCircleLeft,
} from '@fortawesome/free-solid-svg-icons';

// utils
import { match } from 'ts-pattern';

// state
import { ui$ } from '#/modules/ui/state/ui';

// modules
import { Settings } from '#/state/modules/settings';

// domain
import { SettingsSections } from '#/domain/SettingsSections';

// components
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// containers
import GeneralSettingsView from '#/containers/GeneralSettingsView/GeneralSettingsView';
import OptimizerSettingsView from '#/containers/OptimizerSettingsView/OptimizerSettingsView';

const SettingsView = observer(() => {
  const settingsSection = useSelector(Settings.selectors.selectSettingsPosition).section;
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
        {ui$.previousSection.get() !== 'settings' && (
          <div className="returnTo">
            <FontAwesomeIcon
              icon={faCircleLeft}
              title={`Go back`}
              onClick={() => {
                ui$.goToPreviousSection();
              }}
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
});

SettingsView.displayName = 'SettingsView';

export { SettingsView };
