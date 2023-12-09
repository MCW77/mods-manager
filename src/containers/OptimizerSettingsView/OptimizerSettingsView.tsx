// react
import React, { PropsWithChildren } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ThunkDispatch } from '../../state/reducers/modsOptimizer';

// modules
import { CharacterEdit } from '../../state/modules/characterEdit';
import { Storage } from '../../state/modules/storage';

// domain
import { TemplatesAddingMode } from '../../domain/TemplatesAddingMode';

// components
import { Button } from '#/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '#/components/ui/card';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '#/components/ui/select';
import { RangeInput } from '../../components/RangeInput/RangeInput';

// containers
import { TemplatesManager } from '../TemplatesManager/TemplatesManager';

const OptimizerSettingsView = () => {
  const globalOptimizerSettings = useSelector(Storage.selectors.selectGlobalOptimizationSettings);
  const templatesAddingMode = useSelector(CharacterEdit.selectors.selectTemplatesAddingMode);
  const dispatch: ThunkDispatch = useDispatch();
  const [t, i18n] = useTranslation('settings-ui');

  const global = "grid gap-3 md:grid-cols-[[labels]auto_[controls]1fr] grid-auto-flow-row items-center justify-items-start" as const;
  const labelCSS = "grid-col-[labels] grid-row-auto" as const;
  const inputCSS = "grid-col-[controls] grid-row-auto" as const;

  return (
    <div className="grid grid-gap-2 justify-center grid-cols-[repeat(auto-fit,_minmax(min(500px,_100%),_1fr))]">
      <Card className="!bg-opacity-20 m-4">
        <CardHeader>
          <CardTitle>Global Optimizer Settings</CardTitle>
        </CardHeader>
        <CardContent className={global}>
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
          <label
            className={labelCSS}
            htmlFor="lock-unselected"
          >
            Lock all unselected characters:
          </label>
          <input
            className={inputCSS}
            type="checkbox"
            defaultChecked={globalOptimizerSettings.lockUnselectedCharacters}
            onChange={(event) =>
              dispatch(CharacterEdit.thunks.updateLockUnselectedCharacters(event.target.checked))
            }
          />
          <label
            className={labelCSS}
            htmlFor="force-complete-sets"
          >
            Don't break mod sets:
          </label>
          <input
            className={inputCSS}
            type="checkbox"
            defaultChecked={globalOptimizerSettings.forceCompleteSets}
            onChange={(event) =>
              dispatch(CharacterEdit.thunks.updateForceCompleteModSets(event.target.checked))
            }
          />
        </CardContent>
        <CardFooter className="grid justify-center">
          <Button>Reset</Button>
        </CardFooter>
      </Card>
      <Card className="!bg-opacity-20 m-4">
        <CardHeader>
          <CardTitle>Character Templates</CardTitle>
        </CardHeader>
        <CardContent className={global}>
          <label className={labelCSS}>Template adding mode:</label>
          <FormInput>
            <Select
              value={templatesAddingMode}
              onValueChange={(value : TemplatesAddingMode) => {
                dispatch(CharacterEdit.actions.setTemplatesAddingMode(value))
              }}
            >
              <SelectTrigger className="w-[180px] accent-blue">
                <SelectValue placeholder={templatesAddingMode}/>
              </SelectTrigger>
              <SelectContent className="accent-blue">
                <SelectGroup className="accent-blue">
                  <SelectItem value="append">append</SelectItem>
                  <SelectItem value="replace">replace</SelectItem>
                  <SelectItem value="apply targets only">apply targets only</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </FormInput>
          <label
            className={labelCSS}
          >
            User templates:
          </label>
          <FormInput><TemplatesManager/></FormInput>
        </CardContent>
        <CardFooter className="grid justify-center">
          <Button>Reset</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

const FormInput = (props: PropsWithChildren<{}>) => {
  return (
    <div className="grid-col-[controls] grid-row-auto">
      {props.children}
    </div>
  )
}

OptimizerSettingsView.displayName = 'OptimizerSettingsView';

export default OptimizerSettingsView;