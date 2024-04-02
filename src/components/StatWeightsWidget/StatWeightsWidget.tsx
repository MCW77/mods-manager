// react
import React, { useRef } from "react";
import { Switch, observer, reactive, useObservable } from "@legendapp/state/react";

// state
import { enableReactComponents } from "@legendapp/state/config/enableReactComponents";
import { ObservableOptimizationPlan } from "#/containers/CharacterEditForm/CharacterEditForm";

// domain
import * as OptimizationPlan from "#/domain/OptimizationPlan";

// components
import { SingleValueSlider } from "#/components/SingleValueSlider/SingleValueSlider";
import { Button } from "#ui/button";
import { Input } from "#ui/input";
import { Label } from "#ui/label";
import { Switch as ShadSwitch } from "#ui/switch";

enableReactComponents();

const ReactiveInput = reactive(Input);
const ReactiveSlider = reactive(SingleValueSlider);
const ReactiveSwitch = reactive(ShadSwitch);

type AdvancedInputProps = {
  target$: ObservableOptimizationPlan,
  stat: OptimizationPlan.OptimizableStats,
}

const AdvancedInput = observer(
  ({
     target$,
     stat,
  }: AdvancedInputProps) => {
    return <>
      <Label htmlFor={`${stat}-stat-advanced`}>{`${stat}: `}:</Label>
      <ReactiveInput
        id={`${stat}-stat-advanced`}
        max={100 / OptimizationPlan.statWeights[stat]}
        min={-100 / OptimizationPlan.statWeights[stat]}
        step={.01}
        type={'number'}
        $value={target$.target[stat]}
        onChange={(e) => {
          target$.target[stat].set(e.target.valueAsNumber);
        }}
      />
    </>
  }
)

const BasicInput = observer(
  ({
     target$,
     stat,
  }: AdvancedInputProps) => {
    return <>
      <Label htmlFor={`${stat}-stat-basic`}>{`${stat}: `}:</Label>
      <ReactiveSlider
              id={`${stat}-stat-basic`}
              min={-100}
              max={100}
              step={1}
              $value={target$.target[stat]}
              onChange={(weight: number) => {
                target$.target[stat].set(weight);
              }}
            />
      <ReactiveInput
        id={`${stat}-stat-basic2`}
        max={100}
        min={-100}
        step={1}
        type={'number'}
        $value={target$.target[stat]}
        onChange={(e) => {
          target$.target[stat].set(e.target.valueAsNumber);
        }}
      />
    </>
  }
)

type ComponentProps = {
  target$: ObservableOptimizationPlan,
}

const BasicForm = observer(
  ({
    target$,
  }: ComponentProps) => {
    return <div className="flex flex-wrap gap-4">
      <div>
        <BasicInput target$={target$} stat={'Health'}></BasicInput>
        <BasicInput target$={target$} stat={'Protection'}></BasicInput>
        <BasicInput target$={target$} stat={'Tenacity %'}></BasicInput>
        <BasicInput target$={target$} stat={'Armor'}></BasicInput>
        <BasicInput target$={target$} stat={'Resistance'}></BasicInput>
        <BasicInput target$={target$} stat={'Critical Avoidance %'}></BasicInput>
      </div>
      <div>
        <BasicInput target$={target$} stat={'Speed'}></BasicInput>
        <BasicInput target$={target$} stat={'Critical Chance'}></BasicInput>
        <BasicInput target$={target$} stat={'Critical Damage %'}></BasicInput>
        <BasicInput target$={target$} stat={'Potency %'}></BasicInput>
        <BasicInput target$={target$} stat={'Physical Damage'}></BasicInput>
        <BasicInput target$={target$} stat={'Special Damage'}></BasicInput>
        <BasicInput target$={target$} stat={'Accuracy %'}></BasicInput>
      </div>
    </div>;
  }
)

const AdvancedForm = observer(
  ({
    target$,
  }: ComponentProps) => {
    return <div className={'flex flex-wrap gap-4'}>
      <div>
        <AdvancedInput target$={target$} stat={'Health'}></AdvancedInput>
        <AdvancedInput target$={target$} stat={'Protection'}></AdvancedInput>
        <AdvancedInput target$={target$} stat={'Tenacity %'}></AdvancedInput>
        <AdvancedInput target$={target$} stat={'Armor'}></AdvancedInput>
        <AdvancedInput target$={target$} stat={'Resistance'}></AdvancedInput>
        <AdvancedInput target$={target$} stat={'Critical Avoidance %'}></AdvancedInput>
      </div>
      <div>
        <AdvancedInput target$={target$} stat={'Speed'}></AdvancedInput>
        <AdvancedInput target$={target$} stat={'Critical Chance'}></AdvancedInput>
        <AdvancedInput target$={target$} stat={'Critical Damage %'}></AdvancedInput>
        <AdvancedInput target$={target$} stat={'Potency %'}></AdvancedInput>
        <AdvancedInput target$={target$} stat={'Physical Damage'}></AdvancedInput>
        <AdvancedInput target$={target$} stat={'Special Damage'}></AdvancedInput>
        <AdvancedInput target$={target$} stat={'Accuracy %'}></AdvancedInput>
      </div>
    </div>;
  }
)

export const StatWeightsWidget = observer(({
  target$,
}: ComponentProps) => {
  const isInAdvancedEditMode = useRef(false);
  const isInAdvancedEditMode$ = useObservable(isInAdvancedEditMode.current);
  isInAdvancedEditMode$.onChange((value) => {
    value.value ?
      target$.target.set(OptimizationPlan.normalize(target$.target.peek()))
    :
      target$.target.set(OptimizationPlan.denormalize(target$.target.peek()));
  });

  return <div className={''} >
    <div>
      <Label className="p-r-2" htmlFor={"basic-advanced-switch"}>
        Basic
      </Label>
      <ReactiveSwitch
        $checked={isInAdvancedEditMode$}
        onCheckedChange={(checked) => {
          isInAdvancedEditMode$.set(checked);
        }}
        id={"basic-advanced-switch"}>
      </ReactiveSwitch>
      <Label className="p-l-2" htmlFor={"basic-advanced-switch"}>
        Advanced
      </Label>
    </div>
    <div className="flex flex-col flex-gap-4 justify-center p-2">
      <Switch value={isInAdvancedEditMode$}>
        {{
          false: () => <BasicForm target$={target$}></BasicForm>,
          true: () => <AdvancedForm target$={target$}></AdvancedForm>,
        }}
      </Switch>
      <Button type={"button"} onClick={() => target$.zeroAll()}>
        Zero all weights
      </Button>
    </div>
  </div>
})

StatWeightsWidget.displayName = 'StatWeightsWidget';
