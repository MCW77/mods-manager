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
import { IFlatBaseCharacter } from "../../domain/BaseCharacter";
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

const sortOptionMap = {
  "Stat-Potency %": "StatPotency",
  "Stat-Tenacity %": "StatTenacity",
  "Stat-Speed": "StatSpeed",
  "Stat-Health %": "StatHealthP",
  "Stat-Health": "StatHealth",
  "Stat-Protection %": "StatProtectionP",
  "Stat-Protection": "StatProtection",
  "Stat-Critical Chance %": "StatCritChance",
  "Stat-Offense %": "StatOffenseP",
  "Stat-Offense": "StatOffense",
  "Stat-Defense %": "StatDefenseP",
  "Stat-Defense": "StatDefense",
  "StatScore-Potency %": "StatScorePotency",
  "StatScore-Tenacity %": "StatScoreTenacity",
  "StatScore-Speed": "StatScoreSpeed",
  "StatScore-Health %": "StatScoreHealthP",
  "StatScore-Health": "StatScoreHealth",
  "StatScore-Protection %": "StatScoreProtectionP",
  "StatScore-Protection": "StatScoreProtection",
  "StatScore-Critical Chance %": "StatScoreCritChance",
  "StatScore-Offense %": "StatScoreOffenseP",
  "StatScore-Offense": "StatScoreOffense",
  "StatScore-Defense %": "StatScoreDefenseP",
  "StatScore-Defense": "StatScoreDefense",
  "ModScore-Pure secondaries": "ModScorePureSecondaries",
} as const;

class SortMod {
  get tier() {
    return this.mod.tier;
  }
  get level() {
    return this.mod.level;
  }
  get rarity() {
    return this.mod.pips;
  }
  get slot() {
    return this.mod.slot;
  }
  get set() {
    return this.mod.set;
  }
/*  
  get secondariesScore() {
    return this.mod.secondariesScore;
  }
*/  
  get rolls() {
    return this.mod.totalRolls;
  }
  get character() {
    const character: IFlatBaseCharacter | null =
      this.mod.characterID !== "null"
        ? SortMod.characters[this.mod.characterID as CharacterNames]
        : null;
    return character ? character!.playerValues.galacticPower : 0;
  }
  get characterName() {
    const character: IFlatBaseCharacter | null = this.mod.characterID
      ? SortMod.characters[this.mod.characterID as CharacterNames]
      : null;
    return character ? character.baseID : "";
  }
  get offensiveScore() {
    return this.mod.offensiveScore;
  }
  get StatOffense() {
    return this.getSecondary("Offense");
  }
  get StatOffenseP() {
    return this.getSecondary("Offense %");
  }
  get StatCritChanceP() {
    return this.getSecondary("Critical Chance %");
  }
  get StatDefense() {
    return this.getSecondary("Defense");
  }
  get StatDefenseP() {
    return this.getSecondary("Defense %");
  }
  get StatSpeed() {
    return this.getSecondary("Speed");
  }
  get StatTenacityP() {
    return this.getSecondary("Tenacity %");
  }
  get StatPotencyP() {
    return this.getSecondary("Potency %");
  }
  get StatHealthP() {
    return this.getSecondary("Health %");
  }
  get StatHealth() {
    return this.getSecondary("Health");
  }
  get StatProtectionP() {
    return this.getSecondary("Protection %");
  }
  get StatProtection() {
    return this.getSecondary("Protection");
  }

  get StatScoreOffense() {
    return this.getStatScore("Offense");
  }
  get StatScoreOffenseP() {
    return this.getStatScore("Offense %");
  }
  get StatScoreCritChanceP() {
    return this.getStatScore("Critical Chance %");
  }
  get StatScoreDefense() {
    return this.getStatScore("Defense");
  }
  get StatScoreDefenseP() {
    return this.getStatScore("Defense %");
  }
  get StatScoreSpeed() {
    return this.getStatScore("Speed");
  }
  get StatScoreTenacityP() {
    return this.getStatScore("Tenacity %");
  }
  get StatScorePotencyP() {
    return this.getStatScore("Potency %");
  }
  get StatScoreHealthP() {
    return this.getStatScore("Health %");
  }
  get StatScoreHealth() {
    return this.getStatScore("Health");
  }
  get StatScoreProtectionP() {
    return this.getStatScore("Protection %");
  }
  get StatScoreProtection() {
    return this.getStatScore("Protection");
  }

  static characters: Characters;

  constructor(public mod: Mod) {}

  getSecondary(type: string): number {
    const stat: SecondaryStats.SecondaryStat | undefined =
      this.mod.secondaryStats.find((stat) => stat.type === type);
    return stat ? stat.value : 0;
  }

  getStatScore(type: string): number {
    const stat: SecondaryStats.SecondaryStat | undefined =
      this.mod.secondaryStats.find((stat) => stat.type === type);
    return stat ? stat.score.value.toNumber() : 0;
  }

  getModScore(scoreName: string): number {
    return this.mod.scores[scoreName] ?? 0;
  }
}

for (let modScore of modScores) {
  Object.defineProperty(SortMod.prototype, "ModScore" + modScore.name, {
    get: () => {
      return (this! as SortMod).mod.scores[modScore.name] ?? 0;
    },
  });
}

for (let stat of SecondaryStats.SecondaryStat.statNames) {
  Object.defineProperty(
    SortMod.prototype,
    "StatScore" + stat.replace(" %", "P"),
    {
      get: () => {
        const foundStat: SecondaryStats.SecondaryStat | undefined = (
          this! as SortMod
        ).mod.secondaryStats.find(
          (traversedStat) => traversedStat.type === stat
        );
        return foundStat ? foundStat.score.value.toNumber() : 0;
      },
    }
  );
}

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
        const assignedCharacter = this.props.modAssignments[mod.id]
          ? this.props.characters[this.props.modAssignments[mod.id]]
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
        .map(([option]) => (isNaN(option) ? option : +option));
      unselectedOptions[type] = Object.entries(values)
        .filter(([option, value]) => -1 === value)
        .map(([option]) => (isNaN(option) ? option : +option));
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
    if (this.selectedOptions.secondary.length > 0 && !this.selectedOptions.secondary.every(secondary => mod.secondaryStats.some(modSecondary => modSecondary === secondary)))
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
    if (this.unselectedOptions.secondary.length > 0 && !this.unselectedOptions.secondary.every(secondary => mod.secondaryStats.some(modSecondary => modSecondary !== secondary)))
      return false;
    if (this.unselectedOptions.optimizer.length > 0 && mod.isAssigned())
      return false;
    return true;
  };
    
  filterMods(mods: Mod[]) {
    return mods.filter(this.selectedOptionsFilter).filter(this.unselectedOptionsFilter)
  }

  filterGroupedMods(groupedMods: Dictionary<Mod[]>) {
    let filteredMods = mapValues(groupedMods, (mods: Mod[]) => 
      this.filterMods(mods)
    ) as Dictionary<Mod[]>;
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

  sortGroupedMods(groupedMods: Dictionary<Mod[]>) {
    return mapValues(groupedMods, (mods: Mod[]) => 
      orderBy(
        mods,
        this.sortOptions,
        this.sortOptions.map((opt) => "desc")
      )
    ) as Dictionary<Mod[]>
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


/*
const filterSelected = function(mods: Mod[], options: FilterOptions) {
  return mods.filter(selectedOptionsFilter).filter()
}
*/

/*
const filterUnselected = function(mods: Mod[], options: FilterOptions) {
  const unselectedOptionsFilter = (mod: Mod) => {
    let result = true;
    if (options.slot.length > 0) {
      result = options.slot.includes(mod.slot) ? result : false;
    }
    if (options.set.length > 0) {
      result = options.set.includes(mod.set) ? result : false;
    }
    if (options.rarity.length > 0) {
      result = options.rarity.includes(mod.pips) ? result : false;
    }
    if (options.tier.length > 0) {
      result = options.tier.includes(mod.tier) ? result : false;
    }
    if (options.level.length > 0) {
      result = options.level.includes(mod.level) ? result : false;
    }
    if (options.equipped.length > 0) {
      result = !!mod.characterID ? result : false;
    }
    if (options.primary.length > 0) {
      result = options.primary.includes(mod.primaryStat.type)
        ? result
        : false;
    }
    return result;
  };
  
  return mods.filter(unselectedOptionsFilter)
}
*/
const getFilteredMods = memoizeOne(
  (
    mods: Mod[],
    filter: FilterSettings,
    characters: Characters,
    modAssignments: IModSuggestion[]
  ) => {
    let filteredMods: Mod[] = mods.slice();

    let modsFilter = new ModsFilter(filter);
    filteredMods = modsFilter.filterMods(filteredMods);

// #region 

    if (selectedOptions.secondary.length) {
      filteredMods = filteredMods.filter((mod) =>
        mod.secondaryStats.some((stat) =>
          selectedOptions.secondary.includes(stat.type)
        )
      );
    }

    if (unselectedOptions.secondary.length) {
      filteredMods = filteredMods.filter((mod) =>
        mod.secondaryStats.every(
          (stat) => !unselectedOptions.secondary.includes(stat.type)
        )
      );
    }

    if (1 === selectedOptions.optimizer.length) {
      switch (selectedOptions.optimizer[0]) {
        case "assigned":
          filteredMods = filteredMods.filter((mod) =>
            Object.keys(modAssignments).includes(mod.id)
          );
          break;
        case "unassigned":
          filteredMods = filteredMods.filter(
            (mod) => !Object.keys(modAssignments).includes(mod.id)
          );
          break;
        default:
        // Do nothing
      }
    }

    if (1 === unselectedOptions.optimizer.length) {
      switch (unselectedOptions.optimizer[0]) {
        case "assigned":
          filteredMods = filteredMods.filter(
            (mod) => !Object.keys(modAssignments).includes(mod.id)
          );
          break;
        case "unassigned":
          filteredMods = filteredMods.filter((mod) =>
            Object.keys(modAssignments).includes(mod.id)
          );
          break;
        default:
        // Do nothing
      }
    }

// #endregion

    SortMod.characters = characters;

    let sortOptions = filter.sort;
    sortOptions = sortOptions.filter(option => option !== '');
    if (!sortOptions.includes("character")) {
      sortOptions.push("character");
      sortOptions.push("characterID");
    }
    sortOptions = sortOptions.map((option) => {
      const temp = sortOptionMap[option];
      return temp ? temp : option;
    });
    
    let groupedMods = groupBy(
      filteredMods,
      (mod: Mod) => mod.slot + "-" + mod["set"] + "-" + mod.primaryStat.type
    );

    const groupedAndSortedMods = mapValues(groupedMods, (mods: Mod[]) =>
      orderBy(
        mods,
        sortOptions,
        sortOptions.map((opt) => "desc")
      )
    );

    const result: [{ [key: string]: Mod[] }, number] = [
      groupedAndSortedMods,
      filteredMods.length,
    ];
    return result;
  }
);

const mapStateToProps = (state: IAppState) => {
  const profile = state.profile;
  if (profile) {
    const modAssignments: IModSuggestion[] =
      profile.modAssignments && profile.modAssignments.filter
        ? profile.modAssignments
            .filter((x) => null !== x)
            .reduce((acc, { id: characterID, assignedMods: modIds }) => {
              const updatedAssignments = { ...acc };
              modIds.forEach((id) => (updatedAssignments[id] = characterID));
              return updatedAssignments;
            }, {} as IModSuggestion)
        : [{} as IModSuggestion];
        
    let modsFilter = new ModsFilter(state.modsFilter);
    const [mods, shownMods] = modsFilter.applyFilterSettings(profile.mods);
    /*
    const [mods, shownMods] = getFilteredMods(
      profile.mods,
      state.modsFilter,
      profile.characters,
      modAssignments
    );
    */
    return {
      characters: profile.characters,
      displayedMods: mods,
      modAssignments: modAssignments,
      modCount: profile.mods.length,
      displayedModsCount: shownMods,
    };
  } else {
    return {
      characters: {} as Characters,
      displayedMods: {},
      modAssignments: {} as IModSuggestion[],
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
