// react
import React, { createRef } from "react";
import { connect, ConnectedProps } from "react-redux";
import { ThunkDispatch } from "../../state/reducers/modsOptimizer";

// styles
import "./CharacterEditForm.css";

// utils
import areObjectsEquivalent from '../../utils/areObjectsEquivalent';

// state
import { IAppState } from "../../state/storage";

// modules
import { App } from '../../state/modules/app';
import { CharacterEdit } from '../../state/modules/characterEdit';
import { Data } from '../../state/modules/data';
import { Optimize } from '../../state/modules/optimize';

// domain
import { characterSettings, CharacterNames } from "../../constants/characterSettings";
import setBonuses from "../../constants/setbonuses";
import type * as ModTypes from "../../domain/types/ModTypes";

import { BaseCharacter } from "../../domain/BaseCharacter";
import { Character } from "../../domain/Character";
import { CharacterEditMode } from "../../domain/CharacterEditMode";
import { CharacterSettings } from "../../domain/CharacterSettings";
import { Mod } from "../../domain/Mod";
import { OptimizationPlan, PrimaryStatRestrictions } from "../../domain/OptimizationPlan";
import { IModSuggestion } from "../../domain/PlayerProfile";
import SetBonus from "../../domain/SetBonus";
import { SetRestrictions } from "../../domain/SetRestrictions";
import { SetStats } from "../../domain/Stats";
import { TargetStat, TargetStatEntry, TargetStats } from "../../domain/TargetStat";

// components
import { CharacterAvatar } from "../../components/CharacterAvatar/CharacterAvatar";
import { Dropdown } from "../../components/Dropdown/Dropdown";
import { OptimizerProgress } from '../../components/OptimizerProgress/OptimizerProgress';
import { RangeInput } from "../../components/RangeInput/RangeInput";
import { Toggle } from "../../components/Toggle/Toggle";
import { Button } from "#ui/button";


type ComponentProps = {
  character: Character,
  characterIndex: number,
  target: OptimizationPlan,
}


class CharacterEditForm extends React.Component<Props> {

  form: React.RefObject<HTMLFormElement>;
  targetStatsShouldOptimize: (Toggle | null)[];   //: (typeof Toggle | null)[];
  targetStatIndex: number = 0;

  constructor(props: Props) {
    super(props);
    if (Object.keys(props.setRestrictions).length === 0) {
      props.populateSetRestrictions(props.target.setRestrictions);
    }
    if (props.targetStats.length === 0) {
      props.populateTargetStats(props.target.targetStats);
    }

    // This is an array to hold references to the `Toggle` element in the target stats form,
    // so that the value of the element can be accessed directly
    this.targetStatsShouldOptimize = [];
    this.form = createRef<HTMLFormElement>();
    this.setTargetShouldOptimizeRefs = this.setTargetShouldOptimizeRefs.bind(this);
  }

  componentWillUnmount() {
    this.props.cancel();
  }

  setTargetShouldOptimizeRefs(ref: Toggle | null) {
    this.targetStatsShouldOptimize[this.targetStatIndex] = ref;
  }

  render() {
    const character = this.props.character;
    const target = this.props.target;

    if (!character) {
      return null;
    }

    const defaultTarget = characterSettings[character.baseID] ?
      (characterSettings[character.baseID] as CharacterSettings).targets.find(defaultTarget => defaultTarget.name === target.name) :
      null;

    // Determine whether the current optimization plan is a default (same name exists), user-defined (same name doesn't
    // exist), or custom (name is 'custom') This determines whether to display a "Reset target to default" button, a
    // "Delete target" button, or nothing.
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
          this.props.resetCharacterTargetToDefault(character.baseID, target.name);
        }}
      >
        Reset target to default
      </Button>
    } else {
      resetButton =
      <Button
        type={'button'}
        id={'delete-button'}
        variant={'destructive'}
        onClick={() => this.props.deleteTarget(character.baseID, target.name)}
      >
        Delete target
      </Button>
    }

    const slotToPrimaryRestriction = (slot: ModTypes.VariablePrimarySlots) =>
      <div key={`mod-block-${slot}`} className={'mod-block'}>
        <Dropdown
          name={`${slot}-primary`}
          id={`${slot}-primary`}
          defaultValue={this.props.target.primaryStatRestrictions[slot]}
          onChange={() => {}}
        >
          <option value={''}>Any</option>
          {this.props[`${slot}Primaries`].map(
            primary => <option key={primary} value={primary}>{primary}</option>)}
        </Dropdown>
        <div className={`mod-image mod-image-${slot}`} />
      </div>;

    return <form
      className={`character-edit-form`}
      noValidate={'advanced' === this.props.editMode}
      onSubmit={(e) => {
        e.preventDefault();
        this.saveTarget();
        this.props.closeForm();
      }}
      ref={this.form}>
      <div className={'character-view column'}>
        <CharacterAvatar character={character} />
        <h2 className={'character-name'}>
          {this.props.baseCharacters[character.baseID] ? this.props.baseCharacters[character.baseID].name : character.baseID}
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
            <div className={'header-row'}>
              <label htmlFor={'plan-name'}>Target Name: </label>
              <input type={'text'} defaultValue={target.name} id={'plan-name'} name={'plan-name'} />
            </div>
            <div className={'non-stats'}>
              <div className={'form-row center'}>
                <label htmlFor={'upgrade-mods'}>Upgrade Mods to level 15:</label>
                <input type={'checkbox'} name={'upgrade-mods'} id={'upgrade-mods'}
                  defaultChecked={this.props.target.upgradeMods} />
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
              {
                this.setRestrictionsForm(
                  this.props.setRestrictions || this.props.target.setRestrictions,
                  this.props.target.useOnlyFullSets
                )
              }
            </div>
            <div className={'header-row group target-stats'}>
              {this.targetStatForm(this.props.targetStats ||
                this.props.target.targetStats.map((targetStat, index) => ({
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
                value={this.props.editMode}
                disabled={false}
                onChange={(newValue: string) => this.props.changeCharacterEditMode(newValue as CharacterEditMode)}
              />
            </div>
            <div className={'instructions'}>
              Give each stat type a value. These values are used as the "goodness" of each stat to calculate the optimum
              mods to equip. <strong>These are not the amount of each stat you want!</strong> Instead, they are multiplied
              with the amount of each stat on a mod to determine a score for each mod.
            </div>
            {'basic' === this.props.editMode && this.basicForm(target)}
            {'advanced' === this.props.editMode && this.advancedForm(target)}
            {this.missedGoalsSection(
              character.baseID === this.props.modAssignments[this.props.characterIndex]?.id ?
                this.props.modAssignments[this.props.characterIndex]
              :
                null
            )}
          </div>
        </div>
      </div>
      <div className={'actions'}>
        {resetButton}
        <Button
          type={'button'}
          onClick={() => this.props.hideModal()}
        >
          Cancel
        </Button>
        <Button type={'submit'}>Save</Button>
      </div>
    </form>;
  }

  /**
   * Renders a form element for managing set restrictions
   *
   * @param setRestrictions {Object<String, Number>}
   * @param useFullSets {Boolean}
   * @returns {JSX Element}
   */
  setRestrictionsForm(setRestrictions: SetRestrictions, useFullSets: boolean) {
    let selectedSets: SetStats.GIMOStatNames[] = [];
    Object.entries(setRestrictions).forEach(([setName, count]) => {
      for (let i = 0; i < count; i++) {
        selectedSets.push(setName as SetStats.GIMOStatNames);
      }
    });
    const emptySlots = 3 - selectedSets.reduce((acc, setName) => acc + setBonuses[setName].numberOfModsRequired / 2, 0);

    const setBonusToFormDisplay = (setBonus: SetBonus, index: number) => {
      const className = setBonus.numberOfModsRequired > (2 * emptySlots) ? 'disabled' : ''
      const setBonusName = setBonus.name.replace(/\s|%/g, '').toLowerCase()
      return <img
        src={`/img/icon_buff_${setBonusName}.png`}
        alt={setBonus.name}
        key={index}
        className={className}
        onClick={() => this.props.selectSetBonus(setBonus.name)}
      />
    };

    const setBonusGroups = [Object.values(setBonuses).slice(0, 4), Object.values(setBonuses).slice(4)];
    const setBonusGroupsDisplay = setBonusGroups.map(setBonuses => setBonuses.map(setBonusToFormDisplay))
    const setBonusDisplay = setBonusGroupsDisplay.map((groupDisplay, index) =>
      <div className="breakable-group" key={index}>{groupDisplay}</div>
    )

    return <div className={'mod-sets'}>
      <div className={'form-row center'}>
        <label htmlFor={'use-full-sets'}>Don't break mod sets</label>
        <input type={'checkbox'} name={'use-full-sets'} id={'use-full-sets'} defaultChecked={useFullSets} />
      </div>
      <p className={'instructions'}>
        Click on a set bonus to add it to or remove it from the selected sets.
      </p>
      <div className={'set-options'}>
        {setBonusDisplay}
      </div>
      <div className={'selected-sets'}>
        <p>Selected Sets:</p>
        {selectedSets.map((setName, index) =>
          <img
            src={`/img/icon_buff_${setName.replace(/\s|%/g, '').toLowerCase()}.png`}
            alt={setName}
            key={index}
            onClick={() => this.props.removeSetBonus(setName)}
          />
        )}
        {Array.from({ length: emptySlots }, (_, index) =>
          <span className={'empty-set'} key={index} />
        )}
      </div>
    </div>;
  }

  /**
   * Renders a form element for managing a target stat
   *
   * @param targetStats {Array<TargetStat>}
   * @returns {*}
   */
  targetStatForm(targetStats: TargetStats) {
    const baseCharacters = Object.values(this.props.baseCharacters).slice(0) as BaseCharacter[];
    baseCharacters.sort((a, b) => a.name.localeCompare(b.name))

    const targetStatRows = targetStats.map((targetStat: TargetStatEntry, index: number) => {
      this.targetStatIndex = index;
      return <div className={'form-row center'} key={targetStat.key}>
        <Toggle
          ref={this.setTargetShouldOptimizeRefs}
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
          onClick={() => this.props.removeTargetStat(index)}
        >
          -
        </Button>
        <span className={'dropdown'}>
          <select name={'target-stat-name[]'} defaultValue={targetStat.target.stat}
            onChange={event => {
              if (event.target.value === 'Health+Protection') {
                this.targetStatsShouldOptimize[index]?.updateValue('false');
                this.targetStatsShouldOptimize[index]?.disable();
              } else {
                this.targetStatsShouldOptimize[index]?.enable();
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
            {baseCharacters.map(
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
          onClick={() => this.props.addTargetStat(new TargetStat('Speed'))}
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
  basicForm(optimizationPlan: OptimizationPlan) {
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
  advancedForm(optimizationPlan: OptimizationPlan) {
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

  missedGoalsSection(modAssignments: IModSuggestion | null) {
    if ((this.props.targetStats || []).length === 0) {
      return;
    }

    const resultsInner = (() => {
      if (!areObjectsEquivalent(this.props.progress, {})) {
        return <OptimizerProgress />;
      }

      const rerunButton = (
        <div className={'actions'}>
          <Button
            type={'button'}
            onClick={() => this.runIncrementalCalc()}
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

  runIncrementalCalc() {
    this.saveTarget();
    this.props.optimizeMods();
  }

  saveTarget() {
    const form = this.form.current!;
    const planName = 'lock' !== form['plan-name'].value ? form['plan-name'].value : 'custom';
    let newTarget;
    let primaryStatRestrictions: PrimaryStatRestrictions = {} as PrimaryStatRestrictions;
    const targetStats = [];
    if (form['target-stat-name[]']) {
      const targetStatNames = form['target-stat-name[]'] instanceof NodeList ?
        form['target-stat-name[]'] :
        [form['target-stat-name[]']];
      const targetStatMins = form['target-stat-min[]'] instanceof NodeList ?
        form['target-stat-min[]'] :
        [form['target-stat-min[]']];
      const targetStatMaxes = form['target-stat-max[]'] instanceof NodeList ?
        form['target-stat-max[]'] :
        [form['target-stat-max[]']];
      const targetStatRelativeCharacters = form['target-stat-relative-character[]'] instanceof NodeList ?
        form['target-stat-relative-character[]'] :
        [form['target-stat-relative-character[]']];
      const targetStatTypes = form['target-stat-type[]'] instanceof NodeList ?
        form['target-stat-type[]'] :
        [form['target-stat-type[]']];
      const targetStatsShouldOptimize = this.targetStatsShouldOptimize;

      for (let i = 0; i < targetStatNames.length; i++) {
        const name = targetStatNames[i].value;
        const minimum = isNaN(targetStatMins[i].valueAsNumber) ? 0 : targetStatMins[i].valueAsNumber;
        const maximum = isNaN(targetStatMaxes[i].valueAsNumber) ? 100000000 : targetStatMaxes[i].valueAsNumber;
        const relativeCharacter = targetStatRelativeCharacters[i].value || null;
        const type = targetStatTypes[i].value || null;
        const shouldOptimize = targetStatsShouldOptimize[i]?.value === 'true';

        if (minimum < maximum) {
          targetStats.push(new TargetStat(name, type, minimum, maximum, relativeCharacter, shouldOptimize));
        } else {
          targetStats.push(new TargetStat(name, type, maximum, minimum, relativeCharacter, shouldOptimize));
        }
      }
    }

    for (let slot of ['arrow', 'triangle', 'circle', 'cross'] as ModTypes.VariablePrimarySlots[]) {
      if (form[`${slot}-primary`].value) {
        primaryStatRestrictions[slot] = form[`${slot}-primary`].value;
      }
    }

    if ('advanced' === this.props.editMode) {
      // Advanced form
      newTarget = new OptimizationPlan(
        planName,
        form['health-stat-advanced'].valueAsNumber * OptimizationPlan.statWeight.Health,
        form['protection-stat-advanced'].valueAsNumber * OptimizationPlan.statWeight.Protection,
        form['speed-stat-advanced'].valueAsNumber * OptimizationPlan.statWeight.Speed,
        form['critDmg-stat-advanced'].valueAsNumber * OptimizationPlan.statWeight['Critical Damage %'],
        form['potency-stat-advanced'].valueAsNumber * OptimizationPlan.statWeight['Potency %'],
        form['tenacity-stat-advanced'].valueAsNumber * OptimizationPlan.statWeight['Tenacity %'],
        form['physDmg-stat-advanced'].valueAsNumber * OptimizationPlan.statWeight['Physical Damage'],
        form['specDmg-stat-advanced'].valueAsNumber * OptimizationPlan.statWeight['Special Damage'],
        form['critChance-stat-advanced'].valueAsNumber * OptimizationPlan.statWeight['Critical Chance'],
        form['armor-stat-advanced'].valueAsNumber * OptimizationPlan.statWeight.Armor,
        form['resistance-stat-advanced'].valueAsNumber * OptimizationPlan.statWeight.Resistance,
        form['accuracy-stat-advanced'].valueAsNumber * OptimizationPlan.statWeight['Accuracy %'],
        form['critAvoid-stat-advanced'].valueAsNumber * OptimizationPlan.statWeight['Critical Avoidance %'],
        form['upgrade-mods'].checked || targetStats.length > 0,
        primaryStatRestrictions,
        this.props.setRestrictions,
        targetStats,
        form['use-full-sets'].checked
      );
    } else {
      // Basic form
      newTarget = new OptimizationPlan(
        planName,
        form['health-stat'].valueAsNumber,
        form['protection-stat'].valueAsNumber,
        form['speed-stat'].valueAsNumber,
        form['critDmg-stat'].valueAsNumber,
        form['potency-stat'].valueAsNumber,
        form['tenacity-stat'].valueAsNumber,
        form['physDmg-stat'].valueAsNumber,
        form['specDmg-stat'].valueAsNumber,
        form['critChance-stat'].valueAsNumber,
        form['defense-stat'].valueAsNumber / 2,
        form['defense-stat'].valueAsNumber / 2,
        form['accuracy-stat'].valueAsNumber,
        form['critAvoid-stat'].valueAsNumber,
        form['upgrade-mods'].checked || targetStats.length > 0,
        primaryStatRestrictions,
        this.props.setRestrictions,
        targetStats,
        form['use-full-sets'].checked
      );
    }

    this.props.submitForm(
      this.props.character.baseID,
      this.props.characterIndex,
      newTarget,
      +form['mod-dots'].value,
      form['slice-mods'].checked,
    );
  }
}

const mapStateToProps = (state: IAppState) => {
  const mods = state.profile.mods;

  return {
    editMode: state.characterEditMode,
    baseCharacters: Data.selectors.selectBaseCharacters(state),
    setRestrictions: state.setRestrictions,
    targetStats: state.targetStats,
    modAssignments: state.profile.modAssignments,
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
    progress: state.progress
  }
};

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  cancel: () => {
    dispatch(CharacterEdit.actions.changeSetRestrictions({} as SetRestrictions));
    dispatch(CharacterEdit.actions.changeTargetStats([]));
  },
  hideModal: () => dispatch(App.actions.hideModal()),
  submitForm: (
    characterID: CharacterNames,
    characterIndex: number,
    target: OptimizationPlan,
    minimumModDots: number,
    sliceMods: boolean,
  ) => {
    dispatch(CharacterEdit.thunks.changeMinimumModDots(characterID, minimumModDots));
    dispatch(CharacterEdit.thunks.changeSliceMods(characterID, sliceMods));
    dispatch(CharacterEdit.thunks.unlockCharacter(characterID));
    dispatch(CharacterEdit.thunks.finishEditCharacterTarget(characterIndex, target));
  },
  closeForm: () => dispatch(CharacterEdit.thunks.closeEditCharacterForm()),
  resetCharacterTargetToDefault: (characterID: CharacterNames, targetName: string) =>
    dispatch(CharacterEdit.thunks.resetCharacterTargetToDefault(characterID, targetName)),
  deleteTarget: (characterID: CharacterNames, targetName: string) => dispatch(CharacterEdit.thunks.deleteTarget(characterID, targetName)),
  changeCharacterEditMode: (mode: CharacterEditMode) => dispatch(CharacterEdit.actions.changeCharacterEditMode(mode)),
  populateSetRestrictions: (setRestrictions: SetRestrictions) => dispatch(CharacterEdit.actions.changeSetRestrictions(setRestrictions)),
  selectSetBonus: (set: SetStats.GIMOStatNames) => dispatch(CharacterEdit.actions.selectSetBonus(set)),
  removeSetBonus: (set: SetStats.GIMOStatNames) => dispatch(CharacterEdit.actions.removeSetBonus(set)),
  populateTargetStats: (targetStats: TargetStat[]) => dispatch(CharacterEdit.actions.changeTargetStats(targetStats)),
  addTargetStat: (targetStat: TargetStat) => dispatch(CharacterEdit.actions.addTargetStat(targetStat)),
  removeTargetStat: (index: number) => dispatch(CharacterEdit.actions.removeTargetStat(index)),
  optimizeMods: () => dispatch(Optimize.thunks.optimizeMods()),
});

type Props = PropsFromRedux & ComponentProps;
type PropsFromRedux = ConnectedProps<typeof connector>;

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(CharacterEditForm);
