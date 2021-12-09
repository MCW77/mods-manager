import * as React from 'react';
import * as Redux from 'redux';
import { connect, ConnectedProps } from "react-redux";
import { withTranslation, WithTranslation } from 'react-i18next';

import './ModFilter.css';

import { changeModsViewOptions } from "../../state/actions/explore";

import { IAppState } from '../../state/storage';
import { defaultOptions } from "../../domain/modules/ModsViewOptions";
import { EquippedSettings, OptimizerSettings, LevelSettings, RaritySettings, SecondarySettings, SetSettings, SlotSettings, TierSettings, SecondariesScoreTierSettings, PrimarySettings, ModsViewOptions, FilterOptions } from 'domain/types/ModsViewOptionsTypes';
import { Mod } from "../../domain/Mod";
import * as ModConsts from "../../domain/constants/ModConsts";
import * as ModScoresConsts from "../../domain/constants/ModScoresConsts";
import { PrimaryStats, SecondaryStats, SetStats } from "../../domain/Stats";

import { Dropdown } from '../Dropdown/Dropdown';
import Pips from "../Pips/Pips";

function selectElement(element: HTMLInputElement | null) {
  if (element !== null && element !== undefined) {
    if (element.value !== undefined)
      element.value = '1';
    element.classList.remove('unselect');
    element.classList.add('select');
  }
}

function unselectElement(element: HTMLInputElement | null) {
  if (element !== null && element !== undefined) {
    if (element.value !== undefined)
      element.value = '0';
    element.classList.remove('select', 'unselect');
  }
}

function classForValue(value: number) {
  switch (value) {
    case 1: return 'select';
    case -1: return 'unselect';
    default: return '';
  }
}

/**
 * --------------------
 * Filter Component
 * --------------------
 * Renders as a button.
 * Clicking the button will display a mod filter modal dialog
 *
 * Properties:
 *  updated: a callback function to call whenever the mod filter is saved
 *
 *  To Use:
 *  Store a reference to the component, ex: ref={(filter) => {this.filter = filter;}}
 *  To get the current filter selections, this.filter.get_filters();
 *  To filter an array of Mod objects, this.filter.apply_filter(mods);
 *
 */
class ModFilter extends React.PureComponent<Props> {

  constructor(props: Props) {
    super(props);
    this.resetFilters = this.resetFilters.bind(this);
  }

  slotFilter(cycleState: (e: React.MouseEvent<HTMLInputElement>) => void) {
    const slotFilters: (HTMLInputElement | null)[] = ModConsts.gimoSlots
      .map(slot => (document.getElementById(`slot-filter-${slot}`) as HTMLInputElement)
      );
    const selectAll = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      slotFilters.forEach(slotFilter => {
        selectElement(slotFilter);
      })
    }
    
    const selectNone = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      slotFilters.forEach(slotFilter => {
        unselectElement(slotFilter);
      })
    }

    const slotElements = ModConsts.gimoSlots.map(slot1 => {
      const inputName = `slot-filter-${slot1}`;
      const slots: SlotSettings = this.props.modsViewOptions.filtering['slot'];
      const value = slots[slot1 as keyof SlotSettings] || 0;

      return <label htmlFor={inputName} key={slot1}>
        <input type={'number'}
          id={inputName}
          name={inputName}
          defaultValue={value}
          className={classForValue(value)}
          onClick={cycleState}
        />
        <span className={'option-image shape ' + slot1} />
      </label>
    });

    return <div id={'slot-filters'}>
      <div className={'toggle-label'}>Slot</div>
      <div className={'slots'}>
        {slotElements}
      </div>
      <div className={'actions'}>
        <button onClick={selectAll}>All</button>
        <button onClick={selectNone}>None</button>
      </div>
    </div>;
  }

  setFilter(cycleState: (e: React.MouseEvent<HTMLInputElement>) => void) {
    let setFilters: HTMLInputElement[] = SetStats.SetStat.statNames
      .map((set) => document.getElementById(`set-filter-${SetStats.SetStat.getClassName(set)}`) as HTMLInputElement);
    const selectAll = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setFilters.forEach(setFilter => {
        selectElement(setFilter);      
      });
    };
    const selectNone = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setFilters.forEach(setFilter => {
        unselectElement(setFilter);
      });
    };

    const sets = SetStats.SetStat.statNames.map(set => {
      const inputName = `set-filter-${SetStats.SetStat.getClassName(set)}`;
      const sets: SetSettings = this.props.modsViewOptions.filtering['set'];
      const value = sets[set as SetStats.GIMOStatNames] || 0;

      return <label htmlFor={inputName} key={set}>
        <input type={'number'}
          id={inputName}
          name={'set-filter-'+set}
          defaultValue={value}
          className={classForValue(value)}
          onClick={cycleState}
        />
        <span className={'option-image set ' + SetStats.SetStat.getClassName(set)} />
      </label>
    });

    return <div id={'set-filters'}>
      <div className={'toggle-label'}>Set</div>
      <div className={'sets'}>
        {sets}
      </div>
      <div className={'actions'}>
        <button onClick={selectAll}>All</button>
        <button onClick={selectNone}>None</button>
      </div>
    </div>;
  }

  rarityFilter(cycleState: (e: React.MouseEvent<HTMLInputElement>) => void) {
    const rarityFilters: HTMLInputElement[] = [5, 6].map(rarity => document.getElementById(`rarity-filter-${rarity}`)! as HTMLInputElement)

    const pips = [6, 5].map(rarity => {
      const inputName = `rarity-filter-${rarity}`;
      const rarities: RaritySettings = this.props.modsViewOptions.filtering.rarity;
      const value = rarities[rarity as keyof RaritySettings] || 0;

      return <label htmlFor={inputName} key={inputName}>
        <input type={'number'}
          id={inputName}
          name={inputName}
          defaultValue={value}
          className={classForValue(value)}
          onClick={cycleState}
        />
        <span className={'option pips-button'}>
          <Pips pips={rarity} />
        </span>
      </label>
    });

    return <div id={'pips-filters'}>
      <div className={'toggle-label'}>Rarity</div>
      <div className={'rarity'}>
        {pips}
      </div>
    </div>;
  }

  tierFilter(cycleState: (e: React.MouseEvent<HTMLInputElement>) => void) {
/*
    const tiers: {[key: string]: string} = {
      5: 'gold',
      4: 'purple',
      3: 'blue',
      2: 'green',
      1: 'gray'
    };

    let tierFilters: HTMLInputElement[] = Object.keys(tiers)
    .map(tier => document.getElementById(`tier-filter-${tier}`)! as HTMLInputElement);
*/
    let tierFilters: HTMLInputElement[] = [... ModConsts.tiersMap.values()]
      .map(tier => document.getElementById(`tier-filter-${tier}`)! as HTMLInputElement);

    const selectAll = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      tierFilters.forEach(tierFilter => {
        selectElement(tierFilter);
      });
    };
    const selectNone = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      tierFilters.forEach(tierFilter => {
        unselectElement(tierFilter);
      });
    };
    
    const tierSettings: TierSettings = this.props.modsViewOptions.filtering.tier;
    const tierButtons = [... ModConsts.tiersMap.entries()].map(([tier, displayTier]) => {
      const inputName = `tier-filter-${tier}`;
      const value = tierSettings[String(tier) as keyof TierSettings] ?? 0;

      return <label htmlFor={inputName} key={inputName}>
        <input type={'number'}
          id={inputName}
          name={inputName}
          defaultValue={value}
          className={classForValue(value)}
          onClick={cycleState} />
        <span className={`option tier ${displayTier}`}>
          {displayTier[0].toUpperCase() + displayTier.substr(1)}
        </span>
      </label>
    });

    return <div id={'tier-filters'}>
      <div className={'toggle-label'}>Tier</div>
      <div className={'tier'}>
        {tierButtons}
      </div>
      <div className={'actions'}>
        <button onClick={selectAll}>All</button>
        <button onClick={selectNone}>None</button>
      </div>
    </div>;
  }

  secondariesScoreTierFilter(cycleState: (e: React.MouseEvent<HTMLInputElement>) => void) {
    let secondariesScoreTierFilters: HTMLInputElement[] = [... ModConsts.secondaryScoresTiersMap.values()]
      .map(tier => document.getElementById(`secondariesscore-tier-filter-${tier}`)! as HTMLInputElement);


    const selectAll = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      secondariesScoreTierFilters
        .forEach(secondariesScoreTierFilter => {
          selectElement(secondariesScoreTierFilter);
      });
    };
    const selectNone = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      secondariesScoreTierFilters
        .forEach(secondariesScoreTierFilter => {
          unselectElement(secondariesScoreTierFilter);
      });
    };
    
    const tierSettings: SecondariesScoreTierSettings = this.props.modsViewOptions.filtering.secondariesscoretier;
    const tierButtons = [... ModConsts.secondaryScoresTiersMap.entries()].map(([tier, displayTier]) => {
      const inputName = `secondariesscore-tier-filter-${displayTier}`;
      const value = tierSettings[String(tier) as keyof SecondariesScoreTierSettings] ?? 0;

      return <label htmlFor={inputName} key={inputName}>
        <input type={'number'}
          id={inputName}
          name={inputName}
          defaultValue={value}
          className={classForValue(value)}
          onClick={cycleState} />
        <span className={`option tier ${displayTier}`}>
          {displayTier[0].toUpperCase() + displayTier.substr(1)}
        </span>
      </label>
    });

    return <div id={'secondariesscore-tier-filters'}>
      <div className={'toggle-label'}>2° Score</div>
      <div className={'tier'}>
        {tierButtons}
      </div>
      <div className={'actions'}>
        <button onClick={selectAll}>All</button>
        <button onClick={selectNone}>None</button>
      </div>
    </div>;
  }

  levelFilter(cycleState: (e: React.MouseEvent<HTMLInputElement>) => void) {
    const levelFilters: HTMLInputElement[] = [1, 3, 6, 9, 12, 15]
      .map(level => document.getElementById(`level-filter-${level}`)! as HTMLInputElement);
    const selectAll = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      levelFilters
        .forEach(levelFilter => selectElement(levelFilter));
    };
    const selectNone = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      levelFilters
        .forEach(levelFilter => unselectElement(levelFilter));
    };

    const levelButtons = [15, 12, 9, 6, 3, 1].map(level => {
      const inputName = `level-filter-${level}`;
      const levels: LevelSettings = this.props.modsViewOptions.filtering.level; 
      const value = levels[level as keyof LevelSettings] || 0;

      return <label htmlFor={inputName} key={inputName}>
        <input type={'number'}
          id={inputName}
          name={inputName}
          defaultValue={value}
          className={classForValue(value)}
          onClick={cycleState} />
        <span className={'option'}>
          {level}
        </span>
      </label>
    });

    return <div id={'level-filters'}>
      <div className={'toggle-label'}>Level</div>
      <div className={'level'}>
        {levelButtons}
      </div>
      <div className={'actions'}>
        <button onClick={selectAll}>All</button>
        <button onClick={selectNone}>None</button>
      </div>
    </div>;
  }

  equippedFilter(cycleState: (e: React.MouseEvent<HTMLInputElement>) => void) {
    const equipedFilter: HTMLInputElement = document.getElementById(`equipped-filter-equipped`)! as HTMLInputElement;
    const inputName = `equipped-filter-equipped`;
    const equippeds: EquippedSettings = this.props.modsViewOptions.filtering.equipped;
    const value = equippeds['equipped' as keyof EquippedSettings] || 0;
  
    const equippedButton = 
      <label htmlFor={inputName} key={inputName}>
        <input type={'number'}
          id={inputName}
          name={inputName}
          defaultValue={value}
          className={classForValue(value)}
          onClick={cycleState} />
        <span className={'option'}>
          {'Equipped'}
        </span>
      </label>
    ;

    return <div id={'equipped-filters'}>
      <div className={'toggle-label'}>Equipped</div>
      <div className={'level'}>
        {equippedButton}
      </div>
    </div>;
  }

  primaryStatFilter(cycleState: (e: React.MouseEvent<HTMLInputElement>) => void) {
    const primaryStatFilters: HTMLInputElement[] = PrimaryStats.PrimaryStat.statNames
      .map((stat) => document.getElementById(`primary-filter-${stat}`)! as HTMLInputElement);  
    const selectAll = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      primaryStatFilters.forEach(filter => selectElement(filter));
    };
    const selectNone = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      primaryStatFilters.forEach(filter => unselectElement(filter));
    };

    const primaries = PrimaryStats.PrimaryStat.statNames.map((stat) => {
      const inputName = `primary-filter-${stat}`;
      const value = this.props.modsViewOptions.filtering.primary[stat] || 0;

      return <label htmlFor={inputName} key={stat}>
        <input type={'number'}
          id={inputName}
          name={inputName}
          defaultValue={value}
          className={classForValue(value)}
          onClick={cycleState} />
        <span className={'option'}>{this.props.t(`domain:stats.primaries.${stat}`)}</span>
      </label>
    });

    return <div id={'primary-filters'}>
      <div className={'toggle-label'}>Primary Stat</div>
      <div className={'primaries'}>
        {primaries}
      </div>
      <div className={'actions'}>
        <button onClick={selectAll}>All</button>
        <button onClick={selectNone}>None</button>
      </div>
    </div>;
  }

  secondaryStatFilter(cycleState: (e: React.MouseEvent<HTMLInputElement>) => void) {
    const secondaryStatsFilters: HTMLInputElement[] = SecondaryStats.SecondaryStat.statNames
      .map((stat) => document.getElementById(`secondary-filter-${stat}`)! as HTMLInputElement);
    const selectAll = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      secondaryStatsFilters.forEach(filter => selectElement(filter));
    };
    const selectNone = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      secondaryStatsFilters.forEach(filter => unselectElement(filter));
    };

    const secondaries = SecondaryStats.SecondaryStat.statNames.map((stat) => {
      const inputName = `secondary-filter-${stat}`;
      const secondaries: SecondarySettings = this.props.modsViewOptions.filtering.secondary;
      const value = secondaries[stat] || 0;

      return <label htmlFor={inputName} key={stat}>
        <input type={'number'}
          id={inputName}
          name={inputName}
          defaultValue={value}
          className={classForValue(value)}
          onClick={cycleState} />
        <span className={'option'}>{stat}</span>
      </label>
    });

    return <div id={'secondary-filters'}>
      <div className={'toggle-label'}>Secondary Stat</div>
      <div className={'secondaries'}>
        {secondaries}
      </div>
      <div className={'actions'}>
        <button onClick={selectAll}>All</button>
        <button onClick={selectNone}>None</button>
      </div>
    </div>;
  }

  secondaryStatFilter2(cycleState: (e: React.MouseEvent<HTMLInputElement>) => void) {

    const secondaryStatsFilters: HTMLInputElement[] = SecondaryStats.SecondaryStat.statNames
      .map((stat: keyof SecondarySettings) => document.getElementById(`secondary-filter-${stat}`)! as HTMLInputElement);

    const secondaries = SecondaryStats.SecondaryStat.statNames.map((stat: keyof SecondarySettings) => {
      const inputName = `secondary-filter-${stat}`;
      const secondaries: SecondarySettings = this.props.modsViewOptions.filtering.secondary;
      const value = secondaries[stat as keyof SecondarySettings] || 0;

      return <label htmlFor={inputName} key={stat}>
        <input type={'number'}
          id={inputName+'-min'}
          name={inputName+'min'}
          defaultValue={value}
          className={classForValue(value)}/>
      </label>
    });

    return <div id={'secondary-filters'}>
      <div className={'toggle-label'}>Secondary Stat</div>
      <div className={'secondaries'}>
        {secondaries}
      </div>
    </div>;
  }

  optimizerFilter(cycleState: (e: React.MouseEvent<HTMLInputElement>) => void) {
    const assignedStateFilter: HTMLInputElement =
      document.getElementById(`optimizer-filter-assigned`)! as HTMLInputElement;

    const inputName = `optimizer-filter-assigned`;
    const optimizer: OptimizerSettings = this.props.modsViewOptions.filtering.optimizer;
    const value = optimizer['assigned' as keyof OptimizerSettings] || 0;

    const optimizerButton = 
      <label htmlFor={inputName} key={inputName}>
        <input type={'number'}
          id={inputName}
          name={inputName}
          defaultValue={value}
          className={classForValue(value)}
          onClick={cycleState} />
        <span className={'option'}>
          Assigned
        </span>
      </label>
    ;

    return <div id={'optimizer-filters'}>
      <div className={'toggle-label'}>Used By Optimizer</div>
      <div className={'level'}>
        {optimizerButton}
      </div>
    </div>;
  }

  groupOption() {
    const inputName = `group-option`;
    const isGroupingEnabled = this.props.modsViewOptions.isGroupingEnabled;

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      this.props.updateFilter(this.collectFilters(e.target.form as HTMLFormElement))
    };    
    
    const groupCheck = 
      <label htmlFor={inputName} key={inputName}>
        {this.props.t('filter.Group')}
        <input type={'checkbox'}
          id={inputName}
          name={inputName}
          defaultChecked={isGroupingEnabled}
          onChange={onChange} />
      </label>
    ;

    return <div id={'group-filters'}>
      {groupCheck}
    </div>;

  }

  sortOption() {
    const statOptions = SecondaryStats.SecondaryStat.statNames.map(stat =>
      <option value={'Stat'+stat} key={stat}>{this.props.t(`domain:stats.${stat}`)}</option>
    );
    const statScoreOptions = SecondaryStats.SecondaryStat.statNames.map(stat =>
      <option value={'StatScore'+stat} key={stat}>{this.props.t(`domain:stats.${stat}`)}</option>
    );

    const modScoreOptions = ModScoresConsts.modScores.map(modScore =>
      <option value={'ModScore'+modScore.name} key={modScore.name} title={modScore.description}>{modScore.displayName}</option>
    );


    const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      e.preventDefault();
      this.props.updateFilter(this.collectFilters(e.target.form as HTMLFormElement))
    };    

    const sortSelects = [1,2,3,4].map((number: number) => {
      return <Dropdown name={'sort-option-' + number} key={`sort-option-${number}`} defaultValue={this.props.modsViewOptions.sort[number-1]} onChange={onChange}>
          <optgroup>
            <option value={''}>default</option>
            <option key={`sort-option-${number}-slot`} value={'slot'}>Slot</option>
            <option value={'set'}>Set</option>
            <option value={'rolls'}># of Stat Upgrades</option>
            <option value={'character'}>Character</option>
          </optgroup>
          <optgroup label="Stats">
            {statOptions}
          </optgroup>
          <optgroup label="Statscores">
            {statScoreOptions}
          </optgroup>
          <optgroup label="Modscores">
            {modScoreOptions}
          </optgroup>
        </Dropdown>
    });


    return <div>
        <div className={'toggle-label'}>Sort By:</div>
        {sortSelects}
      </div>;
  }

  scoreOption() {
    const modScoreOptions = ModScoresConsts.modScores.map(modScore =>
      <option value={modScore.name} key={modScore.name} title={modScore.description}>{modScore.displayName}</option>
    );

    const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      e.preventDefault();
      this.props.updateFilter(this.collectFilters(e.target.form as HTMLFormElement))
    };    

    const scoreSelect =
      <Dropdown name={'score-option'} defaultValue={'PureSecondaries'} onChange={onChange}>
        {modScoreOptions}
      </Dropdown>
    ;


    return <div>
        <div className={'toggle-label'}>{this.props.t('filter.ScoreHeadline')}:</div>
        {scoreSelect}
      </div>;
  }

  resetFilters() {
    const modFilters = document.getElementById('mod-filters');
    let filterInputs: HTMLInputElement[];
    let filterSelects: HTMLSelectElement[];

    if (modFilters !== null ) {
      filterInputs = [...modFilters.getElementsByTagName('input')!];
      filterSelects = [...modFilters.getElementsByTagName('select')!];
      filterInputs
        .forEach(element => unselectElement(element));
      filterSelects
        .forEach(element => {
          element.value = '';
        });
      this.props.updateFilter(this.collectFilters(filterInputs[0].form as HTMLFormElement))
    }
  }

  collectFilters(form: HTMLFormElement) {
    const viewOptions: ModsViewOptions = {...defaultOptions};
    
    [...form.elements].filter(element => (element as (HTMLInputElement | HTMLButtonElement)).name.includes('-filter-')).forEach(element => {
      const [fT, fK] = (element as HTMLInputElement).name.split('-filter-');
      let filterType: keyof FilterOptions = fT as keyof FilterOptions;
      type filterKeyType = FilterOptions[typeof filterType];
      let filterKey: keyof filterKeyType = fK as keyof filterKeyType;

      if (!viewOptions.filtering[filterType]) {
        (viewOptions.filtering[filterType] as any) = {};
      }

      (viewOptions.filtering[filterType][filterKey] as any) = (element as HTMLInputElement).valueAsNumber;
    });

    viewOptions.sort = [
      form['sort-option-1'].value,
      form['sort-option-2'].value,
      form['sort-option-3'].value,
      form['sort-option-4'].value,
    ];

    viewOptions.isGroupingEnabled = form['group-option'].checked;
    viewOptions.modScore = form['score-option'].value;

    return viewOptions;
  }

  render() {
    const onSubmit = (e: React.MouseEvent<HTMLFormElement>) => {
      e.preventDefault();
      this.props.updateFilter(this.collectFilters(e.target as HTMLFormElement))
    };

    const cycleState = (e: React.MouseEvent<HTMLInputElement>): void => {
      let target: HTMLInputElement & EventTarget;
      target = e.currentTarget;
    
      target.value = String(target.valueAsNumber + 1);
      if (parseInt(target.value) > 1) {
        target.value = String(-1);
      }
      target.classList.remove('select', 'unselect');
      if ("1" === target.value) {
        target.classList.add('select');
      }
      if ("-1" === target.value) {
        target.classList.add('unselect');
      }
      this.props.updateFilter(this.collectFilters(target.form as HTMLFormElement))
    }
    
    return <form className={'mod-filters filter-form'} id={'mod-filters'} onSubmit={onSubmit}>
      <div className={'form-actions'}>
        <button type={'button'} onClick={this.resetFilters}>{this.props.t('filter.Reset')}</button>
      </div>
      {this.groupOption()}
      {this.slotFilter(cycleState)}
      {this.setFilter(cycleState)}
      {this.rarityFilter(cycleState)}
      {this.levelFilter(cycleState)}
      {this.tierFilter(cycleState)}
      {this.secondariesScoreTierFilter(cycleState)}
      {this.equippedFilter(cycleState)}
      {this.optimizerFilter(cycleState)}
      {this.primaryStatFilter(cycleState)}
      {this.secondaryStatFilter(cycleState)}
      {this.scoreOption()}
      {this.sortOption()}
      <div className={'form-actions'}>
        <button type={'button'} onClick={this.resetFilters}>{this.props.t(`filter.Reset`)}</button>
      </div>
    </form>;
  }
}

type Props = PropsFromRedux & OwnProps & WithTranslation<'explore-ui'>;
type PropsFromRedux = ConnectedProps<typeof connector>;

type OwnProps = {
}

const mapStateToProps = (state: IAppState) => ({
  modsViewOptions: state.modsViewOptions,
});

const mapDispatchToProps = (dispatch: Redux.Dispatch<Redux.AnyAction>) => ({
  updateFilter: (modsViewOptions: ModsViewOptions) => dispatch(changeModsViewOptions(modsViewOptions))
});

let connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(withTranslation('explore-ui')(ModFilter));
