// react
// biome-ignore lint/style/useImportType: <explanation>
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { ThunkDispatch } from "#/state/reducers/modsOptimizer";
import { observer, reactive, useObservable } from "@legendapp/state/react";

// utils
import areObjectsEquivalent from "#/utils/areObjectsEquivalent";

// state
import { type ObservableObject, beginBatch, endBatch } from "@legendapp/state";

import { incrementalOptimization$ } from "#/modules/incrementalOptimization/state/incrementalOptimization";
import { isBusy$ } from "#/modules/busyIndication/state/isBusy";
import { optimizerView$ } from "#/modules/optimizerView/state/optimizerView";
import { profilesManagement$ } from "#/modules/profilesManagement/state/profilesManagement";

// modules
import { CharacterEdit } from "#/state/modules/characterEdit";
import { Data } from "#/state/modules/data";
import { Optimize } from "#/state/modules/optimize";
import { Storage } from "#/state/modules/storage";

// domain
import { characterSettings } from "#/constants/characterSettings";
import setBonuses from "#/constants/setbonuses";

import type * as Character from "#/domain/Character";
import type { CharacterSettings } from "#/domain/CharacterSettings";
import * as OptimizationPlan from "#/domain/OptimizationPlan";
import type { ModSuggestion } from "#/domain/PlayerProfile";
import type { SetStats } from "#/domain/Stats";
import { type TargetStat, createTargetStat } from "#/domain/TargetStat";

// components
import { CharacterAvatar } from "#/components/CharacterAvatar/CharacterAvatar";
import { OptimizerProgress } from '#/components/OptimizerProgress/OptimizerProgress';
import { SetRestrictionsWidget } from "#/components/SetRestrictionsWidget/SetRestrictionsWidget";
import { StatWeightsWidget } from "#/components/StatWeightsWidget/StatWeightsWidget";
import { TargetStatsWidget } from "#/components/TargetStatsWidget/TargetStatsWidget";
import { PrimaryStatRestrictionsWidget } from "#/components/PrimaryStatRestrictionsWidget/PrimaryStatRestrictionsWidget";
import { Button } from "#ui/button";
import { Input } from "#ui/input";
import { Label } from "#ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#ui/tabs-vertical";

type ObservableOptimizationPlan = ObservableObject<{
  target: OptimizationPlan.OptimizationPlan,
  addSetBonus: (setName: SetStats.GIMOStatNames) => void,
  addTargetStat: () => void,
  removeSetBonus: (setName: SetStats.GIMOStatNames) => void,
  removeTargetStatById: (id: string) => void,
  zeroAll: () => void,
}>
export type { ObservableOptimizationPlan };

const ReactiveInput = reactive(Input);
const ReactiveSelect = reactive(Select);

type ComponentProps = {
  character: Character.Character,
  target: OptimizationPlan.OptimizationPlan,
}

const CharacterEditForm = observer(({
  character,
  target,
}: ComponentProps) => {
  const dispatch: ThunkDispatch = useDispatch();
  const allycode = profilesManagement$.profiles.activeAllycode.get()
  const baseCharacters = useSelector(Data.selectors.selectBaseCharacters);
  const editMode = useSelector(CharacterEdit.selectors.selectCharacterEditMode);
  const progress = useSelector(Optimize.selectors.selectProgress);
  const modAssignments = useSelector(Storage.selectors.selectModAssignmentsInActiveProfile);

  const cloneCharacter = () => structuredClone(character);
  const cloneOptimizationPlan = () => structuredClone(target);

  let character$: ObservableObject<{character: Character.Character}> = useObservable({
    character: cloneCharacter(),
  });
  let target$: ObservableOptimizationPlan = useObservable({
    target: cloneOptimizationPlan(),
    addSetBonus: (setName: SetStats.GIMOStatNames) => {
      let restrictions = target$.target.setRestrictions.peek();
      let newRestrictions = setName in restrictions ?
        {...restrictions, [setName]: restrictions[setName]!+1} // TODO: Use hasRestrictionOn typeguard when ts 5.5 is released
      :
        {...restrictions, [setName]: 1};
      const newRestrictionsKVs = Object.entries(newRestrictions) as [SetStats.GIMOStatNames, number][];
      const requiredSlots = newRestrictionsKVs.reduce((acc, [setName, count]: [SetStats.GIMOStatNames, number]) =>
        acc + setBonuses[setName].numberOfModsRequired * count, 0);
      if (requiredSlots <= 6) {
        target$.target.setRestrictions.set(newRestrictions);
      }
    },
    addTargetStat: () => {
      target$.target.targetStats.push(createTargetStat('Speed'));
    },
    removeSetBonus: (setName: SetStats.GIMOStatNames) => {
      let restrictions = target$.target.setRestrictions.peek();
      if (restrictions[setName] !== undefined) {
        if (restrictions[setName]! > 0) { // TODO: Use hasRestrictionOn typeguard when ts 5.5 is released
          target$.target.setRestrictions[setName].set(restrictions[setName]! -1); // TODO: Use hasRestrictionOn typeguard when ts 5.5 is released
        } else {
          target$.target.setRestrictions[setName].delete();
        }
      }
    },
    removeTargetStatById: (id: string) => {
      let index = target$.target.targetStats.peek().findIndex((ts: TargetStat) => ts.id === id);
      if (index !== -1) {
        target$.target.targetStats.splice(index, 1);
      }
    },
    zeroAll: () => {
      beginBatch();
      target$.target["Health"].set(0);
      target$.target["Protection"].set(0);
      target$.target["Speed"].set(0);
      target$.target["Critical Damage %"].set(0);
      target$.target["Potency %"].set(0);
      target$.target["Tenacity %"].set(0);
      target$.target["Physical Damage"].set(0);
      target$.target["Special Damage"].set(0);
      target$.target["Critical Chance"].set(0);
      target$.target["Armor"].set(0);
      target$.target["Resistance"].set(0);
      target$.target["Accuracy %"].set(0);
      target$.target["Critical Avoidance %"].set(0);
      endBatch();
    }
  });

  useEffect(() => {
    const characterDispose = character$.onChange(
      value => console.log("character$ changed to", value ?? typeof value)
    );
    const dispose = target$.onChange(
      value => console.log("target$ changed to", value ?? typeof value)
    );
    console.log('character$ and target$ listeners added');
    character$.character.set(cloneCharacter());
    target$.target.set(cloneOptimizationPlan());
    return () => {
      character$.character.set(cloneCharacter());
      target$.target.set(cloneOptimizationPlan());
      characterDispose();
      console.log('character$ listener removed');
      dispose();
      console.log('target$ listener removed');
    }
  }, []);

  const missedGoalsSection = (modAssignments: ModSuggestion | null) => {
    if ((target$.target.targetStats.peek() || []).length === 0) {
      return;
    }

    const resultsInner = (() => {
      if (!areObjectsEquivalent(progress, {})) {
        return <OptimizerProgress />;
      }

      const rerunButton = (
        <div className={'actions'}>
          <Button
            type={'button'}
            onClick={() => runIncrementalCalc()}
          >
            Run Incremental Optimization
          </Button>
        </div>
      );

      if (modAssignments === null) {
        return (
          <div id={'missed-form'}>
            <div className={'form-row'}>
              <span>No optimization data yet!</span>
            </div>
            {rerunButton}
          </div>
        )
      }

      const missedGoals = modAssignments.missedGoals;

      if (missedGoals.length === 0) {
        return (
          <div id={'missed-form'}>
            <div className={'form-row'}>
              <span>No missed targets from last run</span>
            </div>
            {rerunButton}
          </div>
      );
    }

    const targetStatRows = missedGoals.map(([targetStat, resultValue]: [t: TargetStat, r: number], index: number) =>
      <div className={'form-row'} key={index}>
        <span>{targetStat.stat}</span>
        <span>({targetStat.minimum})-({targetStat.maximum})</span>
        <span>{targetStat.minimum ?? 0 > resultValue ? " ↓ " : " ↑ "}</span>
        <span>{resultValue}</span>
      </div>
    );
      <div id={'missed-form'}>
        {targetStatRows}
        {rerunButton}
      </div>
  })();

  return <div className={'incremental-optimization'}>
      <div className={'title'}>Incremental Optimization</div>
      <hr />
      <div className={'content'}>
        {resultsInner}
      </div>
    </div>
  }

  const runIncrementalCalc = () => {
    saveTarget();
    isBusy$.set(true);
    dispatch(Optimize.thunks.optimizeMods());
  }

  const saveTarget = () => {
    const isBasic = 'basic' === editMode;
    let newTarget: OptimizationPlan.OptimizationPlan = target$.target.peek();
    if (!isBasic) newTarget = OptimizationPlan.denormalize(newTarget);
    const char = character$.character.peek();

    dispatch(CharacterEdit.thunks.changeMinimumModDots(char.baseID, char.optimizerSettings.minimumModDots));
    dispatch(CharacterEdit.thunks.unlockCharacter(char.baseID));
    dispatch(CharacterEdit.thunks.finishEditCharacterTarget(char.baseID, newTarget));
  }

  const defaultTarget = characterSettings[character.baseID] ?
  (characterSettings[character.baseID] as CharacterSettings).targets.find(defaultTarget => defaultTarget.name === target.name) :
  null;

  let resetButton;

  if ('custom' === target.name) {
    resetButton = null;
  } else if (defaultTarget) {
    resetButton =
    <Button
      type={'button'}
      id={'reset-button'}
      disabled={OptimizationPlan.equals(defaultTarget, target)}
      onClick={() => {
        dispatch(CharacterEdit.thunks.resetCharacterTargetToDefault(character.baseID, target.name));
      }}>
      Reset target to default
    </Button>
  } else {
    resetButton =
    <Button
      type={'button'}
      id={'delete-button'}
      variant={'destructive'}
      onClick={() => dispatch(CharacterEdit.thunks.deleteTarget(character.baseID, target.name))}>
      Delete target
    </Button>
  }

  return (

    // Determine whether the current optimization plan is a default (same name exists), user-defined (same name doesn't
    // exist), or custom (name is 'custom') This determines whether to display a "Reset target to default" button, a
    // "Delete target" button, or nothing.

    <form
      className={"character-edit-form w-full flex flex-col flex-gap-2 items-stretch justify-center p-8"}
      noValidate={'advanced' === editMode}
      onSubmit={(e) => {
        e.preventDefault();
        saveTarget();
        incrementalOptimization$.indicesByProfile[allycode].set(null);
        optimizerView$.view.set('basic');
      }}
    >
      <div className={"flex flex-gap-4 justify-around"}>
        <div className={'flex flex-gap-2 items-center'}>
          <CharacterAvatar character={character} />
          <Label>
            {baseCharacters[character.baseID] ? baseCharacters[character.baseID].name : character.baseID}
          </Label>
        </div>
        <div className={'flex gap-2 justify-center items-center'}>
          <div className={'actions p-2 flex gap-2 justify-center'}>
            {resetButton}
            <Button
              type={'button'}
              onClick={() => optimizerView$.view.set("basic")} // dialog$.hide()}
            >
              Cancel
            </Button>
            <Button type={'submit'}>Save</Button>
          </div>
          <Label htmlFor={'plan-name'}>Target Name: </Label>
          <ReactiveInput
            className={'w-fit'}
            id={'plan-name'}
            type={'text'}
            $value={target$.target.name}
            onChange={(e: React.FormEvent<HTMLInputElement>) => {
              target$.target.name.set(e.currentTarget.value);
            }}
          />
        </div>
      </div>
      <Tabs
        className="h-full w-full"
        defaultValue="Mods"
        orientation={'vertical'}
      >
        <TabsList>
          <TabsTrigger value="Mods">Mods</TabsTrigger>
          <TabsTrigger value="Weights">Weights</TabsTrigger>
          <TabsTrigger value="Primaries">Primaries</TabsTrigger>
          <TabsTrigger value="Sets">Sets</TabsTrigger>
          <TabsTrigger value="Stat Targets">Target Stats</TabsTrigger>
        </TabsList>
        <TabsContent value="Mods">
          <div className={"flex flex-col flex-gap-4"}>
            <h3>Character-level options</h3>
            <div>
              <Label htmlFor='mod-dots' id={'mod-dots-label'}>
                Use only mods with at least&nbsp;
                <span>
                  <ReactiveSelect
                    name={'mod-dots'}
                    $value={() => character$.character.optimizerSettings.minimumModDots.get().toString()}
                    onValueChange={(value) => {
                      character$.character.optimizerSettings.minimumModDots.set(parseInt(value));
                    }}
                  >
                    <SelectTrigger className={"w-12 h-4 px-2 mx-2 inline-flex"} id={'mod-dots2'}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className={"w-8 min-w-12"} position={"popper"} sideOffset={5}>
                      {[1, 2, 3, 4, 5, 6].map(dots => <SelectItem className={"w-8"} key={dots} value={dots.toString()}>{dots}</SelectItem>)}
                    </SelectContent>
                  </ReactiveSelect>
                </span>
                &nbsp;dot(s)
              </Label>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="Weights">
          <div>
            <StatWeightsWidget target$={target$} />
            {missedGoalsSection(
              modAssignments.find((modAssignment: ModSuggestion) => modAssignment.id === character.baseID) ?? null
            )}
          </div>
        </TabsContent>
        <TabsContent value="Primaries">
          <PrimaryStatRestrictionsWidget primaryRestrictions$={target$.target.primaryStatRestrictions}></PrimaryStatRestrictionsWidget>
        </TabsContent>
        <TabsContent value="Sets">
          <SetRestrictionsWidget target$={target$}/>
        </TabsContent>
        <TabsContent value="Stat Targets">
          <TargetStatsWidget target$={target$} />
        </TabsContent>
      </Tabs>
    </form>
  );
});

CharacterEditForm.displayName = 'CharacterEditForm';

export { CharacterEditForm };
