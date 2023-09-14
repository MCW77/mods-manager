// react
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ThunkDispatch } from '../../state/reducers/modsOptimizer';

// modules
import { CharacterEdit } from '../../state/modules/characterEdit';
import { Storage } from '../../state/modules/storage';

// components
import { RangeInput } from '../../components/RangeInput/RangeInput';

const OptimizerSettingsView = () => {
  const globalOptimizerSettings = useSelector(Storage.selectors.selectGlobalOptimizationSettings);
  const templatesApplyMode = useSelector(CharacterEdit.selectors.selectTemplatesApplyMode);
  const dispatch: ThunkDispatch = useDispatch();
  const [t, i18n] = useTranslation('settings-ui');

  const row = "flex flex-wrap items-center inline-block" as const;
  const labelCSS = "basis-40 grow-1 shrink-0 p-r-2" as const;
  const inputCSS = "basis-64 grow-1 shrink-0 w-full" as const;

  return (
    <div className="optimizer-settings">
      <section className="global-settings flex col nowrap">
        <h3>Global Optimizer Settings </h3>
        <div className={row}>
          <label className={labelCSS}>Threshold to Change Mods:</label>
          <RangeInput
            className={inputCSS}
            name="threshold"
            id="threshold"
            min={0}
            max={100}
            step={1}
            isPercent={true}
            editable={true}
            defaultValue={globalOptimizerSettings.modChangeThreshold}
            onChange={(threshold) =>
              dispatch(CharacterEdit.thunks.updateModChangeThreshold(threshold))
            }
          />
        </div>
        <div className={row}>
          <label htmlFor="lock-unselected">
            Lock all unselected characters:
          </label>
          <input
            type="checkbox"
            defaultChecked={globalOptimizerSettings.lockUnselectedCharacters}
            onChange={(event) =>
              dispatch(CharacterEdit.thunks.updateLockUnselectedCharacters(event.target.checked))
            }
          />
        </div>
        <div className={row}>
          <label htmlFor="force-complete-sets">Don't break mod sets:</label>
          <input
            type="checkbox"
            defaultChecked={globalOptimizerSettings.forceCompleteSets}
            onChange={(event) =>
              dispatch(CharacterEdit.thunks.updateForceCompleteModSets(event.target.checked))
            }
          />
        </div>
      </section>
    </div>
  );
};

OptimizerSettingsView.displayName = 'OptimizerSettingsView';

export default OptimizerSettingsView;
