// react
// biome-ignore lint/style/useImportType: <explanation>
import React, { PureComponent } from "react";
import { withTranslation, type WithTranslation } from "react-i18next";
import { connect, type ConnectedProps } from "react-redux";
import type { ThunkDispatch } from "#/state/reducers/modsOptimizer";

// styles
import "./CharacterEditView.css";
import {
  faArrowsRotate,
  faBan,
  faCompress,
  faExpand,
  faGears,
  faLock,
  faPlus,
  faSave,
  faUnlock,
} from "@fortawesome/free-solid-svg-icons";

// utils
import collectByKey from "#/utils/collectByKey";
import keysWhere from "#/utils/keysWhere";

// state
import type { IAppState } from "#/state/storage";

import { dialog$ } from "#/modules/dialog/state/dialog";
import { incrementalOptimization$ } from "#/modules/incrementalOptimization/state/incrementalOptimization";
import { isBusy$ } from "#/modules/busyIndication/state/isBusy";
import { optimizerView$ } from "#/modules/optimizerView/state/optimizerView";
import { profilesManagement$ } from "#/modules/profilesManagement/state/profilesManagement";
import { stackRank$ } from "#/modules/stackRank/state/stackRank";

// modules
import { CharacterEdit } from "#/state/modules/characterEdit";
import { Data } from "#/state/modules/data";
import { Optimize } from "#/state/modules/optimize";
import { Review } from "#/state/modules/review";
import { Storage } from "#/state/modules/storage";

// domain
import {
  characterSettings,
  type CharacterNames,
} from "#/constants/characterSettings";
import defaultTemplates from "#/constants/characterTemplates.json";

import { defaultBaseCharacter } from "#/domain/BaseCharacter";
import * as Character from "#/domain/Character";
import type { OptimizationPlan } from "#/domain/OptimizationPlan";
import type { SelectedCharacters } from "#/domain/SelectedCharacters";

// components
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { CharacterAvatar } from "#/components/CharacterAvatar/CharacterAvatar";
import { DefaultCollapsibleCard } from "#/components/DefaultCollapsibleCard";
import { Dropdown } from "#/components/Dropdown/Dropdown";
import { OptimizerProgress } from "#/components/OptimizerProgress/OptimizerProgress";
import { SettingsLink } from "#/components/SettingsLink/SettingsLink";
import { HelpLink } from "#/modules/help/components/HelpLink";
import { Button } from "#ui/button";
import { Label } from "#ui/label";
import { Switch } from "#ui/switch";

// containers
import { CharacterList } from "#/containers/CharacterList/CharacterList";

class CharacterEditView extends PureComponent<Props> {
  dragStart(character: Character.Character) {
    return (event: React.DragEvent<HTMLDivElement>) => {
      event.dataTransfer.dropEffect = "copy";
      event.dataTransfer.effectAllowed = "copy";
      event.dataTransfer.setData("text/plain", character.baseID);
      // We shouldn't have to do this, but Safari is ignoring both 'dropEffect' and 'effectAllowed' on drop
      const options = {
        effect: "add",
      };
      event.dataTransfer.setData("application/json", JSON.stringify(options));
    };
  }

  static dragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
  }

  static dragLeave(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    (event.target as HTMLDivElement).classList.remove("drop-character");
  }

  static availableCharactersDragEnter(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
  }

  availableCharactersDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const options = JSON.parse(event.dataTransfer.getData("application/json"));

    switch (options.effect) {
      case "move": {
        // This is coming from the selected characters - remove the character from the list
        const characterIndex = +event.dataTransfer.getData("text/plain");
        this.props.unselectCharacter(characterIndex);
        break;
      }
      default:
      // Do nothing
    }
  }

  /**
   * Read a file as input and pass its contents to another function for processing
   * @param fileInput The uploaded file
   * @param handleResult {Function}
   */
  readFile(fileInput: Blob, handleResult: (textInFile: string) => void) {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const fileData: string = (event?.target?.result as string) ?? "";
        handleResult(fileData);
      } catch (e) {
        dialog$.showError((e as Error).message);
      }
    };

    reader.readAsText(fileInput);
  }

  render() {
    return (
      <div className={`character-edit flex flex-col flex-grow-1 ${this.props.sortView ? "sort-view" : ""}`}>
        <div className="flex flex-gap-2 flex-wrap justify-around items-stretch w-full p-y-2">
          {this.filters()}
          {this.renderCharacterActions()}
          {this.renderSelectionActions()}
          {this.renderTemplateActions()}
        </div>
        <div className="flex h-full">
          <div
            className="available-characters"
            onDragEnter={CharacterEditView.availableCharactersDragEnter}
            onDragOver={CharacterEditView.dragOver}
            onDragLeave={CharacterEditView.dragLeave}
            onDrop={this.availableCharactersDrop.bind(this)}
          >
            <div className={"grid grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))]"}>
              {this.props.highlightedCharacters.map((character) =>
                this.characterBlock(character, "active")
              )}
              {this.props.availableCharacters.map((character) =>
                this.characterBlock(character, "inactive")
              )}
            </div>
          </div>
          <div className="selected-characters">
            <CharacterList />
          </div>
        </div>
      </div>
    );
  }

  /**
   * Renders a form for filtering available characters
   *
   * @returns JSX Element
   */
  filters() {
    return (
      <DefaultCollapsibleCard title="Filters">
        <div className="p2 flex flex-col">
          <input
            className="mb-2 bg-black color-white rounded-2 placeholder-blue-500 placeholder-opacity-50"
            autoFocus={true}
            id="character-filter"
            type="text"
            placeholder="name, tag, or acronym"
            defaultValue={this.props.characterFilter}
            onChange={(e) =>
              this.props.changeCharacterFilter(e.target.value.toLowerCase())
            }
          />
          <div>
            <Label className="p-r-2" htmlFor={"hide-selected"}>
              Hide selected
            </Label>
            <Switch
              id={"hide-selected"}
              checked={this.props.hideSelectedCharacters}
              onCheckedChange={() => this.props.toggleHideSelectedCharacters()}
            >
            </Switch>
          </div>
        </div>
      </DefaultCollapsibleCard>
    );
  }

  renderCharacterActions() {
    return (
      <DefaultCollapsibleCard title="Actions">
        <div className={'flex gap-2'}>
          <Button
            type="button"
            onClick={() => {
              incrementalOptimization$.indicesByProfile[this.props.allyCode].set(null);
              const selectedTargets = this.props.selectedCharacters.map(
                ({ target }) => target
              );
              const hasTargetStats = selectedTargets.some(
                (target) =>
                  target.targetStats.filter(
                    (targetStat) => targetStat.optimizeForTarget
                  ).length
              );
              const duplicateCharacters: CharacterNames[] = keysWhere(
                collectByKey(
                  this.props.selectedCharacters,
                  ({ id }: { id: CharacterNames }) => id
                ),
                (targets: SelectedCharacters) => targets.length > 1
              ) as CharacterNames[];

              type IndexOfCharacters = { [id in CharacterNames]: number };
              const minCharacterIndices: IndexOfCharacters =
              this.props.selectedCharacters.reduce((indices, { id }, charIndex) => {
                indices[id] = charIndex;
                return indices;
              }, { [this.props.selectedCharacters[0].id]: 0 }) as IndexOfCharacters;

              const invalidTargets = this.props.selectedCharacters
                .filter(({ target }, index) =>
                  target.targetStats.find(
                    (targetStat) =>
                      targetStat.relativeCharacterId !== "null" &&
                      minCharacterIndices[targetStat.relativeCharacterId] > index
                  )
                )
                .map(({ id }) => id);

              if (invalidTargets.length > 0) {
                dialog$.showError(
                  "Didn't optimize your selected charcters!",
                  <div>
                    <p>You have invalid targets set!</p>,
                    <p>
                      For relative targets, the character compared to MUST be earlier
                      in the selected characters list. The following characters don't follow this rule:
                    </p>,
                    <ul>
                      {invalidTargets.map((id) => (
                        <li>
                          {this.props.baseCharacters[id]
                            ? this.props.baseCharacters[id].name
                            : id}
                        </li>
                      ))}
                    </ul>
                  </div>,
                  "Just move the characters to the correct order and try again!"
                );
              } else {
                dialog$.show(
                  <OptimizerProgress />,
                  true,
                );
                isBusy$.set(true);
                this.props.optimizeMods();
              }
            }}
            disabled={!this.props.selectedCharacters.length}
          >
            <span className="fa-layers">
              <FontAwesomeIcon icon={faArrowsRotate} title="Optimize" transform="grow-8"/>
              <FontAwesomeIcon icon={faGears} size="xs" transform="shrink-6"/>
            </span>
          </Button>
          {this.props.showReviewButton ? (
            <Button
              type={"button"}
              onClick={this.props.reviewOldAssignments}
            >
              Review recommendations
            </Button>
          ) : null}
          <Button
            type="button"
            size="icon"
            onClick={this.props.lockAllCharacters}
          >
            <FontAwesomeIcon icon={faLock} title="Lock All"/>
          </Button>
          <Button
            type="button"
            size="icon"
            onClick={this.props.unlockAllCharacters}
          >
            <FontAwesomeIcon icon={faUnlock} title="Unlock All"/>
          </Button>
          <Button
            type="button"
            onClick={() =>
              dialog$.show(this.resetCharsModal())
            }
          >
            Reset all targets
          </Button>
          <HelpLink title="Global Settings Helppage" section="optimizer" topic={1} />
          <SettingsLink title="Global Settings" section="optimizer" topic={1} />
        </div>
      </DefaultCollapsibleCard>
    )
  }

  renderTemplateActions() {
    return (
      <DefaultCollapsibleCard title="Templates">
        <div className={'flex gap-2'}>
          <Button
            size="sm"
            onClick={() => dialog$.show(this.addTemplateModal())}
          >
            <FontAwesomeIcon icon={faPlus} title={"Add template"}/>
          </Button>
          <Button
            size="sm"
            onClick={async () => {
              try {
               isBusy$.set(true);
               if (this.props.selectedCharacters.length === 0) {
                 this.props.addAll(this.props.highlightedCharacters, this.props.lastSelectedCharacter);
               }
               const ranking = await stackRank$.fetch(this.props.allyCode)
               this.props.applyRanking(ranking);
              } catch (error) {
                if (error instanceof Error) dialog$.showError(error.message);
              } finally {
                isBusy$.set(false);
              }
            }}
          >
            Auto-generate List
          </Button>
          <Button
            size="sm"
            disabled={!this.props.selectedCharacters.length}
            onClick={() => dialog$.show(this.saveTemplateModal())}
          >
            <FontAwesomeIcon icon={faSave} title={"Save"}/>
          </Button>
          <HelpLink title="" section="optimizer" topic={2} />
        </div>
      </DefaultCollapsibleCard>
    )
  }

  renderSelectionActions() {
    return (
      <DefaultCollapsibleCard title="Selection">
        <div className="flex gap-2">
          <Button
            className="flex flex-gap-2"
            type="button"
            onClick={this.props.clearSelectedCharacters}
          >
            <FontAwesomeIcon icon={faBan} title="Clear"/> Clear
          </Button>
          <Button
            className="flex flex-gap-2"
            type="button"
            onClick={this.props.lockSelectedCharacters}
          >
            <FontAwesomeIcon icon={faLock} title="Lock All"/>
            Lock All
          </Button>
          <Button
            className="flex flex-gap-2"
            type="button"
            onClick={this.props.unlockSelectedCharacters}
          >
            <FontAwesomeIcon icon={faUnlock} title="Unlock All"/>
            Unlock All
          </Button>
          <Button
            className="flex flex-gap-2"
            type="button"
            onClick={this.props.toggleCharacterEditSortView}
          >
            {this.props.sortView ?
                <FontAwesomeIcon icon={faCompress} title="Normal View"/>
              :
                <FontAwesomeIcon icon={faExpand} title="Expand View"/>
            }
            {this.props.sortView ? "Normal View" : "Expand View"}
          </Button>
          <Button
            className="flex flex-gap-2"
            type="button"
            onClick={() => this.props.addAll(this.props.highlightedCharacters, this.props.lastSelectedCharacter)}
          >
            <FontAwesomeIcon icon={faPlus} title={"Add all"}/>
            Add all
          </Button>
        </div>
      </DefaultCollapsibleCard>
    );
  }

  /**
   * Render a character block for the set of available characters. This includes the character portrait and a button
   * to edit the character's stats
   * @param character Character
   * @param className String A class to apply to each character block
   */
  characterBlock(character: Character.Character, className: string) {
    const isLocked = character.optimizerSettings.isLocked;
    const classAttr = `${isLocked ? "locked" : ""} ${className} character`;

    const isCharacterSelected = (characterID: CharacterNames) => this.props.selectedCharacters.some(
      (selectedCharacter) => selectedCharacter.id === characterID
    );

    return (
      <div className={classAttr} key={character.baseID}>
        <span
          className={`icon locked ${isLocked ? "active" : ""}`}
          onClick={() => this.props.toggleCharacterLock(character.baseID)}
          onKeyUp={(e) => {
            if (e.code === "Enter") this.props.toggleCharacterLock(character.baseID)
          }}
        />
        <div
          draggable={isCharacterSelected(character.baseID) ? undefined : true}
          onDragStart={isCharacterSelected(character.baseID) ? undefined : this.dragStart(character)}
          onDoubleClick={() =>
            this.props.selectCharacter(
              character.baseID,
              Character.defaultTarget(character),
              this.props.lastSelectedCharacter
            )
          }
        >
          <CharacterAvatar character={character} />
        </div>
        <div className={"character-name"}>
          {this.props.baseCharacters[character.baseID]
            ? this.props.baseCharacters[character.baseID].name
            : character.baseID}
        </div>
      </div>
    );
  }

  /**
   * Renders an "Are you sure?" modal to reset all characters to their default optimization targets
   *
   * @return JSX Element
   */
  resetCharsModal() {
    return (
      <div className="w-[40em]">
        <h2>Are you sure you want to reset all characters to defaults?</h2>
        <p>
          This will <strong>not</strong> overwrite any new optimization targets
          that you've saved, but if you've edited any existing targets, or if
          any new targets have been created that have the same name as one that
          you've made, then it will be overwritten.
        </p>
        <div className={"actions"}>
          <Button
            type={"button"}
            onClick={() => dialog$.hide()}
          >
            Cancel
          </Button>
          <Button
            type={"button"}
            variant={"destructive"}
            onClick={() => {
              dialog$.hide();
              this.props.resetAllCharacterTargets();
            }}
          >
            Reset
          </Button>
        </div>
      </div>
    );
  }

  saveTemplateModal() {
    const isNameUnique = (name: string) =>
      !this.props.characterTemplates.includes(name);
    let nameInput: HTMLInputElement | null;
    let saveButton: HTMLButtonElement | null;

    return (
      <div>
        <h3>Please enter a name for this character template</h3>
        <input
          type={"text"}
          id={"template-name"}
          name={"template-name"}
          ref={(input) => {nameInput = input}}
          autoFocus
          onKeyUp={(e) => {
            if (nameInput === undefined || nameInput === null || saveButton === undefined || saveButton === null) return;
            if (e.key === "Enter" && nameInput && isNameUnique(nameInput.value)) {
              this.props.saveTemplate(nameInput.value);
            }
            // Don't change the input if the user is trying to select something
            if (window.getSelection()?.toString() !== undefined) {
              return;
            }
            // Don't change the input if the user is hitting the arrow keys
            if (
              ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(
                e.key
              )
            ) {
              return;
            }

            if (!isNameUnique(nameInput.value)) {
              nameInput.classList.add("invalid");
              saveButton.disabled = true;
            } else {
              nameInput.classList.remove("invalid");
              saveButton.disabled = false;
            }
          }}
        />
        <p className={"error"}>
          That name has already been taken. Please use a different name.
        </p>
        <div className={"actions"}>
          <Button
            type={"button"}
            onClick={() => dialog$.hide()}
          >
            Cancel
          </Button>
          <Button
            type={"button"}
            ref={(button) => {saveButton = button}}
            onClick={() => {
              dialog$.hide();
              if (nameInput)
                this.props.saveTemplate(nameInput.value);
            }}
          >
            Save
          </Button>
        </div>
      </div>
    );
  }

  addTemplateModal() {
    let templateSelection: HTMLSelectElement | null;
    return (
      <div>
        <h3>Select a character template to add to your selected characters</h3>
        {this.templateSelectElement((select) => {templateSelection = select})}
        <div className={"actions"}>
          <Button
            type={"button"}
            onClick={() => dialog$.hide()}
          >
            Cancel
          </Button>
          <Button
            type={"button"}
            onClick={() => {
              dialog$.hide();
              if (templateSelection === null) return;
              if (this.props.templatesAddingMode === 'append') this.props.appendTemplate(templateSelection.value, this.props.selectedCharacters);
              if (this.props.templatesAddingMode === 'replace') this.props.replaceTemplate(templateSelection.value);
              if (this.props.templatesAddingMode === 'apply targets only') this.props.applyTemplateTargets(templateSelection.value);
            }}
          >
            Add
          </Button>
        </div>
      </div>
    );
  }

  userTemplates() {
    return this.props.characterTemplates.filter(
      (templateName) =>
        !defaultTemplates.map(({ name }) => name).includes(templateName)
    );
  }

  /**
   * Create a select element for a character template, with user templates at the
   * top, followed by a dashed line, followed by default templates, all sorted by name
   *
   * @param refFunction {Function} A function to get the reference for the select element
   */
  templateSelectElement(refFunction: (element: HTMLSelectElement) => void) {
    const userTemplateNames = this.userTemplates();
    const defaultTemplateNames = defaultTemplates.map(({ name }) => name);

    userTemplateNames.sort();
    defaultTemplateNames.sort();

    const userTemplateOptions = userTemplateNames.map((name, index) => (
      <option key={`user-${name}`} value={name}>
        {name}
      </option>
    ));
    const defaultTemplateOptions = defaultTemplateNames.map((name, index) => (
      <option key={`default-${name}`} value={name}>
        {name}
      </option>
    ));

    return (
      <Dropdown ref={refFunction}>
        {userTemplateOptions}
        {userTemplateOptions.length && (
          <option disabled={true} value={""}>
            ------------------------------------------------
          </option>
        )}
        {defaultTemplateOptions}
      </Dropdown>
    );
  }
}

const mapStateToProps = (state: IAppState) => {
  const allycode = profilesManagement$.profiles.activeAllycode.get();
  const profile = Storage.selectors.selectActiveProfile(state);
  const characters = Storage.selectors.selectCharactersInActiveProfile(state);
  const baseCharacters = Data.selectors.selectBaseCharacters(state);
  let availableCharacters = [] as Character.Character[];

  availableCharacters = Object.values(characters)
    .filter((character) => character.playerValues.level >= 50)
    .filter(
      (character) =>
        !state.hideSelectedCharacters ||
        !profile.selectedCharacters
          .map(({ id }) => id)
          .includes(character.baseID)
    )
    .sort((left, right) => Character.compareGP(left, right));
  /**
   * Checks whether a character matches the filter string in name or tags
   * @param character {Character} The character to check
   * @returns boolean
   */
  const characterFilter = (character: Character.Character) => {
    const baseCharacter = baseCharacters[character.baseID] ?? {
      ...defaultBaseCharacter,
      baseID: character.baseID,
      name: character.baseID,
    };

    return (
      state.characterFilter === "" ||
      baseCharacter.name.toLowerCase().includes(state.characterFilter) ||
      (["lock", "locked"].includes(state.characterFilter) &&
        character.optimizerSettings.isLocked) ||
      (["unlock", "unlocked"].includes(state.characterFilter) &&
        !character.optimizerSettings.isLocked) ||
      baseCharacter.categories
        .concat(
          characterSettings[character.baseID]
            ? characterSettings[character.baseID].extraTags
            : []
        )
        .some((tag) => tag.toLowerCase().includes(state.characterFilter))
    );
  };

  return {
    allyCode: allycode,
    characterFilter: state.characterFilter,
    hideSelectedCharacters: state.hideSelectedCharacters,
    sortView: state.characterEditSortView,
    baseCharacters: baseCharacters,
    highlightedCharacters: availableCharacters.filter(characterFilter),
    availableCharacters: availableCharacters
      ? availableCharacters.filter((c) => !characterFilter(c))
      : [],
    selectedCharacters: profile.selectedCharacters ?? {},
    lastSelectedCharacter: profile.selectedCharacters.length - 1,
    showReviewButton: profile.modAssignments && Object.keys(profile.modAssignments).length,
    characterTemplates: CharacterEdit.selectors.selectUserTemplatesNames(state),
    templatesAddingMode: CharacterEdit.selectors.selectTemplatesAddingMode(state),
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  changeCharacterFilter: (filter: string) =>
    dispatch(CharacterEdit.actions.changeCharacterFilter(filter)),
  toggleHideSelectedCharacters: () => dispatch(CharacterEdit.actions.toggleHideSelectedCharacters()),
  toggleCharacterEditSortView: () => dispatch(CharacterEdit.actions.toggleCharacterEditSortView()),
  reviewOldAssignments: () => {
    dispatch(
      Review.thunks.updateModListFilter({
        view: "sets",
        sort: "assignedCharacter",
      })
    );
    optimizerView$.view.set("review");
  },
  selectCharacter: (
    characterID: CharacterNames,
    target: OptimizationPlan,
    prevIndex: number
  ) => dispatch(CharacterEdit.thunks.selectCharacter(characterID, target, prevIndex)),
  addAll: (allCharacters: Character.Character[], lastSelectedCharacter: number) => {
    isBusy$.set(true);
    allCharacters.forEach((character, index) => {
      dispatch(CharacterEdit.thunks.selectCharacter(character.baseID, Character.defaultTarget(character), index+lastSelectedCharacter));
    });
    isBusy$.set(false);
  },
  unselectCharacter: (characterIndex: number) =>
    dispatch(CharacterEdit.thunks.unselectCharacter(characterIndex)),
  clearSelectedCharacters: () => dispatch(CharacterEdit.thunks.unselectAllCharacters()),
  lockSelectedCharacters: () => dispatch(CharacterEdit.thunks.lockSelectedCharacters()),
  unlockSelectedCharacters: () => dispatch(CharacterEdit.thunks.unlockSelectedCharacters()),
  lockAllCharacters: () => dispatch(CharacterEdit.thunks.lockAllCharacters()),
  unlockAllCharacters: () => dispatch(CharacterEdit.thunks.unlockAllCharacters()),
  toggleCharacterLock: (characterID: CharacterNames) =>
    dispatch(CharacterEdit.thunks.toggleCharacterLock(characterID)),
  resetAllCharacterTargets: () => dispatch(CharacterEdit.thunks.resetAllCharacterTargets()),
  optimizeMods: () => dispatch(Optimize.thunks.optimizeMods()),
  applyRanking: (ranking: CharacterNames[]) => {
    dispatch(Data.thunks.applyRanking(ranking));
  },
  saveTemplate: (name: string) => dispatch(CharacterEdit.thunks.saveTemplate(name)),
  appendTemplate: (templateName: string, selectedCharacters: SelectedCharacters) => {
    const template = defaultTemplates.find((template) => template.name === templateName);
    if (template === undefined) return;

    const selectedCharactersIDs = template.selectedCharacters.map(
      ({ id, target }) => id
    )
    if (selectedCharactersIDs.some((id) => selectedCharacters.some((selectedCharacter) => selectedCharacter.id === id))) {
      return;
    }
    dispatch(CharacterEdit.thunks.appendTemplate(templateName));
    dialog$.hide();
  },
  replaceTemplate: (templateName: string) => {
    dispatch(CharacterEdit.thunks.replaceTemplate(templateName));
    dialog$.hide();
  },
  applyTemplateTargets: (templateName: string) => {
    dispatch(CharacterEdit.thunks.applyTemplateTargets(templateName));
    dialog$.hide();
  },
});

type Props = PropsFromRedux & WithTranslation<"optimize-ui">;
type PropsFromRedux = ConnectedProps<typeof connector>;

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(withTranslation("optimize-ui")(CharacterEditView));
