import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import './SettingsView.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleLeft } from '@fortawesome/free-solid-svg-icons';

import { match } from 'ts-pattern';

import { changeSection } from '../../state/actions/app';
import {
  updateForceCompleteModSets,
  updateLockUnselectedCharacters,
  updateModChangeThreshold,
} from '../../state/actions/characterEdit';

import { IAppState } from 'state/storage';

import RangeInput from '../../components/RangeInput/RangeInput';
import { ThunkDispatch } from 'state/reducers/modsOptimizer';

const SettingsView = () => {
  const previousSection = useSelector(
    (state: IAppState) => state.previousSection
  );
  const settingsSection = useSelector(
    (state: IAppState) => state.settings.section
  );
  const globalOptimizerSettings = useSelector(
    (state: IAppState) => state.profile.globalSettings
  );
  const dispatch: ThunkDispatch = useDispatch();
  const [t, i18n] = useTranslation('settings-ui');
  const [currentSection, changeCurrentSection] = useState(settingsSection);

  const sectionElements: Record<string, React.RefObject<HTMLDivElement>> = {
    general: React.createRef<HTMLDivElement>(),
    explorer: React.createRef<HTMLDivElement>(),
    optimizer: React.createRef<HTMLDivElement>(),
  };

  const renderSection = (sectionName: string) => {
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
      .with('optimizer', () => renderGlobalOptimizerSettings())
      .otherwise(() => {
        return <div id={`settings-${currentSection}`}></div>;
      });
  };

  const renderGlobalOptimizerSettings = () => {
    return (
      <div className={'global-settings'} key={'global-settings'}>
        <h3>Global Optimizer Settings </h3>
        <div className={'form-row'}>
          <label>Threshold to Change Mods:</label>
          <RangeInput
            name={`threshold`}
            id={`threshold`}
            min={0}
            max={100}
            step={1}
            isPercent={true}
            editable={true}
            defaultValue={globalOptimizerSettings.modChangeThreshold}
            onChange={(threshold) =>
              dispatch(updateModChangeThreshold(threshold))
            }
          />
        </div>
        <div className={'form-row'}>
          <label htmlFor={'lock-unselected'}>
            Lock all unselected characters:
          </label>
          <input
            type={'checkbox'}
            defaultChecked={globalOptimizerSettings.lockUnselectedCharacters}
            onChange={(event) =>
              dispatch(updateLockUnselectedCharacters(event.target.checked))
            }
          />
        </div>
        <div className={'form-row'}>
          <label htmlFor={'force-complete-sets'}>Don't break mod sets:</label>
          <input
            type={'checkbox'}
            defaultChecked={globalOptimizerSettings.forceCompleteSets}
            onChange={(event) =>
              dispatch(updateForceCompleteModSets(event.target.checked))
            }
          />
        </div>
      </div>
    );
  };

  return (
    <div className={'Settings-page'} key={'settings'}>
      <nav className="sections">
        {previousSection !== 'settings' && (
          <div className="returnTo">
            <FontAwesomeIcon
              icon={faCircleLeft}
              title={`Go back`}
              onClick={() => dispatch(changeSection(previousSection))}
            />
          </div>
        )}

        {renderSection('general')}
        {renderSection('explorer')}
        {renderSection('optimizer')}
      </nav>
      <div className={'settings'}>{renderTopic()}</div>
    </div>
  );
};

export default SettingsView;
