// react
import React from "react";
import { Switch, observer, reactive } from "@legendapp/state/react";

// state
import { ObservableOptimizationPlan } from "#/containers/CharacterEditForm/CharacterEditForm";

// domain
import { CharacterNames } from "#/constants/characterSettings";

import { BaseCharacter } from "#/domain/BaseCharacter";
import { TargetStatsNames, targetStatsNames } from "#/domain/TargetStat";

// components
import { Button } from "#ui/button";
import { Card } from "#ui/card";
import { Input } from "#ui/input";
import { Label } from "#ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "#ui/select";
import { Switch as ShadSwitch} from "#ui/switch";
import { ToggleGroup, ToggleGroupItem } from "#ui/toggle-group";

const ReactiveInput = reactive(Input);
const ReactiveSelect = reactive(Select);
const ReactiveSwitch = reactive(ShadSwitch);
const ReactiveToggleGroup = reactive(ToggleGroup);

type ComponentProps = {
  target$: ObservableOptimizationPlan,
  id: string,
  baseCharacters: BaseCharacter[],
}

const TargetStatWidget = observer(({
  target$,
  id,
  baseCharacters,
}: ComponentProps) => {
  const targetStat$ = target$.target.targetStats.find(ts => ts.peek().id === id)!;

  return <Card className={'flex flex-col flex-gap-2 w-fit'} >
    <div className="flex justify-between py-4 px-6">
      <div className="flex justify-center p-2 ml-auto mr-auto">
        <Label className="p-r-2" htmlFor={"optimize-for-target" + id}>
          Report Only
        </Label>
        <ReactiveSwitch
          $checked={targetStat$.optimizeForTarget}
          $disabled={targetStat$.stat.get() === 'Health+Protection'}
          onCheckedChange={(checked) => {
            targetStat$.optimizeForTarget.set(checked);
          }}
          id={"optimize-for-target" + id}>
        </ReactiveSwitch>
        <Label className="p-l-2" htmlFor={"optimize-for-target" + id}>
          Optimize
        </Label>
      </div>
      <div className={"flex justify-end items-center"}>
        <Button
          className={'justify-self-stretch'}
          size={'xs'}
          type={'button'}
          variant={'destructive'}
          onClick={() => target$.removeTargetStatById(id)}
        >
          -
        </Button>
      </div>
    </div>
    <Switch value={targetStat$.relativeCharacterId}>
      {{
        null: () => <Label>
          {`The ${targetStat$.stat.get()} must be between ${targetStat$.minimum.get()} and ${targetStat$.maximum.get()}`}
        </Label>,
        default: () => <Switch value={targetStat$.type}>
          {{
            '+': () => <div className={"flex flex-col flex-gap-1"}>
              <Label>
                {`The ${targetStat$.stat.get()} must be between`}
              </Label>
              <Label>
                {
                  Intl.NumberFormat("en-US", {
                    signDisplay: "exceptZero"
                  }).format(targetStat$.minimum.get()) + ' and ' + Intl.NumberFormat("en-US", {
                    signDisplay: "exceptZero"
                  }).format(targetStat$.maximum.get()) + ' compared to the ' + targetStat$.stat.get() + ' of ' + baseCharacters.find(bc => bc.baseID === targetStat$.relativeCharacterId.get())?.name
                }
              </Label>
            </div>,
            '*': () => <div className={"flex flex-col flex-gap-1"}>
              <Label>
                {`The ${targetStat$.stat.get()} must be between`}
              </Label>
              <Label>
                {
                  targetStat$.minimum.get() + '% and ' + targetStat$.maximum.get() + '% of the  ' + targetStat$.stat.get() + ' of ' + baseCharacters.find(bc => bc.baseID === targetStat$.relativeCharacterId.get())?.name
                }
              </Label>
            </div>,
          }}
        </Switch>
      }}
    </Switch>
    <div className={"flex gap-4 justify-start items-center p-2"}>
      <div className='flex flex-col items-start gap-1'>
        <Label className="p-r-2" htmlFor={"target-stat" + id}>
          Stat:
        </Label>
        <ReactiveSelect
          $value={targetStat$.stat}
          onValueChange={value => {
            if (value === 'Health+Protection') {
              targetStat$.optimizeForTarget.set(false);
            }
            targetStat$.stat.set(value as TargetStatsNames);
          }}
        >
          <SelectTrigger><SelectValue></SelectValue></SelectTrigger>
          <SelectContent
            className={"max-h-[50%]"}
            position={"popper"}
          >
            <SelectGroup>
              {targetStatsNames.map(
                stat => <SelectItem key={stat} value={stat}>{stat}</SelectItem>
              )}
            </SelectGroup>
          </SelectContent>
        </ReactiveSelect>
      </div>
      <div className='flex flex-col gap-1'>
        <Label className="p-r-2" htmlFor={"target-stat-min" + id}>
          Minimum:
        </Label>
        <ReactiveInput
          className={'w-24'}
          id={"target-stat-min" + id}
          min={targetStat$.type.get() === '*' ? 0 : undefined}
          type={'number'}
          $value={targetStat$.minimum}
          onChange={(e: React.FormEvent<HTMLInputElement>) => {
            targetStat$.minimum.set(e.currentTarget.valueAsNumber);
          }}
        />
      </div>
      <div className='flex flex-col gap-1'>
        <Label className="p-r-2" htmlFor={"target-stat-max" + id}>
          Maximum:
        </Label>
        <ReactiveInput
          className={'w-24'}
          id={"target-stat-max" + id}
          min={targetStat$.type.get() === '*' ? 0 : undefined}
          step={'any'}
          type={'number'}
          $value={targetStat$.maximum}
          onChange={(e: React.FormEvent<HTMLInputElement>) => {
            targetStat$.maximum.set(e.currentTarget.valueAsNumber);
          }}
        />
      </div>
    </div>
    <div className={"flex gap-4 justify-start items-start p-2"}>
      <div className='flex flex-col items-start gap-1 isolate'>
        <Label className="p-r-2" htmlFor={"target-stat-relative-character" + id}>
          Compare to:
        </Label>
        <ReactiveSelect
          $value={targetStat$.relativeCharacterId}
          onValueChange={value => {
            targetStat$.relativeCharacterId.set(value as CharacterNames);
          }}
        >
          <SelectTrigger><SelectValue></SelectValue></SelectTrigger>
          <SelectContent
            className={"max-h-[50%]"}
            position={"popper"}
          >
            <SelectGroup>
            <SelectItem value={'null'}>No one</SelectItem>
            {baseCharacters.map(
              gs => <SelectItem key={gs.baseID} value={gs.baseID}>{gs.name}</SelectItem>
            )}
            </SelectGroup>
          </SelectContent>
        </ReactiveSelect>
      </div>
      <div className='flex flex-col items-start justify-center gap-1'>
        <Label className="p-r-2" htmlFor={"target-stat-type" + id}>
          Using:
        </Label>
        <ReactiveToggleGroup
          className={'h-4 gap-0 border-1 border-gray-300 dark:border-gray-700 rounded-2xl'}
          orientation={'horizontal'}
          size={'sm'}
          type={'single'}
          variant={'outline'}
          $value={targetStat$.type}
          onValueChange={(value: '+' | '*') => {
            targetStat$.type.set(value);
            if (value === '*') {
              if (targetStat$.minimum.get() < 0) {
                targetStat$.minimum.set(0);
              }
              if (targetStat$.maximum.get() < 0) {
                targetStat$.maximum.set(0);
              }
            }
          }}
        >
          <ToggleGroupItem
            className={"h-4"}
            value={'+'}
          >
            +
          </ToggleGroupItem>
          <ToggleGroupItem
            className={"h-4"}
            value={'*'}
          >
            *
          </ToggleGroupItem>
        </ReactiveToggleGroup>
      </div>
    </div>
  </Card>
})

TargetStatWidget.displayName = 'TargetStatWidget';

export { TargetStatWidget };
// {baseCharacters.find(bc => bc.baseID === targetStat$.relativeCharacterId.get())?.name}