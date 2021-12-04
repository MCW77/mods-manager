import React from "react";

import { hideModal, showModal } from "../../state/actions/app";
import { deleteMods } from "../../state/actions/storage";
import memoizeOne from "memoize-one";
import ModDetail from "../../components/ModDetail/ModDetail";
import ModFilter from "../../components/ModFilter/ModFilter";

import "./ExploreView.css";
import { connect, ConnectedProps } from "react-redux";
import Sidebar from "../../components/Sidebar/Sidebar";

import { Mod } from "../../domain/Mod";
import { FilterSettings } from "../../domain/modules/FilterSettings";
import { Characters } from "../../domain/Character";
import { IModSuggestion } from "../../domain/PlayerProfile";
import { SecondaryStats } from "../../domain/Stats";
import { orderBy, groupBy, mapValues, forEach } from "lodash-es";
import { Dictionary } from "lodash";
import { IAppState } from "state/storage";
import { BaseCharacter } from "../../domain/BaseCharacter";
import { OptimizerSettings } from "../../domain/OptimizerSettings";
import { modScores } from "../../domain/constants/ModScoresConsts";
import {
  EquippedSettings,
  FilterKeys,
  LevelSettings,
  PrimarySettings,
  RaritySettings,
  SecondariesScoreTierSettings,
  SecondarySettings,
  SetSettings,
  SlotSettings,
  TierSettings,
} from "domain/types/FilterSettingsTypes";
import { CharacterNames } from "constants/characterSettings";
import { DOMContent } from "components/types";
import { ThunkDispatch } from "state/reducers/modsOptimizer";
import { withTranslation, WithTranslation } from "react-i18next";

class ExploreView extends React.PureComponent<Props> {
  modGroupToggle = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const cl = (e.currentTarget as HTMLDivElement).nextElementSibling
      ?.classList;
    if (cl) {
      cl.toggle("collapsed");
    }
  };

  render() {
    const modsElement: HTMLDivElement = document.getElementById(
      "mods"
    ) as HTMLDivElement;

    const modElements = (mods: Mod[]) => {
      return mods.map((mod) => {
        const assignedCharacter = this.props.assignedMods[mod.id]
          ? this.props.characters[this.props.assignedMods[mod.id]]
          : null;
        return (
          <ModDetail
            key={mod.id}
            mod={mod}
            assignedCharacter={assignedCharacter}
            showAssigned
          />
        );
      });
    };

    let groupedMods = [];
    for (let key in this.props.displayedMods) {
      if (this.props.displayedMods[key].length > 0)
      groupedMods.push(this.props.displayedMods[key]);
    }
    groupedMods = groupedMods.sort(
      (mods1: Mod[], mods2: Mod[]) => mods1.length - mods2.length
    );

    const modGroups = groupedMods.map((mods: Mod[]) => {
      return (
        <div className="modgroup" key={`modgroup-${mods[0].slot}-${mods[0].set}-${mods[0].primaryStat.getDisplayType()}`}>
          <div className="modgroupheader" onClick={this.modGroupToggle}>
            <span>{this.props.t(`domain:Slot`)}: {this.props.t(`domain:slots.name.${mods[0].slot}`)}</span>
            <span>{this.props.t(`domain:Set`)}: {this.props.t(`domain:stats.${mods[0].set}`)}</span>
            <span>{this.props.t(`domain:Primary`)}: {this.props.t(`domain:stats.${mods[0].primaryStat.getDisplayType()}`)}</span>
            <span> ({this.props.t(`domain:ModWithCount`, {count: mods.length})})</span>
          </div>
          <div className="modgroupmods">{modElements(mods)}</div>
        </div>
      );
    });

    return [
      <Sidebar key={"sidebar"} content={ExploreView.sidebar()} />,
      <div id="mods" key={"mods"}>
        <div id="modsheader">
          <div>
            <h3>
              {this.props.t(`explore-ui:ModsShown`, {'actual': this.props.displayedModsCount, 'max': this.props.modCount})}
              &nbsp;
              <button
                className={"small red"}
                onClick={() => {
                  this.props.showModal(this.deleteModsModal());
                }}
              >
                {this.props.t(`explore-ui:DeleteButton`)}
              </button>
            </h3>
          </div>
          <div id="modgroupsactions">
            <button
              className="small"
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                forEach(
                  modsElement.getElementsByClassName("modgroupmods"),
                  (modgroup) => {
                    modgroup.classList.remove("collapsed");
                  }
                );
              }}
            >
              {this.props.t('explore-ui:Expand')}
            </button>
            <button
              className="small"
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                forEach(
                  modsElement.getElementsByClassName("modgroupmods"),
                  (modgroup) => {
                    modgroup.classList.add("collapsed");
                  }
                );
              }}
            >
              {this.props.t('explore-ui:Collapse')}
            </button>
          </div>
        </div>
        <div id="modgroups">{modGroups}</div>
      </div>,
    ];
  }

  /**
   * Render the "Are you sure?" modal for deleting all displayed mods
   * @returns {*}
   */
  deleteModsModal() {
    return (
      <div>
        <h2>{this.props.t(`explore-ui:DeleteButton`)}</h2>
        <p>
          {this.props.t(`explore-ui:DeleteAlt1`)}
          <br />
          {this.props.t(`explore-ui:DeleteAlt2`)}
        </p>
        <div className={"actions"}>
          <button
            type={"button"}
            onClick={() => {
              this.props.hideModal();
            }}
          >
            No
          </button>
          <button
            type={"button"}
            onClick={() => {
              this.props.deleteMods(this.props.displayedMods);
            }}
            className={"red"}
          >
            Yes, Delete Mods
          </button>
        </div>
      </div>
    );
  }

  /**
   * Render the sidebar content
   * @returns {*}
   */
  static sidebar() {
    return (
      <div className={"filters"} key={"filters"}>
        <ModFilter />
      </div>
    );
  }
}

type AssignedMods = {
  [key: string]: CharacterNames
}
type FilterOptions = {
  [key in keyof FilterSettings]: any[]
};

class ModsFilter {

  selectedOptions: FilterOptions;
  unselectedOptions: FilterOptions;

  sortOptions: string[];
  isGroupingEnabled: boolean;

  constructor(filterSettings: FilterSettings) {
    Mod.setupAccessors();
    [this.selectedOptions, this.unselectedOptions] = this.extractSelectedAndUnselectedOptions(filterSettings);    
    
    this.isGroupingEnabled = filterSettings.isGroupingEnabled;

    this.sortOptions = filterSettings.sort;
    this.sortOptions = this.sortOptions.filter((option) => option !== '');
    
    if (!this.sortOptions.includes("character")) {
      this.sortOptions.push("character");
      this.sortOptions.push("characterID");
    }
  }

  extractSelectedAndUnselectedOptions(filters: FilterSettings)
  {
    const selectedOptions: { [key in FilterKeys]: any[] } = {
      slot: [],
      set: [],
      rarity: [],
      tier: [],
      level: [],
      equipped: [],
      primary: [],
      secondary: [],
      optimizer: [],
      secondariesscoretier: [],
    };
    const unselectedOptions: { [key in FilterKeys]: any[] } = {
      slot: [],
      set: [],
      rarity: [],
      tier: [],
      level: [],
      equipped: [],
      primary: [],
      secondary: [],
      optimizer: [],
      secondariesscoretier: [],
    };
  
    // #region CombinedSettings
    type CombinedSettings =
      | SlotSettings
      | SetSettings
      | RaritySettings
      | TierSettings
      | LevelSettings
      | PrimarySettings
      | SecondarySettings
      | EquippedSettings
      | OptimizerSettings
      | SecondariesScoreTierSettings;
    // #endregion
  
    type FilterKV = [FilterKeys, CombinedSettings];
  
    (Object.entries(filters) as FilterKV[])
    .forEach(([type, values]) => {
      selectedOptions[type] = Object.entries(values)
        .filter(([option, value]) => 1 === value)
        .map(([option]) => (isNaN(Number(option)) ? option : +option));
      unselectedOptions[type] = Object.entries(values)
        .filter(([option, value]) => -1 === value)
        .map(([option]) => (isNaN(Number(option)) ? option : +option));
    });
  
    return [selectedOptions, unselectedOptions];
  }
   
  selectedOptionsFilter = (mod: Mod) => {
    if (this.selectedOptions.slot.length > 0 && !this.selectedOptions.slot.every(slot => mod.slot === slot))
      return false;
    if (this.selectedOptions.set.length > 0 && !this.selectedOptions.set.every(set => mod.set === set))
      return false;
    if (this.selectedOptions.rarity.length > 0 && !this.selectedOptions.rarity.every(pips => mod.pips === pips))
      return false;
    if (this.selectedOptions.tier.length > 0 && !this.selectedOptions.tier.every(tier => mod.tier === tier))
      return false;
    if (this.selectedOptions.level.length > 0 && !this.selectedOptions.level.every(level => mod.level === level))
      return false;
    if (this.selectedOptions.equipped.length > 0 && mod.characterID === 'null')
      return false;
    if (this.selectedOptions.primary.length > 0 && !this.selectedOptions.primary.every(primary => mod.primaryStat.type === primary))
      return false;
    if (this.selectedOptions.secondary.length > 0 && !this.selectedOptions.secondary.every(secondary => mod.secondaryStats.some(modSecondary => modSecondary.type === secondary)))
      return false;
    if (this.selectedOptions.optimizer.length > 0 && !mod.isAssigned())
      return false;
    return true;
  };

  unselectedOptionsFilter = (mod: Mod) => {
    if (this.unselectedOptions.slot.length > 0 && !this.unselectedOptions.slot.every(slot => mod.slot !== slot))
      return false;
    if (this.unselectedOptions.set.length > 0 && !this.unselectedOptions.set.every(set => mod.set !== set))
      return false;
    if (this.unselectedOptions.rarity.length > 0 && !this.unselectedOptions.rarity.every(pips => mod.pips !== pips))
      return false;
    if (this.unselectedOptions.tier.length > 0 && !this.unselectedOptions.tier.every(tier => mod.tier !== tier))
      return false;
    if (this.unselectedOptions.level.length > 0 && !this.unselectedOptions.level.every(level => mod.level !== level))
      return false;
    if (this.unselectedOptions.equipped.length > 0 && mod.characterID !== 'null')
      return false;
    if (this.unselectedOptions.primary.length > 0 && !this.unselectedOptions.primary.every(primary => mod.primaryStat.type !== primary))
      return false;
    if (this.unselectedOptions.secondary.length > 0 && !this.unselectedOptions.secondary.every(secondary => mod.secondaryStats.every(modSecondary => modSecondary.type !== secondary)))
      return false;
    if (this.unselectedOptions.optimizer.length > 0 && mod.isAssigned())
      return false;
    return true;
  };
    
  filterMods(mods: Mod[]) {
    return mods.filter(this.selectedOptionsFilter).filter(this.unselectedOptionsFilter)
  }

  filterGroupedMods(groupedMods: Dictionary<Mod[]>): Dictionary<Mod[]> {
    let filteredMods: Dictionary<Mod[]> = mapValues(groupedMods, (mods: Mod[]) => 
      this.filterMods(mods)
    );
    for (let group in filteredMods) {
      if (filteredMods[group].length === 0)
      delete filteredMods[group]  
    }
    return filteredMods;
  }

  groupMods(mods: Mod[]) {
    const ungroupedMods = memoizeOne((mods: Mod[]) => {
      return {
        all: mods
      }
    });

    const groupedMods = memoizeOne((mods: Mod[]) => {
      return groupBy(
        mods,
        (mod: Mod) => mod.slot + "-" + mod["set"] + "-" + mod.primaryStat.type
      );
    });

    if (this.isGroupingEnabled)
      return groupedMods(mods)
    else
      return ungroupedMods(mods); 
  }

  sortGroupedMods(groupedMods: Dictionary<Mod[]>): Dictionary<Mod[]> {
    return mapValues(groupedMods, (mods: Mod[]) => 
      orderBy(
        mods,
        this.sortOptions,
        this.sortOptions.map((opt) => "desc")
      )
    )
  }

  getGroupedModsCount(groupedMods: Dictionary<Mod[]>) {
    return Object.entries(groupedMods).reduce((acc, [group, mods]) => {
      return acc + mods.length;
    }, 0)
  }

  applyFilterSettings(mods: Mod[]): [Dictionary<Mod[]>, number] {
    let groupedMods = this.groupMods(mods);
    groupedMods = this.filterGroupedMods(groupedMods);
    groupedMods = this.sortGroupedMods(groupedMods);
    return [groupedMods, this.getGroupedModsCount(groupedMods)];
  }
}

const mapStateToProps = (state: IAppState) => {
  const profile = state.profile;
  if (profile) {
    const assignedMods: AssignedMods =
      profile.modAssignments && profile.modAssignments.filter
        ? profile.modAssignments
            .filter((x) => null !== x)
            .reduce((acc, { id: characterID, assignedMods: modIds }) => {
              const updatedAssignments = { ...acc };
              modIds.forEach((id) => (updatedAssignments[id] = characterID));
              return updatedAssignments;
            }, {} as AssignedMods)
        : {} as AssignedMods;
        
    let modsFilter = new ModsFilter(state.modsFilter);
    const [mods, shownMods] = modsFilter.applyFilterSettings(profile.mods);

    return {
      characters: profile.characters,
      displayedMods: mods,
      assignedMods: assignedMods,
      modCount: profile.mods.length,
      displayedModsCount: shownMods,
    };
  } else {
    return {
      characters: {} as Characters,
      displayedMods: {},
      assignedMods: {} as AssignedMods,
      modCount: 0,
      displayedModsCount: 0,
    };
  }
};

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  showModal: (content: DOMContent) => dispatch(showModal("", content)),
  hideModal: () => dispatch(hideModal()),
  deleteMods: (mods: Mod[]) => {
    dispatch(deleteMods(mods));
    dispatch(hideModal());
  },
});

type Props = PropsFromRedux & OwnProps & WithTranslation<['domain', 'explore-ui']>;
type PropsFromRedux = ConnectedProps<typeof connector>;
type OwnProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(withTranslation(['domain', 'explore-ui'])(ExploreView));
