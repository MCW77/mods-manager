// react
import React from "react"

// state
import { observer, reactive } from "@legendapp/state/react";
import { ObservableObject } from "@legendapp/state";

// domain
import { PrimaryStatRestrictions } from "#/domain/OptimizationPlan";
import { PrimaryStats } from "#/domain/Stats";

// components
import { ToggleGroup, ToggleGroupItem } from "#ui/toggle-group";

const ReactiveToggleGroup = reactive(ToggleGroup);

type ComponentProps = {
  primaryRestrictions$: ObservableObject<PrimaryStatRestrictions>,
}

const PrimaryStatRestrictionsWidget = observer(({
  primaryRestrictions$,
}: ComponentProps) => {
  return <div className="grid gap-4">
    <div className={''}>
      <h1>Restrict Primary Stats:</h1>
    </div>
    <div className={'flex flex-col gap-4 p-2'}>
      <div>
        <div className={`
          w-[4em] h-[4em]
          bg-[url(/img/mod-shape-atlas.png)]
          bg-[length:48em_20em] [background-position-x:-4em]
        `} />
        <ReactiveToggleGroup
          className={'h-6 gap-1 border-1 border-gray-300 dark:border-gray-700 rounded-2xl'}
          orientation={'horizontal'}
          size={'sm'}
          type={'single'}
          $value={() => primaryRestrictions$['arrow'].get() ?? ''}
          onValueChange={(value) => {
            if (value === '')
              primaryRestrictions$['arrow'].delete()
            else
              primaryRestrictions$['arrow'].set(value as PrimaryStats.GIMOStatNames);
          }}      >
          <ToggleGroupItem
            className={"h-4"}
            value={'Protection %'}
          >
            Protection
          </ToggleGroupItem>
          <ToggleGroupItem
            className={"h-4"}
            value={'Health %'}
          >
            Health
          </ToggleGroupItem>
          <ToggleGroupItem
            className={"h-4"}
            value={'Offense %'}
          >
            Offense
          </ToggleGroupItem>
          <ToggleGroupItem
            className={"h-4"}
            value={'Defense %'}
          >
            Defense
          </ToggleGroupItem>
          <ToggleGroupItem
            className={"h-4"}
            value={'Speed'}
          >
            Speed
          </ToggleGroupItem>
          <ToggleGroupItem
            className={"h-4"}
            value={'Accuracy %'}
          >
            Accuracy
          </ToggleGroupItem>
          <ToggleGroupItem
            className={"h-4"}
            value={'Critical Avoidance %'}
          >
            Critical Avoidance
          </ToggleGroupItem>
        </ReactiveToggleGroup>
      </div>
      <div>
        <div className={`
          w-[4em] h-[4em]
          bg-[url(/img/mod-shape-atlas.png)]
          bg-[length:48em_20em] [background-position-x:-12em]
        `} />
        <ReactiveToggleGroup
          className={'h-6 gap-1 border-1 border-gray-300 dark:border-gray-700 rounded-2xl'}
          orientation={'horizontal'}
          size={'sm'}
          type={'single'}
          $value={() => primaryRestrictions$['triangle'].get() ?? ''}
          onValueChange={(value) => {
            if (value === '')
              primaryRestrictions$['triangle'].delete()
            else
              primaryRestrictions$['triangle'].set(value as PrimaryStats.GIMOStatNames);
          }}      >
          <ToggleGroupItem
            className={"h-4"}
            value={'Protection %'}
          >
            Protection
          </ToggleGroupItem>
          <ToggleGroupItem
            className={"h-4"}
            value={'Health %'}
          >
            Health
          </ToggleGroupItem>
          <ToggleGroupItem
            className={"h-4"}
            value={'Offense %'}
          >
            Offense
          </ToggleGroupItem>
          <ToggleGroupItem
            className={"h-4"}
            value={'Defense %'}
          >
            Defense
          </ToggleGroupItem>
          <ToggleGroupItem
            className={"h-4"}
            value={'Critical Chance %'}
          >
            Critical Chance
          </ToggleGroupItem>
          <ToggleGroupItem
            className={"h-4"}
            value={'Critical Damage %'}
          >
            Critical Damage
          </ToggleGroupItem>
        </ReactiveToggleGroup>
      </div>
      <div>
        <div className={`
            left-[17px]
            w-[4em] h-[4em]
            bg-[url(/img/mod-shape-atlas.png)]
            bg-[length:48em_20em]
            [background-position-x:-20em]
          `}
        />
        <ReactiveToggleGroup
          className={'h-4 gap-0 border-1 border-gray-300 dark:border-gray-700 rounded-2xl'}
          orientation={'horizontal'}
          size={'sm'}
          type={'single'}
          $value={() => primaryRestrictions$['cross'].get() ?? ''}
          onValueChange={(value) => {
            if (value === '')
              primaryRestrictions$['cross'].delete()
            else
              primaryRestrictions$['cross'].set(value as PrimaryStats.GIMOStatNames);
          }}      >
          <ToggleGroupItem
            className={"h-4"}
            value={'Protection %'}
          >
            Protection
          </ToggleGroupItem>
          <ToggleGroupItem
            className={"h-4"}
            value={'Health %'}
          >
            Health
          </ToggleGroupItem>
          <ToggleGroupItem
            className={"h-4"}
            value={'Offense %'}
          >
            Offense
          </ToggleGroupItem>
          <ToggleGroupItem
            className={"h-4"}
            value={'Defense %'}
          >
            Defense
          </ToggleGroupItem>
          <ToggleGroupItem
            className={"h-4"}
            value={'Potency %'}
          >
            Potency
          </ToggleGroupItem>
          <ToggleGroupItem
            className={"h-4"}
            value={'Tenacity %'}
          >
            Tenacity
          </ToggleGroupItem>
        </ReactiveToggleGroup>
      </div>
      <div>
        <div className={`
            left-[17px]
            w-[4em] h-[4em]
            bg-[url(/img/mod-shape-atlas.png)]
            bg-[length:48em_20em]
            [background-position-x:-16em]
          `}
        />
        <ReactiveToggleGroup
          className={'h-4 gap-0 border-1 border-gray-300 dark:border-gray-700 rounded-2xl'}
          orientation={'horizontal'}
          size={'sm'}
          type={'single'}
          $value={() => primaryRestrictions$['circle'].get() ?? ''}
          onValueChange={(value) => {
            if (value === '')
              primaryRestrictions$['circle'].delete()
            else
              primaryRestrictions$['circle'].set(value as PrimaryStats.GIMOStatNames);
          }}      >
          <ToggleGroupItem
            className={"h-4"}
            value={'Protection %'}
          >
            Protection
          </ToggleGroupItem>
          <ToggleGroupItem
            className={"h-4"}
            value={'Health %'}
          >
            Health
          </ToggleGroupItem>
        </ReactiveToggleGroup>
      </div>
    </div>
  </div>
});

PrimaryStatRestrictionsWidget.displayName = 'PrimaryStatRestrictionsWidget';

export { PrimaryStatRestrictionsWidget };