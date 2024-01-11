// react
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "../../state/reducers/modsOptimizer";

// styles
import "./CharacterEditForm.css";

// utils
import areObjectsEquivalent from '../../utils/areObjectsEquivalent';

// modules
import { App } from '../../state/modules/app';
import { CharacterEdit } from '../../state/modules/characterEdit';
import { Data } from '../../state/modules/data';
import { Optimize } from '../../state/modules/optimize';
import { Storage } from '../../state/modules/storage';

// domain
import { characterSettings } from "../../constants/characterSettings";
import type * as ModTypes from "../../domain/types/ModTypes";

import { BaseCharacter } from "../../domain/BaseCharacter";
import { Character } from "../../domain/Character";
import { CharacterEditMode } from "../../domain/CharacterEditMode";
import { CharacterSettings } from "../../domain/CharacterSettings";
import { Mod } from "../../domain/Mod";
import { OptimizationPlan, PrimaryStatRestrictions } from "../../domain/OptimizationPlan";
import { IModSuggestion } from "../../domain/PlayerProfile";
import { TargetStat, TargetStatEntry, TargetStats } from "../../domain/TargetStat";

// components
import { CharacterAvatar } from "../../components/CharacterAvatar/CharacterAvatar";
import { Dropdown } from "../../components/Dropdown/Dropdown";
import { OptimizerProgress } from '../../components/OptimizerProgress/OptimizerProgress';
import { RangeInput } from "../../components/RangeInput/RangeInput";
import { SetRestrictionsWidget } from "../../components/SetRestrictionsWidget/SetRestrictionsWidget";
import { Toggle, Toggle2 } from "../../components/Toggle/Toggle";
import { Button } from "#ui/button";
import { Input } from "#ui/input";
import { Label } from "#ui/label";


type ComponentProps = {
  character: Character,
  characterIndex: number,
  target: OptimizationPlan,
}

const CharacterEditForm = ({
  character,
  characterIndex,
  target,
}: ComponentProps) => {
  const dispatch: ThunkDispatch = useDispatch();
  const form = useRef<HTMLFormElement>(null);
  const targetStatsShouldOptimize = useRef<Toggle[]>([]);
  const baseCharacters = useSelector(Data.selectors.selectBaseCharacters);
  const mods = useSelector(Storage.selectors.selectModsInActiveProfile)
  const editMode = useSelector(CharacterEdit.selectors.selectCharacterEditMode);
  const setRestrictions = useSelector(CharacterEdit.selectors.selectSetRestrictions);
  const targetStats = useSelector(CharacterEdit.selectors.selectTargetStats);
  const progress = useSelector(Optimize.selectors.selectProgress);
  const modAssignments = useSelector(Storage.selectors.selectModAssignmentsInActiveProfile);

  useEffect(() => {
    dispatch(CharacterEdit.actions.changeSetRestrictions(target.setRestrictions));
    dispatch(CharacterEdit.actions.changeTargetStats(target.targetStats));
  }, []);

  /**
   * Renders a form element for managing a target stat
   *
   * @param targetStats {Array<TargetStat>}
   * @returns {*}
   */
   const targetStatForm = (targetStats: TargetStats) => {
    const baseCharacters2 = Object.values(baseCharacters).slice(0) as BaseCharacter[];
    baseCharacters2.sort((a, b) => a.name.localeCompare(b.name))

    const targetStatRows = targetStats.map((targetStat: TargetStatEntry, index: number) => {
      return <div className={'form-row center'} key={targetStat.key}>
        <Toggle
          ref={(tog) => {
            if (tog) {
              targetStatsShouldOptimize.current[index] = tog
            }
          }}
          inputLabel={'Target Stat Type'}
          name={'optimize-for-target[]'}
          leftLabel={'Optimize'}
          leftValue={'true'}
          rightLabel={'Report Only'}
          rightValue={'false'}
          value={`${targetStat.target.optimizeForTarget}`}
          disabled={targetStat.target.stat === 'Health+Protection'}
        />
        <Button
          type={'button'}
          size={'sm'}
          variant={'destructive'}
          className={''}
          onClick={() => dispatch(CharacterEdit.actions.removeTargetStat(index))}
        >
          -
        </Button>
        <span className={'dropdown'}>
          <select name={'target-stat-name[]'} defaultValue={targetStat.target.stat}
            onChange={event => {
              if (targetStatsShouldOptimize.current[index] !== null) {
                if (event.target.value === 'Health+Protection') {
                  targetStatsShouldOptimize.current[index].updateValue('false');
                  targetStatsShouldOptimize.current[index].disable();
                } else {
                  targetStatsShouldOptimize.current[index].enable();
                }
              }
            }}
          >
            {TargetStat.possibleTargetStats.map(stat => <option key={stat} value={stat}>{stat}</option>)}
          </select>
        </span>
        &nbsp; must be between &nbsp;
        <input
          type={'number'}
          step={'any'}
          name={'target-stat-min[]'}
          defaultValue={targetStat.target.minimum} />
          &nbsp; and &nbsp;
        <input
          type={'number'}
          step={'any'}
          name={'target-stat-max[]'}
          defaultValue={targetStat.target.maximum} />
        <br />
          compared to &nbsp;
        <span className={'dropdown'}>
          <select name={'target-stat-relative-character[]'} defaultValue={targetStat.target.relativeCharacterId !== 'null' ? targetStat.target.relativeCharacterId : ''}>
            <option value={''}>No one</option>
            {baseCharacters2.map(
              gs => <option key={gs.baseID} value={gs.baseID}>{gs.name}</option>
            )}
          </select>
        </span>
        &nbsp; using &nbsp;
        <span className={'dropdown'}>
          <select name={'target-stat-type[]'} defaultValue={targetStat.target.type || '+'}>
            <option value='+'>+/-</option>
            <option value='%'>%</option>
          </select>
        </span>
      </div>
    }
    );

    return <div>
      <h4>Set Target Stats:</h4>
      <p><em>Note that adding target stats makes the optimizer take a <strong>LONG</strong> time to complete.</em></p>
      <p>
        Setting any Target Stat will make the optimizer assume that all mods are being leveled to 15 for this character.
      </p>
      {targetStatRows}
      <div className={'form-row center'}>
        <Button
          type={'button'}
          size={'sm'}
          onClick={() => dispatch(CharacterEdit.actions.addTargetStat(new TargetStat('Speed')))}
        >
          +
        </Button>
      </div>
    </div>;
  }

  /**
   * Renders a form for stat weights that uses range inputs between -100 and 100
   *
   * @param optimizationPlan OptimizationPlan The OptimizationPlan that contains the default values to display
   */
   const basicForm = (optimizationPlan: OptimizationPlan) => {
    return <div id={'basic-form'}>
      <div className={'form-row'}>
        <label htmlFor="health-stat">Health:</label>
        <RangeInput
          editable={true}
          id={'health-stat'}
          name={'health-stat'}
          defaultValue={optimizationPlan.rawHealth}
          min={-100}
          max={100}
        />
      </div>
      <div className={'form-row'}>
        <label htmlFor="protection-stat">Protection:</label>
        <RangeInput
          editable={true}
          id={'protection-stat'}
          name={'protection-stat'}
          defaultValue={optimizationPlan.rawProtection}
          min={-100}
          max={100}
        />
      </div>
      <div className={'form-row'}>
        <label htmlFor="speed-stat">Speed:</label>
        <RangeInput
          editable={true}
          id={'speed-stat'}
          name={'speed-stat'}
          defaultValue={optimizationPlan.rawSpeed}
          min={-100}
          max={100}
        />
      </div>
      <div className={'form-row'}>
        <label htmlFor="critChance-stat">Critical Chance %:</label>
        <RangeInput
          editable={true}
          id={'critChance-stat'}
          name={'critChance-stat'}
          defaultValue={optimizationPlan.rawCritChance}
          min={-100}
          max={100}
        />
      </div>
      <div className={'form-row'}>
        <label htmlFor="critDmg-stat">Critical Damage %:</label>
        <RangeInput
          editable={true}
          id={'critDmg-stat'}
          name={'critDmg-stat'}
          defaultValue={optimizationPlan.rawCritDmg}
          min={-100}
          max={100}
        />
      </div>
      <div className={'form-row'}>
        <label htmlFor="potency-stat">Potency %:</label>
        <RangeInput
          editable={true}
          id={'potency-stat'}
          name={'potency-stat'}
          defaultValue={optimizationPlan.rawPotency}
          min={-100}
          max={100}
        />
      </div>
      <div className={'form-row'}>
        <label htmlFor="tenacity-stat">Tenacity %:</label>
        <RangeInput
          editable={true}
          id={'tenacity-stat'}
          name={'tenacity-stat'}
          defaultValue={optimizationPlan.rawTenacity}
          min={-100}
          max={100}
        />
      </div>
      <div className={'form-row'}>
        <label htmlFor="physDmg-stat">Physical Damage:</label>
        <RangeInput
          editable={true}
          id={'physDmg-stat'}
          name={'physDmg-stat'}
          defaultValue={optimizationPlan.rawPhysDmg}
          min={-100}
          max={100}
        />
      </div>
      <div className={'form-row'}>
        <label htmlFor="specDmg-stat">Special Damage:</label>
        <RangeInput
          editable={true}
          id={'specDmg-stat'}
          name={'specDmg-stat'}
          defaultValue={optimizationPlan.rawSpecDmg}
          min={-100}
          max={100}
        />
      </div>
      <div className={'form-row'}>
        <label htmlFor={'defense-stat'}>Defense:</label>
        <RangeInput
          editable={true}
          id={'defense-stat'}
          name={'defense-stat'}
          defaultValue={optimizationPlan.rawArmor + optimizationPlan.rawResistance}
          min={-100}
          max={100}
        />
      </div>
      <div className={'form-row'}>
        <label htmlFor="accuracy-stat">Accuracy:</label>
        <RangeInput
          editable={true}
          id={'accuracy-stat'}
          name={'accuracy-stat'}
          defaultValue={optimizationPlan.rawAccuracy}
          min={-100}
          max={100}
        />
      </div>
      <div className={'form-row'}>
        <label htmlFor="critAvoid-stat">Critical Avoidance:</label>
        <RangeInput
          editable={true}
          id={'critAvoid-stat'}
          name={'critAvoid-stat'}
          defaultValue={optimizationPlan.rawCritAvoid}
          min={-100}
          max={100}
        />
      </div>
    </div>;
  }

  /**
   * Renders a form for stat weights that allows for granular control over weights
   *
   * @param optimizationPlan OptimizationPlan The OptimizationPlan that contains the default values to display
   */
  const advancedForm = (optimizationPlan: OptimizationPlan) => {
    return <div id={'advanced-form'}>
      <div className={'form-row'}>
        <label htmlFor="health-stat-advanced">Health:</label>
        <input
          id={'health-stat-advanced'}
          name={'health-stat-advanced'}
          type={'number'}
          step={.01}
          defaultValue={optimizationPlan.Health}
        />
      </div>
      <div className={'form-row'}>
        <label htmlFor="protection-stat-advanced">Protection:</label>
        <input
          id={'protection-stat-advanced'}
          name={'protection-stat-advanced'}
          type={'number'}
          step={.01}
          defaultValue={optimizationPlan.Protection}
        />
      </div>
      <div className={'form-row'}>
        <label htmlFor="speed-stat-advanced">Speed:</label>
        <input
          id={'speed-stat-advanced'}
          name={'speed-stat-advanced'}
          type={'number'}
          step={.01}
          defaultValue={optimizationPlan.Speed}
        />
      </div>
      <div className={'form-row'}>
        <label htmlFor="critChance-stat-advanced">Critical Chance %:</label>
        <input
          id={'critChance-stat-advanced'}
          name={'critChance-stat-advanced'}
          type={'number'}
          step={.01}
          defaultValue={optimizationPlan['Critical Chance']}
        />
      </div>
      <div className={'form-row'}>
        <label htmlFor="critDmg-stat-advanced">Critical Damage %:</label>
        <input
          id={'critDmg-stat-advanced'}
          name={'critDmg-stat-advanced'}
          type={'number'}
          step={.01}
          defaultValue={optimizationPlan['Critical Damage %']}
        />
      </div>
      <div className={'form-row'}>
        <label htmlFor="potency-stat-advanced">Potency %:</label>
        <input
          id={'potency-stat-advanced'}
          name={'potency-stat-advanced'}
          type={'number'}
          step={.01}
          defaultValue={optimizationPlan['Potency %']}
        />
      </div>
      <div className={'form-row'}>
        <label htmlFor="tenacity-stat-advanced">Tenacity %:</label>
        <input
          id={'tenacity-stat-advanced'}
          name={'tenacity-stat-advanced'}
          type={'number'}
          step={.01}
          defaultValue={optimizationPlan['Tenacity %']}
        />
      </div>
      <div className={'form-row'}>
        <label htmlFor="physDmg-stat-advanced">Physical Damage:</label>
        <input
          id={'physDmg-stat-advanced'}
          name={'physDmg-stat-advanced'}
          type={'number'}
          step={.01}
          defaultValue={optimizationPlan['Physical Damage']}
        />
      </div>
      <div className={'form-row'}>
        <label htmlFor="specDmg-stat-advanced">Special Damage:</label>
        <input
          id={'specDmg-stat-advanced'}
          name={'specDmg-stat-advanced'}
          type={'number'}
          step={.01}
          defaultValue={optimizationPlan['Special Damage']}
        />
      </div>
      <div className={'form-row'}>
        <label htmlFor="armor-stat-advanced">Armor:</label>
        <input
          id={'armor-stat-advanced'}
          name={'armor-stat-advanced'}
          type={'number'}
          step={.01}
          defaultValue={optimizationPlan.Armor}
        />
      </div>
      <div className={'form-row'}>
        <label htmlFor="resistance-stat-advanced">Resistance:</label>
        <input
          id={'resistance-stat-advanced'}
          name={'resistance-stat-advanced'}
          type={'number'}
          step={.01}
          defaultValue={optimizationPlan.Resistance}
        />
      </div>
      <div className={'form-row'}>
        <label htmlFor="accuracy-stat-advanced">Accuracy:</label>
        <input
          id={'accuracy-stat-advanced'}
          name={'accuracy-stat-advanced'}
          type={'number'}
          step={.01}
          defaultValue={optimizationPlan['Accuracy %']}
        />
      </div>
      <div className={'form-row'}>
        <label htmlFor="critAvoid-stat-advanced">Critical Avoidance:</label>
        <input
          id={'critAvoid-stat-advanced'}
          name={'critAvoid-stat-advanced'}
          type={'number'}
          step={.01}
          defaultValue={optimizationPlan['Critical Avoidance %']}
        />
      </div>
    </div>;
  }

  const missedGoalsSection = (modAssignments: IModSuggestion | null) => {
    if ((targetStats || []).length === 0) {
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
    dispatch(Optimize.thunks.optimizeMods());
  }

  const saveTarget = () => {
    const form2 = form.current!;
    const planName = 'lock' !== form2['plan-name'].value ? form2['plan-name'].value : 'custom';
    let newTarget;
    let primaryStatRestrictions: PrimaryStatRestrictions = {} as PrimaryStatRestrictions;
    const targetStats = [];
    if (form2['target-stat-name[]']) {
      const targetStatNames = form2['target-stat-name[]'] instanceof NodeList ?
        form2['target-stat-name[]'] :
        [form2['target-stat-name[]']];
      const targetStatMins = form2['target-stat-min[]'] instanceof NodeList ?
        form2['target-stat-min[]'] :
        [form2['target-stat-min[]']];
      const targetStatMaxes = form2['target-stat-max[]'] instanceof NodeList ?
        form2['target-stat-max[]'] :
        [form2['target-stat-max[]']];
      const targetStatRelativeCharacters = form2['target-stat-relative-character[]'] instanceof NodeList ?
        form2['target-stat-relative-character[]'] :
        [form2['target-stat-relative-character[]']];
      const targetStatTypes = form2['target-stat-type[]'] instanceof NodeList ?
        form2['target-stat-type[]'] :
        [form2['target-stat-type[]']];

      for (let i = 0; i < targetStatNames.length; i++) {
        const name = targetStatNames[i].value;
        const minimum = isNaN(targetStatMins[i].valueAsNumber) ? 0 : targetStatMins[i].valueAsNumber;
        const maximum = isNaN(targetStatMaxes[i].valueAsNumber) ? 100000000 : targetStatMaxes[i].valueAsNumber;
        const relativeCharacter = targetStatRelativeCharacters[i].value || null;
        const type = targetStatTypes[i].value || null;
        const shouldOptimize = targetStatsShouldOptimize.current![i]?.value === 'true';

        if (minimum < maximum) {
          targetStats.push(new TargetStat(name, type, minimum, maximum, relativeCharacter, shouldOptimize));
        } else {
          targetStats.push(new TargetStat(name, type, maximum, minimum, relativeCharacter, shouldOptimize));
        }
      }
    }

    for (let slot of ['arrow', 'triangle', 'circle', 'cross'] as ModTypes.VariablePrimarySlots[]) {
      if (form2[`${slot}-primary`].value) {
        primaryStatRestrictions[slot] = form2[`${slot}-primary`].value;
      }
    }

    if ('advanced' === editMode) {
      // Advanced form
      newTarget = new OptimizationPlan(
        planName,
        form2['health-stat-advanced'].valueAsNumber * OptimizationPlan.statWeight.Health,
        form2['protection-stat-advanced'].valueAsNumber * OptimizationPlan.statWeight.Protection,
        form2['speed-stat-advanced'].valueAsNumber * OptimizationPlan.statWeight.Speed,
        form2['critDmg-stat-advanced'].valueAsNumber * OptimizationPlan.statWeight['Critical Damage %'],
        form2['potency-stat-advanced'].valueAsNumber * OptimizationPlan.statWeight['Potency %'],
        form2['tenacity-stat-advanced'].valueAsNumber * OptimizationPlan.statWeight['Tenacity %'],
        form2['physDmg-stat-advanced'].valueAsNumber * OptimizationPlan.statWeight['Physical Damage'],
        form2['specDmg-stat-advanced'].valueAsNumber * OptimizationPlan.statWeight['Special Damage'],
        form2['critChance-stat-advanced'].valueAsNumber * OptimizationPlan.statWeight['Critical Chance'],
        form2['armor-stat-advanced'].valueAsNumber * OptimizationPlan.statWeight.Armor,
        form2['resistance-stat-advanced'].valueAsNumber * OptimizationPlan.statWeight.Resistance,
        form2['accuracy-stat-advanced'].valueAsNumber * OptimizationPlan.statWeight['Accuracy %'],
        form2['critAvoid-stat-advanced'].valueAsNumber * OptimizationPlan.statWeight['Critical Avoidance %'],
        form2['upgrade-mods'].checked || targetStats.length > 0,
        primaryStatRestrictions,
        setRestrictions,
        targetStats,
        form2['use-full-sets'].checked
      );
    } else {
      // Basic form
      newTarget = new OptimizationPlan(
        planName,
        form2['health-stat'].valueAsNumber,
        form2['protection-stat'].valueAsNumber,
        form2['speed-stat'].valueAsNumber,
        form2['critDmg-stat'].valueAsNumber,
        form2['potency-stat'].valueAsNumber,
        form2['tenacity-stat'].valueAsNumber,
        form2['physDmg-stat'].valueAsNumber,
        form2['specDmg-stat'].valueAsNumber,
        form2['critChance-stat'].valueAsNumber,
        form2['defense-stat'].valueAsNumber / 2,
        form2['defense-stat'].valueAsNumber / 2,
        form2['accuracy-stat'].valueAsNumber,
        form2['critAvoid-stat'].valueAsNumber,
        form2['upgrade-mods'].checked || targetStats.length > 0,
        primaryStatRestrictions,
        setRestrictions,
        targetStats,
        form2['use-full-sets'].checked
      );
    }

    dispatch(CharacterEdit.thunks.changeMinimumModDots(character.baseID, +form2['mod-dots'].value));
    dispatch(CharacterEdit.thunks.changeSliceMods(character.baseID, form2['slice-mods'].checked));
    dispatch(CharacterEdit.thunks.unlockCharacter(character.baseID));
    dispatch(CharacterEdit.thunks.finishEditCharacterTarget(characterIndex, newTarget));

  }


  const modsPrimaries = {
    arrowPrimaries: Array.from(new Set(
      mods.filter((mod: Mod) => mod.slot === 'arrow')
          .map((mod: Mod) => mod.primaryStat.type)
    )),
    trianglePrimaries: Array.from(new Set(
      mods.filter((mod: Mod) => mod.slot === 'triangle')
          .map((mod: Mod) => mod.primaryStat.type)
    )),
    circlePrimaries: Array.from(new Set(
      mods.filter((mod: Mod) => mod.slot === 'circle')
          .map((mod: Mod) => mod.primaryStat.type)
    )),
    crossPrimaries: Array.from(new Set(
      mods.filter((mod: Mod) => mod.slot === 'cross')
          .map((mod: Mod) => mod.primaryStat.type)
    )),
  };

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
      disabled={defaultTarget.equals(target)}
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

  const slotToPrimaryRestriction = (slot: ModTypes.VariablePrimarySlots) =>
    <div key={`mod-block-${slot}`} className={'mod-block'}>
      <Dropdown
        name={`${slot}-primary`}
        id={`${slot}-primary`}
        defaultValue={target.primaryStatRestrictions[slot]}
        onChange={() => {}}
      >
        <option value={''}>Any</option>
        {modsPrimaries[`${slot}Primaries`].map(
          primary => <option key={primary} value={primary}>{primary}</option>)}
      </Dropdown>
      <div className={`mod-image mod-image-${slot}`} />
    </div>;

  return (

    // Determine whether the current optimization plan is a default (same name exists), user-defined (same name doesn't
    // exist), or custom (name is 'custom') This determines whether to display a "Reset target to default" button, a
    // "Delete target" button, or nothing.

    <form
      className={`character-edit-form`}
      noValidate={'advanced' === editMode}
      onSubmit={(e) => {
        e.preventDefault();
        saveTarget();
        dispatch(CharacterEdit.thunks.closeEditCharacterForm());
      }}
      ref={form}>
      <div className={'character-view column'}>
        <CharacterAvatar character={character} />
        <h2 className={'character-name'}>
          {baseCharacters[character.baseID] ? baseCharacters[character.baseID].name : character.baseID}
        </h2>
      </div>
      <div id={'character-level-options'}>
        <h3>Character-level options</h3>
        <div className={'form-row center'}>
          <label htmlFor='mod-dots' id={'mod-dots-label'}>
            Use only mods with at least&nbsp;
            <span className={'dropdown'}>
              <select name={'mod-dots'} id={'mod-dots'} defaultValue={character.optimizerSettings.minimumModDots}>
                {[1, 2, 3, 4, 5, 6].map(dots => <option key={dots} value={dots}>{dots}</option>)}
              </select>
            </span>
            &nbsp;dot(s)
          </label>
        </div>
        <div className={'form-row'}>
          <label htmlFor={'slice-mods'} id={'slice-mods-label'}>Slice 5-dot mods to 6E during optimization?</label>
          <input
            type={'checkbox'}
            id={'slice-mods'}
            name={'slice-mods'}
            defaultChecked={character.optimizerSettings.sliceMods} />
        </div>
      </div>
      <div className={'target-level-options'}>
        <h3>Target-specific Options</h3>
        <div className="row">
          <div className={'column'}>
            <div className={'flex gap-1 justify-center'}>
              <Label htmlFor={'plan-name'}>Target Name: </Label>
              <Input type={'text'} defaultValue={target.name} id={'plan-name'} name={'plan-name'} />
            </div>
            <div className={'non-stats'}>
              <div className={'flex gap-1 justify-center'}>
                <Label htmlFor={'upgrade-mods'}>Upgrade Mods to level 15:</Label>
                <Input
                  className={'h-4 w-4'}
                  defaultChecked={target.upgradeMods}
                  id={'upgrade-mods'}
                  name={'upgrade-mods'}
                  type={'checkbox'}
                />
              </div>
            </div>
            <div className={'header-row group primary-stats'}>
              <h4>Restrict Primary Stats:</h4>
              <div className={'mod-blocks'}>
                <div className="breakable-group">
                  {(['arrow', 'triangle'] as ModTypes.VariablePrimarySlots[]).map(slotToPrimaryRestriction)}
                </div>
                <div className="breakable-group">
                  {(['circle', 'cross'] as ModTypes.VariablePrimarySlots[]).map(slotToPrimaryRestriction)}
                </div>
              </div>
            </div>
            <div className={'header-row group set-bonuses'}>
              <h4>Restrict Set Bonuses:</h4>
              <SetRestrictionsWidget
                setRestrictions={setRestrictions || target.setRestrictions}
                useFullSets={target.useOnlyFullSets}
              />
            </div>
            <div className={'header-row group target-stats'}>
              {targetStatForm(targetStats ||
                target.targetStats.map((targetStat, index) => ({
                  key: index,
                  target: targetStat
                }))
              )}
            </div>
          </div>
          <div className={'column'}>
            <div className={'header-row stat-weights-toggle'}>
              <Toggle
                id={'mode'}
                className={''}
                inputLabel={'Stat Weights'}
                name={'mode'}
                leftLabel={'Basic'}
                leftValue={'basic'}
                rightLabel={'Advanced'}
                rightValue={'advanced'}
                value={editMode}
                disabled={false}
                onChange={(newValue: string) => dispatch(CharacterEdit.actions.changeCharacterEditMode(newValue as CharacterEditMode))}
              />
            </div>
            <div className={'instructions'}>
              Give each stat type a value. These values are used as the "goodness" of each stat to calculate the optimum
              mods to equip. <strong>These are not the amount of each stat you want!</strong> Instead, they are multiplied
              with the amount of each stat on a mod to determine a score for each mod.
            </div>
            {'basic' === editMode && basicForm(target)}
            {'advanced' === editMode && advancedForm(target)}
            {missedGoalsSection(
              character.baseID === modAssignments[characterIndex]?.id ?
                modAssignments[characterIndex]
              :
                null
            )}
          </div>
        </div>
      </div>
      <div className={'actions flex gap-2 justify-center'}>
        {resetButton}
        <Button
          type={'button'}
          onClick={() => dispatch(App.actions.hideModal())}
        >
          Cancel
        </Button>
        <Button type={'submit'}>Save</Button>
      </div>
    </form>
  );
};

export { CharacterEditForm };
