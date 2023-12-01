// react
import React, { PureComponent } from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { connect, ConnectedProps } from "react-redux";
import { ThunkDispatch } from "../../state/reducers/modsOptimizer";

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
import collectByKey from "../../utils/collectByKey";
import keysWhere from "../../utils/keysWhere";

// state
import { IAppState } from "../../state/storage";

// modules
import { App } from '../../state/modules/app';
import { CharacterEdit } from '../../state/modules/characterEdit';
import { Data } from '../../state/modules/data';
import { Optimize } from '../../state/modules/optimize';
import { Review } from '../../state/modules/review';
import { Storage } from '../../state/modules/storage';

// domain
import {
  characterSettings,
  CharacterNames,
} from "../../constants/characterSettings";
import defaultTemplates from "../../constants/characterTemplates.json";

import { defaultBaseCharacter } from "../../domain/BaseCharacter";
import { Character } from "../../domain/Character";
import { CharacterListGenerationParameters } from "../../domain/CharacterListGenerationParameters";
import { OptimizationPlan } from "../../domain/OptimizationPlan";
import { SelectedCharacters } from "../../domain/SelectedCharacters";
import { UseCaseModes } from "../../domain/UseCaseModes";

// components
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DOMContent } from "../../components/types";

import { Button } from "#/components/ui/button";
import { CharacterAvatar } from "../../components/CharacterAvatar/CharacterAvatar";
import { DefaultCollapsibleCard } from "#/components/DefaultCollapsibleCard";
import { Dropdown } from "../../components/Dropdown/Dropdown";
import { HelpLink } from "../../components/HelpLink/HelpLink";
import { OptimizerProgress } from "../../components/OptimizerProgress/OptimizerProgress";
import { Spoiler } from "../../components/Spoiler/Spoiler";
import { Toggle } from "../../components/Toggle/Toggle";

// containers
import { CharacterList } from "../CharacterList/CharacterList";


class CharacterEditView extends PureComponent<Props> {
  dragStart(character: Character) {
    return function (event: React.DragEvent<HTMLDivElement>) {
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
      case "move":
        // This is coming from the selected characters - remove the character from the list
        const characterIndex = +event.dataTransfer.getData("text/plain");
        this.props.unselectCharacter(characterIndex);
        break;
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
        this.props.showError((e as Error).message);
      }
    };

    reader.readAsText(fileInput);
  }

  render() {
    return (
      <div className={`character-edit flex flex-col flex-grow-1 ${this.props.sortView ? "sort-view" : ""}`}>
        <div className="characters-header flex justify-around items-stretch w-full">
          {this.filters()}
          {this.renderCharacterActions()}
          {this.renderTemplateActions()}
          <HelpLink title="Global Settings" section="optimizer" topic={1} />
        </div>
        <div className="characters flex h-full">
          <div
            className="available-characters"
            onDragEnter={CharacterEditView.availableCharactersDragEnter}
            onDragOver={CharacterEditView.dragOver}
            onDragLeave={CharacterEditView.dragLeave}
            onDrop={this.availableCharactersDrop.bind(this)}
          >
            {this.props.highlightedCharacters.map((character) =>
              this.characterBlock(character, "active")
            )}
            {this.props.availableCharacters.map((character) =>
              this.characterBlock(character, "inactive")
            )}
          </div>
          <div className="selected-characters">
            <h4>
              Selected Characters
              <div className="character-list-actions">
                <Button
                  size="sm"
                  onClick={this.props.clearSelectedCharacters}
                >
                  <FontAwesomeIcon icon={faBan} title="Clear"/>
                </Button>
                <Button
                  size="sm"
                  onClick={this.props.lockSelectedCharacters}
                >
                  <FontAwesomeIcon icon={faLock} title="Lock All"/>
                </Button>
                <Button
                  size="sm"
                  onClick={this.props.unlockSelectedCharacters}
                >
                  <FontAwesomeIcon icon={faUnlock} title="Unlock All"/>
                </Button>
                <Button
                  size="sm"
                  onClick={this.props.toggleCharacterEditSortView}
                >
                  {this.props.sortView ?
                    <FontAwesomeIcon icon={faCompress} title="Normal View"/>
                  :
                    <FontAwesomeIcon icon={faExpand} title="Expand View"/>
                  }
                </Button>
                <Button
                  size="sm"
                  onClick={() =>
                    this.props.showModal(
                      "generate-character-list",
                      this.generateCharacterListModal(),
                      false
                    )
                  }
                >
                  Auto-generate List
                </Button>
              </div>
            </h4>
            <h5>
              Character Templates{" "}
              <HelpLink title="" section="optimizer" topic={2} />
            </h5>
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
        <div id="filters-content" className="p2">
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
          <Toggle
            className="text-sm"
            inputLabel="Show selected"
            leftLabel=""
            rightLabel=""
            leftValue="hide"
            rightValue="show"
            value={this.props.hideSelectedCharacters ? "hide" : "show"}
            onChange={() => this.props.toggleHideSelectedCharacters()}
          />
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
              this.props.resetIncrementalIndex();
              const selectedTargets = this.props.selectedCharacters.map(
                ({ target }) => target
              );
              const hasTargetStats = selectedTargets.some(
                (target) =>
                  target.targetStats &&
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
                this.props.selectedCharacters.reduce(
                  (indices, { id }, charIndex) => ({
                    [id]: charIndex,
                    ...indices,
                  }),
                  { [this.props.selectedCharacters[0].id]: 0 }
                ) as IndexOfCharacters;

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
                this.props.showError([
                  <p>You have invalid targets set!</p>,
                  <p>
                    For relative targets, the compared character MUST be earlier
                    in the selected characters list.
                  </p>,
                  <p>Please fix the following characters:</p>,
                  <ul>
                    {invalidTargets.map((id) => (
                      <li>
                        {this.props.baseCharacters[id]
                          ? this.props.baseCharacters[id].name
                          : id}
                      </li>
                    ))}
                  </ul>,
                ]);
              } else if (duplicateCharacters.length > 0 || hasTargetStats) {
                this.props.showModal(
                  "notice",
                  this.optimizeWithWarningsModal(
                    duplicateCharacters,
                    hasTargetStats
                  ),
                  false
                );
              } else {
                this.props.showModal(
                  "optimizer-progress",
                  <OptimizerProgress />,
                  false
                );
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
              this.props.showModal("reset-modal", this.resetCharsModal(), false)
            }
          >
            Reset all targets
          </Button>
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
            onClick={() =>
              this.props.showModal(
                "append-template",
                this.addTemplateModal(),
                false
              )
            }
          >
            <FontAwesomeIcon icon={faPlus} title={`Add template`}/>
          </Button>
          <Button
            size="sm"
            onClick={() =>
              this.props.showModal(
                "generate-character-list",
                this.generateCharacterListModal(),
                true
              )
            }
          >
            Auto-generate List
          </Button>
          <Button
            size="icon"
            disabled={!this.props.selectedCharacters.length}
            onClick={() =>
              this.props.showModal(
                "save-template",
                this.saveTemplateModal(),
                false
              )
            }
          >
            <FontAwesomeIcon icon={faSave} title={`Save`}/>
          </Button>
        </div>
      </DefaultCollapsibleCard>
    )
  }

  /**
   * Render a character block for the set of available characters. This includes the character portrait and a button
   * to edit the character's stats
   * @param character Character
   * @param className String A class to apply to each character block
   */
  characterBlock(character: Character, className: string) {
    const isLocked = character.optimizerSettings.isLocked;
    const classAttr = `${isLocked ? "locked" : ""} ${className} character`;

    return (
      <div className={classAttr} key={character.baseID}>
        <span
          className={`icon locked ${isLocked ? "active" : ""}`}
          onClick={() => this.props.toggleCharacterLock(character.baseID)}
        />
        <div
          draggable={true}
          onDragStart={this.dragStart(character)}
          onDoubleClick={() =>
            this.props.selectCharacter(
              character.baseID,
              character.defaultTarget(),
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

  generateCharacterListModal() {
    let form: HTMLFormElement | null;
    let overwrite: Toggle | null;

    return (
      <div>
        <h3 className={"gold"}>Auto-generate Character List</h3>
        <p>
          This utility will auto-generate a character list for you based on your
          current roster and selected use case. This is intended to be an easy
          starting point, and is by no means the final say in how your
          characters should be ordered or what targets should be chosen.
        </p>
        <p>
          <span className={"blue"}>
            Provided by&nbsp;
            <a
              href={"https://swgoh.spineless.net/"}
              target={"_blank"}
              rel={"noopener noreferrer"}
            >
              https://swgoh.spineless.net/
            </a>
          </span>
        </p>
        <hr />
        <form ref={(element) => (form = element)}>
          <label htmlFor={"use-case"}>Select your use case:</label>
          <Dropdown name={"use-case"} defaultValue={""} onChange={() => {}}>
            <option value={""}>Grand Arena / Territory Wars</option>
            <option value={1}>Light-side Territory Battle</option>
            <option value={2}>Dark-side Territory Battle</option>
            <option value={3}>Arena only</option>
          </Dropdown>
          <Toggle
            name={"overwrite"}
            ref={(toggle) => (overwrite = toggle)}
            inputLabel={"Overwrite existing list?"}
            leftValue={"false"}
            leftLabel={"Append"}
            rightValue={"true"}
            rightLabel={"Overwrite"}
            value={`true`}
          />
          <Spoiler title={"Advanced Settings"}>
            <div className={"form-row"}>
              <label htmlFor={"alignment-filter"}>Alignment:</label>
              <Dropdown name={"alignment-filter"} defaultValue={0}>
                <option value={0}>All Characters</option>
                <option value={1}>Light Side Only</option>
                <option value={2}>Dark Side Only</option>
              </Dropdown>
            </div>
            <div className={"form-row"}>
              <label htmlFor={"minimum-gear-level"}>Minimum Gear Level:</label>
              <Dropdown name={"minimum-gear-level"} defaultValue={1}>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
                <option value={6}>6</option>
                <option value={7}>7</option>
                <option value={8}>8</option>
                <option value={9}>9</option>
                <option value={10}>10</option>
                <option value={11}>11</option>
                <option value={12}>12</option>
                <option value={13}>13</option>
              </Dropdown>
            </div>
            {/* <div className={'form-row'}>
            <label htmlFor={'gear-level-threshold'}>Gear level threshold:</label>
            <Dropdown name={'gear-level-threshold'} defaultValue={12}>
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
              <option value={6}>6</option>
              <option value={7}>7</option>
              <option value={8}>8</option>
              <option value={9}>9</option>
              <option value={10}>10</option>
              <option value={11}>11</option>
              <option value={12}>12</option>
              <option value={13}>13</option>
            </Dropdown>
          </div> */}
            <div className={"form-row"}>
              <label htmlFor={"max-list-size"}>Maximum list size:&nbsp;</label>
              <input
                name={"max-list-size"}
                type={"text"}
                inputMode={"numeric"}
                size={3}
              />
            </div>
          </Spoiler>
        </form>
        <hr />
        <div className={"actions"}>
          <Button
            type={"button"}
            onClick={() => this.props.hideModal()}
          >
            Cancel
          </Button>
          <Button
            type={"button"}
            onClick={() => {
              if (form !== null) {
                const parameters: CharacterListGenerationParameters = {
                  ignoreArena: true,
                };
                if (form["alignment-filter"].value != "0")
                  parameters.alignmentFilter = form["alignment-filter"].value;
                if (form["minimum-gear-level"].value != "1")
                  parameters.minimumGearLevel =
                    form["minimum-gear-level"].value;
                if (form["max-list-size"].value != "")
                  parameters.top = form["max-list-size"].value;

                this.props.generateCharacterList(
                  form["use-case"].value,
                  form.overwrite.value,
                  this.props.allyCode,
                  parameters
                );
              }
            }}
          >
            Generate
          </Button>
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
      <div>
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
            onClick={() => this.props.hideModal()}
          >
            Cancel
          </Button>
          <Button
            type={"button"}
            variant={"destructive"}
            onClick={() => this.props.resetAllCharacterTargets()}
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
          ref={(input) => (nameInput = input)}
          autoFocus
          onKeyUp={(e) => {
            if (e.key === "Enter" && isNameUnique(nameInput!.value)) {
              this.props.saveTemplate(nameInput!.value);
            }
            // Don't change the input if the user is trying to select something
            if (window.getSelection()?.toString() ?? "" !== "") {
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

            if (!isNameUnique(nameInput!.value)) {
              nameInput!.classList.add("invalid");
              saveButton!.disabled = true;
            } else {
              nameInput!.classList.remove("invalid");
              saveButton!.disabled = false;
            }
          }}
        />
        <p className={"error"}>
          That name has already been taken. Please use a different name.
        </p>
        <div className={"actions"}>
          <Button
            type={"button"}
            onClick={() => this.props.hideModal()}
          >
            Cancel
          </Button>
          <Button
            type={"button"}
            ref={(button) => (saveButton = button)}
            onClick={() => this.props.saveTemplate(nameInput!.value)}
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
        {this.templateSelectElement((select) => (templateSelection = select))}
        <div className={"actions"}>
          <Button
            type={"button"}
            onClick={() => this.props.hideModal()}
          >
            Cancel
          </Button>
          <Button
            type={"button"}
            onClick={() => {
              if (this.props.templatesAddingMode === 'append') this.props.appendTemplate(templateSelection!.value);
              if (this.props.templatesAddingMode === 'replace') this.props.replaceTemplate(templateSelection!.value);
              if (this.props.templatesAddingMode === 'apply targets only') this.props.applyTemplateTargets(templateSelection!.value);
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
      <option key={`user-${index}`} value={name}>
        {name}
      </option>
    ));
    const defaultTemplateOptions = defaultTemplateNames.map((name, index) => (
      <option key={`default-${index}`} value={name}>
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

  /**
   * Render the modal content to show a notice before optimizing a list that includes target stats
   * @returns {*}
   */
  optimizeWithWarningsModal(
    duplicates: CharacterNames[],
    hasTargetStats: boolean
  ) {
    return (
      <div>
        <h2>Optimizer Warnings</h2>
        <hr />
        {duplicates.length > 0 && (
          <div>
            <h3>You have duplicate characters selected</h3>
            <p>
              The optimizer can create multiple suggestions for the same
              character using different targets. However, if you plan to move
              your mods in-game with HotUtils, then each character should only
              be included in the list once.
            </p>
            <p className={"left"}>
              <strong>Duplicated Characters:</strong>
            </p>
            <ul>
              {duplicates.map((characterID: CharacterNames) => (
                <li>
                  {this.props.baseCharacters[characterID]
                    ? this.props.baseCharacters[characterID].name
                    : characterID}
                </li>
              ))}
            </ul>
            <hr />
          </div>
        )}
        {hasTargetStats && (
          <div>
            <h3>You have selected characters with target stats</h3>
            <p>
              Using a target stat can be very slow -{" "}
              <strong>up to multiple hours for a single character</strong> - and
              can rapidly drain your battery if you are on a laptop or mobile
              device. If you want the optimization to go faster, there are a few
              things you can do:
            </p>
            <hr />
            <ul>
              <li>
                Set very narrow targets for your stats. The narrower the target,
                the faster the optimizer can rule sets out.
              </li>
              <li>
                Add additional restrictions, like specific sets or primary
                stats.
              </li>
              <li>
                Set targets that are hard to hit. If only a few sets can even
                manage to hit a target, the optimizer only needs to check those
                sets.
              </li>
              <li>
                If you've already completed a run for the character with a
                target stat, don't change their settings or those of any
                characters above them. If the optimizer doesn't think it needs
                to recalculate the best mod set, it will leave the previous
                recommendation in place.
              </li>
            </ul>
            <hr />
          </div>
        )}
        <p>Do you want to continue?</p>
        <div className={"actions"}>
          <Button
            type={"button"}
            onClick={() => this.props.hideModal()}
          >
            Cancel
          </Button>
          <Button
            type={"button"}
            onClick={() => {
              this.props.showModal(
                "optimizer-progress",
                <OptimizerProgress />,
                false
              );
              this.props.optimizeMods();
            }}
          >
            Optimize!
          </Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: IAppState) => {
  const allycode = Storage.selectors.selectAllycode(state);
  const profile = Storage.selectors.selectActiveProfile(state);
  const characters = Storage.selectors.selectCharactersInActiveProfile(state);
  const baseCharacters = Data.selectors.selectBaseCharacters(state);
  let availableCharacters = [] as Character[];

  availableCharacters = Object.values(characters)
    .filter((character) => character.playerValues.level >= 50)
    .filter(
      (character) =>
        !state.hideSelectedCharacters ||
        !profile.selectedCharacters
          .map(({ id }) => id)
          .includes(character.baseID)
    )
    .sort((left, right) => left.compareGP(right));
  /**
   * Checks whether a character matches the filter string in name or tags
   * @param character {Character} The character to check
   * @returns boolean
   */
  const characterFilter = (character: Character) => {
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
    mods: profile.mods ?? [],
    globalSettings: profile.globalSettings ?? {},
    characterFilter: state.characterFilter,
    hideSelectedCharacters: state.hideSelectedCharacters,
    sortView: state.characterEditSortView,
    baseCharacters: baseCharacters,
    highlightedCharacters: availableCharacters.filter(characterFilter),
    availableCharacters: availableCharacters
      ? availableCharacters.filter((c) => !characterFilter(c))
      : [],
    selectedCharacters: profile.selectedCharacters ?? {},
    lastSelectedCharacter: profile.selectedCharacters.length - 1 ?? 0,
    showReviewButton: profile.modAssignments && Object.keys(profile.modAssignments).length,
    characterTemplates: CharacterEdit.selectors.selectUserTemplatesNames(state),
    templatesAddingMode: CharacterEdit.selectors.selectTemplatesAddingMode(state),
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  showModal: (clazz: string, content: DOMContent, cancelable: boolean) =>
    dispatch(App.actions.showModal(clazz, content, cancelable)),
  hideModal: () => dispatch(App.actions.hideModal()),
  showError: (error: DOMContent) => dispatch(App.actions.showError(error)),
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
    dispatch(Review.actions.changeOptimizerView("review"));
  },
  selectCharacter: (
    characterID: CharacterNames,
    target: OptimizationPlan,
    prevIndex: number
  ) => dispatch(CharacterEdit.thunks.selectCharacter(characterID, target, prevIndex)),
  unselectCharacter: (characterIndex: number) =>
    dispatch(CharacterEdit.thunks.unselectCharacter(characterIndex)),
  clearSelectedCharacters: () => dispatch(CharacterEdit.thunks.unselectAllCharacters()),
  lockSelectedCharacters: () => dispatch(CharacterEdit.thunks.lockSelectedCharacters()),
  unlockSelectedCharacters: () => dispatch(CharacterEdit.thunks.unlockSelectedCharacters()),
  lockAllCharacters: () => dispatch(CharacterEdit.thunks.lockAllCharacters()),
  unlockAllCharacters: () => dispatch(CharacterEdit.thunks.unlockAllCharacters()),
  toggleCharacterLock: (characterID: CharacterNames) =>
    dispatch(CharacterEdit.thunks.toggleCharacterLock(characterID)),
  updateLockUnselectedCharacters: (lock: boolean) =>
    dispatch(CharacterEdit.thunks.updateLockUnselectedCharacters(lock)),
  resetAllCharacterTargets: () => dispatch(CharacterEdit.thunks.resetAllCharacterTargets()),
  resetIncrementalIndex: () => dispatch(CharacterEdit.thunks.setOptimizeIndex(null)),
  optimizeMods: () => dispatch(Optimize.thunks.optimizeMods()),
  updateModChangeThreshold: (threshold: number) =>
    dispatch(CharacterEdit.thunks.updateModChangeThreshold(threshold)),
  updateForceCompleteModSets: (forceCompleteModSets: boolean) =>
    dispatch(CharacterEdit.thunks.updateForceCompleteModSets(forceCompleteModSets)),
  generateCharacterList: (
    mode: UseCaseModes,
    behavior: boolean,
    allyCode: string,
    parameters: CharacterListGenerationParameters
  ) => {
    dispatch(Data.thunks.fetchCharacterList(mode, behavior, allyCode, parameters));
    dispatch(App.actions.hideModal());
  },
  saveTemplate: (name: string) => dispatch(CharacterEdit.thunks.saveTemplate(name)),
  appendTemplate: (templateName: string) => {
    dispatch(CharacterEdit.thunks.appendTemplate(templateName));
    dispatch(App.actions.hideModal());
  },
  replaceTemplate: (templateName: string) => {
    dispatch(CharacterEdit.thunks.replaceTemplate(templateName));
    dispatch(App.actions.hideModal());
  },
  applyTemplateTargets: (templateName: string) => {
    dispatch(CharacterEdit.thunks.applyTemplateTargets(templateName));
    dispatch(App.actions.hideModal());
  },
});

type Props = PropsFromRedux & OwnProps & WithTranslation<"optimize-ui">;
type PropsFromRedux = ConnectedProps<typeof connector>;
type OwnProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(withTranslation("optimize-ui")(CharacterEditView));
