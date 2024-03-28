// react
import React from 'react';
import { connect, ConnectedProps } from "react-redux";
import { ThunkDispatch } from '#/state/reducers/modsOptimizer';

// styles
import './Review.css';

// utils
import { flatten, mapValues, uniq } from "lodash-es";
import copyToClipboard from "#/utils/clipboard";
import collectByKey from "#/utils/collectByKey";
import { groupBy } from "#/utils/groupBy";
import groupByKey from "#/utils/groupByKey";

// state
import { IAppState } from '#/state/storage';

import { dialog$ } from "#/modules/dialog/state/dialog";

// modules
import { Data } from '#/state/modules/data';
import { Review as ReviewModule } from '#/state/modules/review';
import { Storage } from '#/state/modules/storage';

// domain
import { CharacterNames } from '#/constants/characterSettings';
import type * as ModTypes from "#/domain/types/ModTypes";

import * as Character from '#/domain/Character';
import { Mod } from '#/domain/Mod';
import { ModAssignment, ModAssignments } from "#/domain/ModAssignment";
import { ModListFilter } from '#/domain/ModListFilter';
import { ModLoadout } from "#/domain/ModLoadout";
import { ModsByCharacterNames } from '#/domain/ModsByCharacterNames';
import  * as OptimizationPlan from "#/domain/OptimizationPlan";

// components
import { Arrow } from "#/components/Arrow/Arrow";
import { CharacterAvatar } from "#/components/CharacterAvatar/CharacterAvatar";
import { Credits } from "#/components/Credits/Credits";
import { DefaultCollapsibleCard } from '#/components/DefaultCollapsibleCard';
import { ModDetail } from "#/components/ModDetail/ModDetail";
import { ModLoadoutDetail } from "#/components/ModLoadoutDetail/ModLoadoutDetail";
import { ModLoadoutView } from "#/components/ModLoadoutView/ModLoadoutView";
import { Button } from '#ui/button';
import { Label } from '#ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "#ui/select";
import { Switch } from '#ui/switch';


interface HUModsProfile {
  id: CharacterNames,
  modIds: string[],
  target: string,
}

type HUModsProfiles = HUModsProfile[];
export interface HUModsMoveProfile {
  units: HUModsProfiles;
}

export interface HUProfileCreationData {
  set: {
    category: string,
    name: string,
    units: HUModsProfiles,
  }
}

const sortOptions = {
  'currentCharacter': 'currentCharacter',
  'assignedCharacter': 'assignedCharacter'
};

const viewOptions = {
  'list': 'list',
  'sets': 'sets'
};

const showOptions = {
  'upgrades': 'upgrades',
  'change': 'change',
  'all': 'all'
};

// A map from number of pips that a mod has to the cost to remove it
const modRemovalCosts = {
  1: 550,
  2: 1050,
  3: 1900,
  4: 3000,
  5: 4750,
  6: 8000
};

// A map from number of pips to a map from current mod level to the total cost to upgrade the mod to level 15
const modUpgradeCosts: {
  [key in ModTypes.Pips]: {
    [key2 in ModTypes.Levels]: number
  }
} = {
  6: {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    10: 0,
    11: 0,
    12: 0,
    13: 0,
    14: 0,
    15: 0
  },
  5: {
    1: 248400,
    2: 244950,
    3: 241500,
    4: 238050,
    5: 234600,
    6: 229950,
    7: 224300,
    8: 218500,
    9: 210500,
    10: 200150,
    11: 189800,
    12: 162200,
    13: 126550,
    14: 90900,
    15: 0
  },
  4: {
    1: 128700,
    2: 126900,
    3: 124200,
    4: 121500,
    5: 118800,
    6: 116100,
    7: 113400,
    8: 110700,
    9: 106200,
    10: 100800,
    11: 95400,
    12: 81000,
    13: 64800,
    14: 46800,
    15: 0
  },
  3: {
    1: 73200,
    2: 72000,
    3: 70800,
    4: 69600,
    5: 67800,
    6: 66000,
    7: 64200,
    8: 62400,
    9: 60000,
    10: 57000,
    11: 54000,
    12: 45600,
    13: 35400,
    14: 24000,
    15: 0
  },
  2: {
    1: 28800,
    2: 28050,
    3: 27300,
    4: 26550,
    5: 25800,
    6: 24675,
    7: 23550,
    8: 22425,
    9: 21300,
    10: 19800,
    11: 18300,
    12: 16500,
    13: 12700,
    14: 8200,
    15: 0
  },
  1: {
    1: 13400,
    2: 13050,
    3: 12700,
    4: 12350,
    5: 12000,
    6: 11475,
    7: 10950,
    8: 10425,
    9: 9900,
    10: 9200,
    11: 8500,
    12: 7625,
    13: 5875,
    14: 3775,
    15: 0
  }
};

function formatNumber(num: number) {
  return num.toLocaleString(navigator.language, { 'useGrouping': true });
}

class Review extends React.PureComponent<Props> {
  generateHotUtilsProfile() {
    const assignedMods = this.props.assignedMods
      .filter(x => null !== x)
      .filter(({ id }) => this.props.characters[id].playerValues.level >= 50)
      .map(({ id, assignedMods, target }) => ({
        id: id,
        modIds: assignedMods,
        target: target.name
      }));

    const lockedMods = (Object.entries(this.props.currentModsByCharacter) as [CharacterNames, Mod[]][])
      .filter(([id]) => this.props.characters[id].optimizerSettings.isLocked)
      .map(([id, mods]) => ({
        id: id,
        modIds: mods.map(({ id }) => id),
        target: 'locked'
      }));

    return assignedMods.concat(lockedMods);
  }

  render() {
    let modRows;

    switch (this.props.filter.view) {
      case viewOptions.list:
        modRows = this.listView(this.props.displayedMods);
        break;
      default:
        modRows = this.setsView(this.props.displayedMods);
    }

    let reviewContent;

    if (0 === this.props.numMovingMods) {
      if (0 === this.props.displayedMods.length) {
        reviewContent = <div>
          <h2>You don't have any mods left to move! Great job!</h2>
          <h3>Don't forget to assign mods to all your pilots!</h3>
        </div>;
      } else {
        reviewContent = <div className={'flex flex-col min-h-min'}>
          {modRows}
        </div>;
      }
    } else {
      if (0 === this.props.displayedMods.length) {
        reviewContent = <h3>
          No more mods to move under that filter. Try a different filter now!
        </h3>;
      } else {
        reviewContent = <div className={'flex flex-col min-h-min'}>
          {modRows}
        </div>;
      }
    }

    return <div className={'review flex flex-col flex-grow-1 overflow-y-auto'}>
      <div className={'flex flex-col justify-around items-stretch p-y-2 min-h-min'}>
        <div className="flex flex-wrap justify-around items-stretch p-y-2">
            {this.displayWidget()}
            {this.actionsWidget()}
            {this.summaryWidget()}
          </div>
        <div className="overflow-y-auto">
          {reviewContent}
        </div>
      </div>
    </div>;
  }

  actionsWidget() {
    return <DefaultCollapsibleCard title="Actions">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Button
            type={'button'}
            size={'sm'}
            onClick={() => dialog$.show(this.reviewModal())}
          >
            Show Summary
          </Button>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="">I don't like these results...</Label>
          <Button
            type={'button'}
            onClick={this.props.edit}
          >
            Change my selection
          </Button>
        </div>
        <div id="Hotutils-Actions" className="flex flex-col gap-2">
          <Label htmlFor="Hotutils-Actions">HotUtils</Label>
          <Button
            type={'button'}
            disabled={!(this.props.hotUtilsSubscription && this.props.hotUtilsSessionId)}
            onClick={() => {
              if (this.props.hotUtilsSubscription && this.props.hotUtilsSessionId) {
                dialog$.show(this.hotUtilsCreateProfileModal());
              }
            }}
          >
            Create Loadout
          </Button>
          <Button
            type={'button'}
            disabled={!(this.props.hotUtilsSubscription && this.props.hotUtilsSessionId)}
            onClick={() => {
              if (this.props.hotUtilsSubscription && this.props.hotUtilsSessionId) {
                dialog$.show(this.hotUtilsMoveModsModal());
              }
            }}
          >
            Move mods in-game
          </Button>
        </div>
      </div>
    </DefaultCollapsibleCard>
  }

  displayWidget() {
    const filter = this.props.filter;
    const global = "grid gap-3 md:grid-cols-[[labels]auto_[controls]1fr] grid-auto-flow-row items-center justify-items-start" as const;
    const labelCSS = "grid-col-[labels] grid-row-auto" as const;
    const inputCSS = "grid-col-[controls] grid-row-auto" as const;

    return <DefaultCollapsibleCard
      title="Display"
    >
      <div className={global}>
        <Label className={labelCSS} htmlFor="sort-options"
        >
          Group by character:
        </Label>
        <div
          className={inputCSS + " flex gap-2 items-center"}
          id="sort-options"
        >
          <Label htmlFor="sort-options-value">current</Label>
          <Switch
          className="mr-2 ml-2"
            id={'sort-options-value'}
            checked={filter.sort === sortOptions.assignedCharacter}
            onCheckedChange={checked => this.props.changeFilter(Object.assign({}, filter, { sort: checked ? sortOptions.assignedCharacter : sortOptions.currentCharacter }))}
          >
          </Switch>
          <Label className={labelCSS} htmlFor="sort-options-value">assigned</Label>
        </div>
        <Label className={labelCSS} htmlFor="view-options">Show mods as:</Label>
        <div
          className={inputCSS + " flex gap-2 items-center"}
          id="view-options"
        >
          <Label htmlFor="view-options-value">{viewOptions.sets}</Label>
          <Switch
            id={'view-options-value'}
            checked={filter.view === viewOptions.list}
            onCheckedChange={checked => this.props.changeFilter(Object.assign({}, filter, { view: checked ? viewOptions.list : viewOptions.sets }))}
          >
          </Switch>
          <Label htmlFor="view-options-value">{viewOptions.list}</Label>
        </div>
        <Label className={labelCSS} htmlFor={'show'}>Show me:</Label>
        <Select
          value={filter.show}
          onValueChange={value => this.props.changeFilter(Object.assign({}, filter, { show: value }))}
        >
          <SelectTrigger
            className={inputCSS}
            id={'show'}
          >
            <SelectValue></SelectValue>
          </SelectTrigger>
          <SelectContent className={"max-h-[50%]"}>
            <SelectGroup>
              <SelectItem value={showOptions.all}>All assignments</SelectItem>
              <SelectItem value={showOptions.change}>Changing characters</SelectItem>
              <SelectItem value={showOptions.upgrades}>Mod upgrades</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Label htmlFor={'tag'}>Show characters by tag:</Label>
        <Select
          value={filter.tag}
          onValueChange={value => this.props.changeFilter(Object.assign({}, filter, { tag: value }))}
        >
          <SelectTrigger
            className={inputCSS}
            id={'tag'}
          >
            <SelectValue></SelectValue>
          </SelectTrigger>
          <SelectContent className={"max-h-[50%]"}>
            <SelectGroup>
              <SelectItem value={'All'}>All</SelectItem>
              {this.props.tags.map(tag => <SelectItem value={tag} key={tag}>{tag}</SelectItem>)}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </DefaultCollapsibleCard>
  }

  summaryWidget() {
    const valueChange = 100 * (this.props.newSetValue - this.props.currentSetValue) / this.props.currentSetValue;

    return <DefaultCollapsibleCard
      className=""
      title="Summary"
    >
      <div className="prose prose-sm text-sm">
      <h4>Costs</h4>
      <p>
        <span>Reassigning {this.props.numMovingMods} mods</span><br />
        <span>Your mods will cost {formatNumber(this.props.modRemovalCost)} <Credits /> to move,</span><br />
        <span>and an additional {formatNumber(this.props.modUpgradeCost)} <Credits /> to level up to 15.</span>
      </p>
      <h4>Set Value</h4>
      <p>
        <span>Old set value sum: {formatNumber(Number(this.props.currentSetValue.toFixed(2)))}</span><br />
        <span>New set value sum: {formatNumber(Number(this.props.newSetValue.toFixed(2)))}</span><br />
        <span>Overall change: <span className={valueChange > 0 ? 'increase' : valueChange < 0 ? 'decrease' : ''}>
          {formatNumber(Number(valueChange.toFixed(2)))}%
          </span>
        </span>
      </p>
      </div>
    </DefaultCollapsibleCard>
  }

  /**
   * Convert a list of displayed mods into the renderable elements to display them as a list of individual mods
   * @param displayedMods {Array<Object>}
   * @returns {Array<*>}
   */
  listView(displayedMods: ModAssignments) {
    let individualMods: {
      id: CharacterNames,
      mod: Mod,
      target: OptimizationPlan.OptimizationPlan,
    }[] = flatten(displayedMods.map(({ id, target, assignedMods }) =>
      assignedMods.map(mod => ({ id: id, target: target, mod: mod }))
    ));

    if (sortOptions.currentCharacter === this.props.filter.sort) {
      individualMods.sort(({ mod: leftMod }, { mod: rightMod }) => {
        const leftCharacter = leftMod.characterID !== 'null' ? this.props.characters[leftMod.characterID] : null;
        const rightCharacter = rightMod.characterID !== 'null' ? this.props.characters[rightMod.characterID] : null;

        if (!leftCharacter) {
          return -1;
        } else if (!rightCharacter) {
          return 1;
        } else {
          return Character.compareGP(leftCharacter, rightCharacter) || ModLoadout.slotSort(leftMod, rightMod);
        }
      });

      if (this.props.filter.tag !== 'All') {
        individualMods = individualMods.filter(({ mod }) => {
          let tags: string[];
          if (mod.characterID === 'null') {
            tags = [];
          } else {
            tags = this.props.baseCharacters[mod.characterID].categories;
          }
          return tags.includes(this.props.filter.tag);
        });
      }
    } else if (this.props.filter.tag !== 'All') {
      individualMods = individualMods.filter(({ id, mod }) => {
        const tags = this.props.baseCharacters[id] ? this.props.baseCharacters[id].categories : [];
        return tags.includes(this.props.filter.tag);
      });
    }


    return individualMods.map(({ id: characterID, target, mod }) => {
      const character = this.props.characters[characterID];

      return <div className={'mod-row individual'} key={mod.id}>
        <ModDetail mod={mod} assignedCharacter={character} assignedTarget={target} />
        <div className={'character-id'}>
          <Arrow />
          <CharacterAvatar character={character} />
          <h3>
            {this.props.baseCharacters[character.baseID] ?
              this.props.baseCharacters[character.baseID].name :
              character.baseID}
          </h3>
          <h4>{target.name}</h4>
        </div>
        <div className={'actions'}>
          <Button
            type={'button'}
            onClick={this.props.unequipMod.bind(this, mod.id)}
          >
            I removed this mod
          </Button>
          <Button
            type={'button'}
            onClick={this.props.reassignMod.bind(this, mod.id, characterID)}
          >
            I reassigned this mod
          </Button>
        </div>
      </div>;
    });
  }

  /***
   * Convert a list of displayed mods into the renderable elements to display them as sets
   * @param modAssignments {array<Object>} An array of objects containing `id`, `target`, and `assignedMods` keys
   * @returns array[JSX Element]
   */
  setsView(modAssignments: ModAssignments) {
    // Iterate over each character to render a full mod set
    return modAssignments.map(({ id: characterID, target, assignedMods: mods, missedGoals }, index) => {
      const character = this.props.characters[characterID];

      if (!character) {
        return null;
      }

      return <div className={'mod-row set'} key={index}>
        <div className={'character-id'}>
          <CharacterAvatar character={character} />
          <Arrow />
          <h3 className={missedGoals && missedGoals.length ? 'red-text' : ''}>
            {this.props.baseCharacters[characterID] ? this.props.baseCharacters[characterID].name : characterID}
          </h3>
          {target &&
            <h4 className={missedGoals && missedGoals.length ? 'red-text' : ''}>{target.name}</h4>
          }
          <div className={'actions'}>
            {sortOptions.currentCharacter === this.props.filter.sort &&
              <Button
                type={'button'}
                onClick={this.props.unequipMods.bind(this, mods.map(mod => mod.id))}
              >
                I removed these mods
              </Button>
            }
            {sortOptions.assignedCharacter === this.props.filter.sort &&
              <Button
                type={'button'}
                onClick={this.props.reassignMods.bind(this, mods.map(mod => mod.id), characterID)}
              >
                I reassigned these mods
              </Button>
            }
          </div>
        </div>
        {sortOptions.assignedCharacter === this.props.filter.sort &&
          <ModLoadoutDetail
            newLoadout={new ModLoadout(mods)}
            oldLoadout={new ModLoadout(this.props.currentModsByCharacter[characterID] || [])}
            showAvatars={sortOptions.currentCharacter !== this.props.filter.sort}
            character={character}
            target={target}
            useUpgrades={true}
            assignedCharacter={character}
            assignedTarget={target}
            missedGoals={missedGoals}
          />
        }
        {sortOptions.currentCharacter === this.props.filter.sort &&
          <div className={'mod-set-block'}>
            <ModLoadoutView
              modLoadout={new ModLoadout(mods)}
              showAvatars={sortOptions.currentCharacter !== this.props.filter.sort}
            />
          </div>
        }
      </div>;
    });
  }

  /**
   * Render a modal with a copy-paste-able review of the mods to move
   * @returns Array[JSX Element]
   */
  reviewModal() {
    return <div key={'summary_modal_content'}>
      <h2>Move Summary</h2>
      <pre id="summary_pre" className={'summary'}>
        {this.summaryListContent()}
      </pre>
      <div className={'flex justify-center gap-2'}>
        <Button
          type={'button'}
          onClick={() => this.copySummaryToClipboard()}
        >
          Copy to Clipboard
        </Button>
        <Button
          type={'button'}
          onClick={() => dialog$.hide()}
        >
          OK
        </Button>
      </div>
    </div>;
  }

  /**
   * Copies the summary display text into the clipboard
   */
  copySummaryToClipboard() {
    copyToClipboard(this.summaryListContent());
  }

  summaryListContent() {
    const capitalize = function (str: string) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    };

    return this.props.movingModAssignments.map(({ id, target, assignedMods: mods }) => {
      const assignedCharacter = this.props.characters[id];
      const characterName = this.props.baseCharacters[assignedCharacter.baseID] ?
        this.props.baseCharacters[assignedCharacter.baseID].name :
        assignedCharacter.baseID;


      return [
        `${characterName} - ${target.name}`
      ].concat(
        mods.map(mod => {
          const moveFrom = mod.characterID !== 'null' ? this.props.baseCharacters[mod.characterID].name : 'your unassigned mods';
          return `Move ${capitalize(mod.set)}(${mod.primaryStat.type}) ${capitalize(mod.slot)} from ${moveFrom}.`;
        })
      ).join('\r\n');
    }).join('\r\n\r\n');
  }

  hotUtilsHelp() {
    return <div className={'help'}>
      <p>
        HotUtils is another tool for SWGOH that allows you to directly modify your game account. By importing the
        recommendation from Grandivory's Mods Optimizer, you can instantly rearrange mods in-game and create profiles
        that you can switch back-and-forth between quickly.
      </p>
      <p>
        <strong>Use at your own risk!</strong> HotUtils functionality breaks the terms of service for Star Wars:
        Galaxy of Heroes. You assume all risk in using this tool. Grandivory's Mods Optimizer is not associated with
        HotUtils.
      </p>
      <p><a href={'https://www.hotutils.com/'} target={'_blank'} rel={'noopener noreferrer'}>
        https://www.hotutils.com/
      </a></p>
      <p><img className={'fit'} src={'/img/hotsauce512.png'} alt={'hotsauce'} /></p>
    </div>;
  }

  hotUtilsCreateProfileModal() {
    let categoryInput: HTMLInputElement | null;
    let profileNameInput: HTMLInputElement | null;
    let error: HTMLParagraphElement | null;

    const checkNameAndCreateProfile = function (this: Review) {
      if (
        ('' === (categoryInput?.value ?? ''))
        || ('' === (profileNameInput?.value ?? ''))
      ) {
        if (error !== null)
          error.textContent = 'You must provide a category and name for your profile';
      } else {
        if (error !== null)
          error.textContent = '';

        const profile: HUProfileCreationData = {
          set: {
            category: categoryInput?.value ?? '',
            name: profileNameInput?.value ?? '',
            units: this.generateHotUtilsProfile()
          }
        }

        this.props.createHotUtilsProfile(profile, this.props.hotUtilsSessionId);
      }
    }.bind(this);

    return <div key={'hotutils-create-profile-modal'}>
      <h2>Create a new mod profile in HotUtils</h2>
      <p>
        This will create a new mods profile in HotUtils using the recommendations listed here. After creating your
        profile, please log
        into <a href={'https://www.hotutils.com/'} target={'_blank'} rel={'noopener noreferrer'}>HotUtils</a> to
        access your new profile.
      </p>
      <p>
        <strong>Use at your own risk!</strong> HotUtils functionality breaks the terms of service for Star Wars:
        Galaxy of Heroes. You assume all risk in using this tool. Grandivory's Mods Optimizer is not associated with
        HotUtils.
      </p>
      <hr />
      <p className={'center'}>
        Please enter a name for your new profile.
        Please note that using the same name as an existing profile will cause it to be overwritten.
      </p>
      <div className={'form-row'}>
        <label htmlFor={'categoryName'}>Category:</label>
        <input
          id={'categoryName'}
          type={'text'}
          name={'categoryName'}
          defaultValue={'Grandivory'}
          ref={input => categoryInput = input}
          onKeyUp={(e) => {
            if (e.key === 'Enter') {
              checkNameAndCreateProfile();
            }
          }}
        />
      </div>
      <div className={'form-row'}>
        <label htmlFor={'profileName'}>Profile Name:</label>

        <input
          id={'profileName'}
          type={'text'}
          name={'profileName'}
          ref={input => profileNameInput = input}
          onKeyUp={(e) => {
            if (e.key === 'Enter') {
              checkNameAndCreateProfile();
            }
          }}
        />
      </div>
      <p className={'error'} ref={field => error = field}></p>
      <div className={'actions'}>
        <Button
          type={'button'}
          variant={'destructive'}
          onClick={() => dialog$.hide()}
        >
          Cancel
        </Button>
        <Button
          type={'button'}
          onClick={() => checkNameAndCreateProfile()}
        >
          Create Profile
        </Button>
      </div>
    </div >;
  }

  hotUtilsMoveModsModal() {
    return <div key={'hotutils-move-mods-modal'}>
      <h2>Move mods in-game using HotUtils</h2>
      <h3>
        Moving your mods will cost<br />
        <span className={'box'}>
          <strong className={'white'}>{formatNumber(this.props.modRemovalCost)}</strong> <Credits />
        </span>
      </h3>
      <p>
        This will move all of your mods as recommended by Grandivory's Mods Optimizer.
        Please note that <strong className={'gold'}>
          this action will log you out of Galaxy of Heroes if you are currently logged in
        </strong>.
      </p>
      <p>
        Moving your mods can take several minutes. Please be patient and allow the process to complete before
        refreshing or logging back into Galaxy of Heroes.
      </p>
      <p>
        <strong>Use at your own risk!</strong> HotUtils functionality breaks the terms of service for Star Wars:
        Galaxy of Heroes. You assume all risk in using this tool. Grandivory's Mods Optimizer is not associated with
        HotUtils.
      </p>
      <div className={'actions'}>
        <Button
          type={'button'}
          variant={'destructive'}
          onClick={() => dialog$.hide()}
        >
          Cancel
        </Button>
        <Button
          type={'button'}
          onClick={() => {
            const profile: HUModsMoveProfile = {
              units: this.generateHotUtilsProfile()
            };

            this.props.moveModsWithHotUtils(profile, this.props.hotUtilsSessionId);
          }}
        >
          Move my mods
      </Button>
      </div>
    </div >;
  }
}

const mapStateToProps = (state: IAppState) => {
  const baseCharacters = Data.selectors.selectBaseCharacters(state);

  const getModAssignmentsByCurrentCharacter = function(modAssignments: ModAssignments): ModAssignments {
    let tempAssignments = modAssignments;

    // If we're only showing upgrades, then filter out any mod that isn't being upgraded
    if (showOptions.upgrades === filter.show) {
/*
      tempAssignments = modAssignments.map(({ id, target, assignedMods, missedGoals }) => ({
        id: id,
        target: target,
        assignedMods:
          assignedMods.filter(mod => mod.shouldLevel(target) || mod.shouldSlice(profile.characters[id], target)),
        missedGoals: missedGoals,
      }));
*/
      tempAssignments.forEach(assignment => {
        assignment.assignedMods = assignment.assignedMods.filter(mod =>
           mod.shouldLevel(assignment.target) ||
           mod.shouldSlice(profile.characters[assignment.id], assignment.target)
        )
      })
    }
    // Filter out any mods that aren't moving
    const mods = tempAssignments.map(({ id, assignedMods }) => assignedMods.filter(mod => mod.characterID !== id));

    const modsByCharacterNames: ModsByCharacterNames = groupBy(
      flatten(mods),
      (mod: Mod) => mod.characterID
    );

    // Then, turn that into the same format as modAssignments - an array of {id, assignedMods}
    let result: ModAssignments = Object.values(mapValues<ModsByCharacterNames, ModAssignment>(
      modsByCharacterNames,
      (mods: Mod[], id: string): ModAssignment => ({ id: id as CharacterNames, assignedMods: mods, target: OptimizationPlan.createOptimizationPlan('xyz'), missedGoals: [] })
    ));

    return result;
  }

  const profile = state.profile;
  const filter = state.modListFilter;
  const modsById = groupByKey(profile.mods, mod => mod.id);
  const modAssignments: ModAssignments = profile.modAssignments
    .filter(x => null !== x)
    .map(({ id, target, assignedMods, missedGoals }) => ({
      id: id,
      target: target,
      assignedMods: assignedMods ? assignedMods.map(id => modsById[id]).filter(mod => !!mod) : [],
      missedGoals: missedGoals || []
    })) as ModAssignments;

  const currentModsByCharacter: {
    [key in CharacterNames]: Mod[]
  } = collectByKey(
    profile.mods.filter(mod => mod.characterID !== 'null'),
    (mod: Mod) => mod.characterID
  );
  const numMovingMods = modAssignments.reduce((count, { id, assignedMods }) =>
    assignedMods.filter(mod => mod.characterID !== id).length + count
    , 0
  );

  const currentLoadoutValue = modAssignments.map(({ id, target }) =>
    Object.keys(currentModsByCharacter).includes(id) ?
      new ModLoadout(currentModsByCharacter[id]).getOptimizationValue(profile.characters[id], target, false)
    :
      0
  ).reduce((a, b) => a + b, 0);
  const newLoadoutValue = modAssignments.map(({ id, target, assignedMods }) =>
    (new ModLoadout(assignedMods)).getOptimizationValue(profile.characters[id], target, true)
  ).reduce((a, b) => a + b, 0);

  let displayedMods: ModAssignments;
  let tags: string[];
  switch (filter.view) {
    case viewOptions.list:
      if (showOptions.upgrades === filter.show) {
        // If we're showing mods as a list and showing upgrades, show any upgraded mod, no matter if it's moving or not
        displayedMods = modAssignments.map(({ id, target, assignedMods }) => ({
          id: id,
          target: target,
          assignedMods:
            assignedMods.filter(mod => mod.shouldLevel(target) || mod.shouldSlice(profile.characters[id], target)),
          missedGoals: [],
        })).filter(({ assignedMods }) => assignedMods.length > 0);

      } else {
        // If we're not showing upgrades, then only show mods that aren't already assigned to that character
        displayedMods = modAssignments.map(({ id, target, assignedMods }) => ({
          id: id,
          target: target,
          assignedMods: assignedMods.filter(mod => mod.characterID !== id).sort(ModLoadout.slotSort),
          missedGoals: [],
        }));
      }

      if (sortOptions.currentCharacter === filter.sort) {
        // collectByKey
        const removedMods: ModsByCharacterNames = groupBy(
          flatten(displayedMods.map(
            ({ id, assignedMods }) => assignedMods.filter(mod => mod.characterID !== id)
          )),
          (mod: Mod) => mod.characterID
        );

        tags = uniq(flatten(
          (Object.keys(removedMods) as CharacterNames[]).map(
            id => id in baseCharacters ? baseCharacters[id].categories : []
          ) as string[][]
        ));
      } else {
        tags = uniq(flatten(
          displayedMods.map(({ id }) => id in baseCharacters ? baseCharacters[id].categories : [])
        ));
      }
      break;
    default:
      // If we're displaying as sets, but sorting by current character, we need to rework the modAssignments
      // so that they're organized by current character rather than assigned character
      if (sortOptions.currentCharacter === filter.sort) {
        displayedMods = getModAssignmentsByCurrentCharacter(modAssignments);
      } else if (showOptions.change === filter.show) {
        // If we're only showing changes, then filter out any character that isn't changing
        displayedMods = modAssignments.filter(({ id, assignedMods }) => assignedMods.some(mod => mod.characterID !== id));
      } else if (showOptions.upgrades === filter.show) {
        // If we're only showing upgrades, then filter out any character that doesn't have at least one upgrade
        displayedMods = modAssignments.filter(({ id, target, assignedMods }) => assignedMods.some(mod =>
          mod.shouldLevel(target) || mod.shouldSlice(profile.characters[id], target)
        ));
      } else {
        displayedMods = modAssignments;
      }

      // Set up the available tags for the sidebar
      tags = Array.from(new Set(flatten(
        displayedMods.map(({ id }) => baseCharacters[id] ? baseCharacters[id].categories : [])
      )));

      // Filter out any characters that we're not going to display based on the selected tag
      if (filter.tag !== 'All') {
        displayedMods = displayedMods.filter(({ id }) => {
          const tags = baseCharacters[id] ? baseCharacters[id].categories : [];
          return tags.includes(filter.tag);
        });
      }
  }
  tags.sort();

  const movingModsByAssignedCharacter = modAssignments.map(({ id, target, assignedMods }) =>
    ({ id: id, target: target, assignedMods: assignedMods.filter(mod => mod.characterID !== id) })
  ).filter(({ assignedMods }) => assignedMods.length);

  const movingMods = flatten(
    movingModsByAssignedCharacter.map(({ assignedMods }) => assignedMods)
  ).filter(mod => mod.characterID);

  // Mod cost is the cost of all mods that are being REMOVED. Every mod
  // being assigned to a new character (so that isn't already unassigned) is
  // being removed from that character. Then, any mods that used to be equipped
  // are also being removed.
  const removedMods = flatten(
    movingModsByAssignedCharacter.map(({ id, assignedMods }) => {
      const changingSlots = assignedMods.map(mod => mod.slot);
      return currentModsByCharacter[id] ?
        currentModsByCharacter[id].filter(mod => changingSlots.includes(mod.slot)) :
        []
    })
  ).filter(mod => !movingMods.includes(mod));

  const modCostBasis = movingMods.concat(removedMods);
  // Get a count of how much it will cost to move the mods. It only costs money to remove mods
  const modRemovalCost = modCostBasis.reduce(
    (cost, mod) => cost + modRemovalCosts[mod.pips],
    0
  );

  const modsBeingUpgraded = modAssignments.filter(({ target }) => OptimizationPlan.shouldUpgradeMods(target))
    .map(({ id, assignedMods }) => assignedMods.filter(mod => 15 !== mod.level))
    .reduce((allMods, characterMods) => allMods.concat(characterMods), []);

  const modUpgradeCost = modsBeingUpgraded.reduce((cost, mod) => cost + modUpgradeCosts[mod.pips][mod.level], 0);

  /**
   * {{
   *   displayedMods: [[CharacterID, Mod]]
   * }}
   */
  return {
    allyCode: Storage.selectors.selectAllycode(state),
    assignedMods: profile.modAssignments ?? [],
    currentSetValue: currentLoadoutValue,
    newSetValue: newLoadoutValue,
    characters: profile.characters ?? {},
    baseCharacters: baseCharacters,
    currentModsByCharacter: currentModsByCharacter,
    displayedMods: displayedMods,
    movingModAssignments: movingModsByAssignedCharacter,
    modRemovalCost: modRemovalCost,
    modUpgradeCost: modUpgradeCost,
    numMovingMods: numMovingMods,
    filter: ReviewModule.selectors.selectModListFilter(state),
    tags: tags,
    hotUtilsSubscription: state.hotUtilsSubscription,
    hotUtilsSessionId: profile.hotUtilsSessionId ?? ""
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  edit: () => dispatch(ReviewModule.actions.changeOptimizerView('edit')),
  changeFilter: (filter: ModListFilter) => dispatch(ReviewModule.actions.changeModListFilter(filter)),
  unequipMod: (modID: string) => dispatch(ReviewModule.thunks.unequipMod(modID)),
  reassignMod: (modID: string, characterID: CharacterNames) => dispatch(ReviewModule.thunks.reassignMod(modID, characterID)),
  unequipMods: (modIDs: string[]) => dispatch(ReviewModule.thunks.unequipMods(modIDs)),
  reassignMods: (modIDs: string[], characterID: CharacterNames) => dispatch(ReviewModule.thunks.reassignMods(modIDs, characterID)),
  createHotUtilsProfile: (profile: HUProfileCreationData, sessionId: string) => dispatch(Data.thunks.createHotUtilsProfile(profile, sessionId)),
  moveModsWithHotUtils: (profile: HUModsMoveProfile, sessionId: string) => dispatch(Data.thunks.moveModsWithHotUtils(profile, sessionId))
});

type Props = PropsFromRedux & OwnProps;
type PropsFromRedux = ConnectedProps<typeof connector>;

type OwnProps = {
}

const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(Review);
