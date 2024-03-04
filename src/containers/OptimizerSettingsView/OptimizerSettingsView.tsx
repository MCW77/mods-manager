// react
import React, { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from '#/state/reducers/modsOptimizer';

// state
import { reactive } from '@legendapp/state/react';
import { optimizationSettings$ } from '#/modules/optimization/state/optimization';

// modules
import { CharacterEdit } from '#/state/modules/characterEdit';
import { Storage } from '#/state/modules/storage';

// domain
import { TemplatesAddingMode } from '#/domain/TemplatesAddingMode';

// components
import { SingleValueSlider } from '#/components/SingleValueSlider/SingleValueSlider';
import { Button } from '#ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '#ui/card';
import { Input } from "#ui/input";
import { Label } from '#ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '#ui/select';

// containers
import { TemplatesManager } from '#/containers/TemplatesManager/TemplatesManager';

const ReactiveInput = reactive(Input);
const ReactiveSlider = reactive(SingleValueSlider);

const OptimizerSettingsView = () => {
  const templatesAddingMode = useSelector(CharacterEdit.selectors.selectTemplatesAddingMode);
  const allyCode = useSelector(Storage.selectors.selectAllycode);
  const dispatch: ThunkDispatch = useDispatch();
  const [t, i18n] = useTranslation('settings-ui');

  const global = "grid gap-3 md:grid-cols-[[labels]auto_[controls]1fr] grid-auto-flow-row items-center justify-items-start" as const;
  const labelCSS = "grid-col-[labels] grid-row-auto" as const;
  const inputCSS = "grid-col-[controls] grid-row-auto" as const;

  return (
    <div className="grid grid-gap-2 justify-center grid-cols-[repeat(auto-fit,_minmax(min(500px,_100%),_1fr))]">
      <Card className="!bg-opacity-20 m-4">
        <CardHeader>
          <CardTitle>{t('optimizer.global.Title')}</CardTitle>
        </CardHeader>
        <CardContent className={global}>
          <Label
            className={labelCSS}
            htmlFor="threshold2"
          >
            {t('optimizer.global.Threshold')}:
          </Label>
          <div className={inputCSS + " flex gap-2"}>
            <ReactiveSlider
              id="threshold1"
              min={0}
              max={100}
              step={1}
              $value={optimizationSettings$.settingsByProfile[allyCode].modChangeThreshold}
              onChange={(threshold: number) => {
                optimizationSettings$.settingsByProfile[allyCode].modChangeThreshold.set(threshold)
              }}
            />
            <ReactiveInput
              id="threshold2"
              type="number"
              $value={optimizationSettings$.settingsByProfile[allyCode].modChangeThreshold}
              onChange={(event) =>
                optimizationSettings$.settingsByProfile[allyCode].modChangeThreshold.set(event.target.valueAsNumber)
              }
            />
          </div>
          <Label
            className={labelCSS}
            htmlFor="lock-unselected"
          >
            {t('optimizer.global.LockUnselected')}:
          </Label>
          <ReactiveInput
            className={inputCSS}
            id="lock-unselected"
            type="checkbox"
            $checked={optimizationSettings$.settingsByProfile[allyCode].lockUnselectedCharacters}
            onChange={(event) =>
              optimizationSettings$.settingsByProfile[allyCode].lockUnselectedCharacters.set(event.target.checked)
            }
          />
          <Label
            className={labelCSS}
            htmlFor="force-complete-sets"
          >
            {t('optimizer.global.NoModSetsBreak')}:
          </Label>
          <ReactiveInput
            className={inputCSS}
            id="force-complete-sets"
            type="checkbox"
            $checked={optimizationSettings$.settingsByProfile[allyCode].forceCompleteSets}
            onChange={(event) =>
              optimizationSettings$.settingsByProfile[allyCode].forceCompleteSets.set(event.target.checked)
            }
          />
          <Label
            className={labelCSS}
            htmlFor="simulate-6e"
          >
            {t('optimizer.global.Simulate6E')}
          </Label>
          <ReactiveInput
            className={inputCSS}
            id="simulate-6e"
            type="checkbox"
            $checked={optimizationSettings$.settingsByProfile[allyCode].simulate6EModSlice}
            onChange={(event) =>
              optimizationSettings$.settingsByProfile[allyCode].simulate6EModSlice.set(event.target.checked)
            }
          />
        </CardContent>
        <CardFooter className="grid justify-center">
          <Button>Reset</Button>
        </CardFooter>
      </Card>
      <Card className="!bg-opacity-20 m-4">
        <CardHeader>
          <CardTitle>{t('optimizer.templates.Title')}</CardTitle>
        </CardHeader>
        <CardContent className={global}>
          <Label className={labelCSS}>{t('optimizer.templates.AddingMode')}:</Label>
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
                  <SelectItem value="append">{t('optimizer.templates.Append')}</SelectItem>
                  <SelectItem value="replace">{t('optimizer.templates.Replace')}</SelectItem>
                  <SelectItem value="apply targets only">{t('optimizer.templates.Apply')}</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </FormInput>
          <Label
            className={labelCSS + " self-start"}
          >
            {t('optimizer.templates.Own')}:
          </Label>
          <FormInput><TemplatesManager/></FormInput>
        </CardContent>
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
