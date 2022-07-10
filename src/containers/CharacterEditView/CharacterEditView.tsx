// react
import React, { PureComponent } from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { connect, ConnectedProps } from "react-redux";
import { ThunkDispatch } from "../../state/reducers/modsOptimizer";

// styles
import "./CharacterEditView.css";
import {
  faBan,
  faCompress,
  faExpand,
  faFile,
  faFileExport,
  faLock,
  faSave,
  faTrashCan,
  faUnlock,
} from "@fortawesome/free-solid-svg-icons";

// utils
import { saveAs } from "file-saver";
import collectByKey from "../../utils/collectByKey";
import keysWhere from "../../utils/keysWhere";

// state
import { IAppState } from "../../state/storage";

// actions
import {
  hideModal,
  showError,
  showModal,
} from "../../state/actions/app";
import {
  changeCharacterFilter,
  toggleHideSelectedCharacters,
  toggleCharacterEditSortView,
} from "../../state/actions/characterEdit";
import {
  changeOptimizerView,
} from "../../state/actions/review";

// thunks
import {
  appendTemplate,
  applyTemplateTargets,
  deleteTemplate,
  lockAllCharacters,
  lockSelectedCharacters,
  replaceTemplate,
  resetAllCharacterTargets,
  saveTemplate,
  saveTemplates,
  selectCharacter,
  setOptimizeIndex,
  toggleCharacterLock,
  unlockAllCharacters,
  unlockSelectedCharacters,
  unselectAllCharacters,
  unselectCharacter,
  updateForceCompleteModSets,
  updateLockUnselectedCharacters,
  updateModChangeThreshold,
} from '../../state/thunks/characterEdit';
import {
  fetchCharacterList,
} from '../../state/thunks/data';
import {
  optimizeMods,
} from '../../state/thunks/optimize';
import {
  updateModListFilter,
} from '../../state/thunks/review';
import {
  exportCharacterTemplate,
  exportCharacterTemplates,
} from '../../state/thunks/storage';

// domain
import {
  characterSettings,
  CharacterNames,
} from "../../constants/characterSettings";
import defaultTemplates from "../../constants/characterTemplates.json";

import { defaultBaseCharacter } from "../../domain/BaseCharacter";
import { Character } from "../../domain/Character";
import { CharacterListGenerationParameters } from "../../domain/CharacterListGenerationParameters";
import {
  CharacterTemplate,
  CharacterTemplates,
  FlatCharacterTemplate,
} from "../../domain/CharacterTemplates";
import { OptimizationPlan } from "../../domain/OptimizationPlan";
import { SelectedCharacters } from "../../domain/SelectedCharacters";
import { UseCaseModes } from "../../domain/UseCaseModes";

// components
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DOMContent } from "../../components/types";

import CharacterAvatar from "../../components/CharacterAvatar/CharacterAvatar";
import { Dropdown } from "../../components/Dropdown/Dropdown";
import { FileInput } from "../../components/FileInput/FileInput";
import Help from "../../components/Help/Help";
import OptimizerProgress from "../../components/OptimizerProgress/OptimizerProgress";
import RangeInput from "../../components/RangeInput/RangeInput";
import Sidebar from "../../components/Sidebar/Sidebar";
import Spoiler from "../../components/Spoiler/Spoiler";
import { Toggle } from "../../components/Toggle/Toggle";

// containers
import CharacterList from "../CharacterList/CharacterList";


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
    const classes = this.props.sortView
      ? "character-edit sort-view"
      : "character-edit";

    return (
      <div className={classes}>
        <Sidebar
          content={[
            this.filterForm(),
            this.sidebarActions(),
          ]}
        />
        <div className={""}>
          <Help header={"Global Settings"}>{this.globalSettingsHelp()}</Help>
        </div>
        <div
          className={"available-characters"}
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
        <div className={"selected-characters"}>
          <h4>
            Selected Characters
            <div className="character-list-actions">
              <button
                className={"small"}
                onClick={this.props.clearSelectedCharacters}
              >
                <FontAwesomeIcon icon={faBan} title={`Clear`}/>
              </button>
              <button
                className={"small"}
                onClick={this.props.lockSelectedCharacters}
              >
                <FontAwesomeIcon icon={faLock} title={`Lock All`}/>
              </button>
              <button
                className={"small"}
                onClick={this.props.unlockSelectedCharacters}
              >
                <FontAwesomeIcon icon={faUnlock} title={`Unlock All`}/>
              </button>
              <button
                className={"small"}
                onClick={this.props.toggleCharacterEditSortView}
              >
                {this.props.sortView ?
                   <FontAwesomeIcon icon={faCompress} title={`Normal View`}/>
                 :
                   <FontAwesomeIcon icon={faExpand} title={`Expand View`}/>
                }
              </button>
              <button
                className={"small"}
                onClick={() =>
                  this.props.showModal(
                    "generate-character-list",
                    this.generateCharacterListModal(),
                    false
                  )
                }
              >
                Auto-generate List
              </button>
            </div>
          </h4>
          <h5>
            Character Templates{" "}
            <Help header={"Character Templates"}>
              {this.characterTemplatesHelp()}
            </Help>
          </h5>
          <div className={"template-buttons"}>
            <div className={"row"}>
              Manage:
              <button
                className={"small"}
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
              </button>
              <button
                className={"small"}
                disabled={!this.userTemplates().length}
                onClick={() =>
                  this.props.showModal(
                    "export-template",
                    this.exportTemplateModal(),
                    false
                  )
                }
              >
                <FontAwesomeIcon icon={faFileExport} title={`Export`}/>
              </button>
              <FileInput
                label={"Load"}
                className={"small"}
                icon={faFile}
                handler={(file) =>
                  this.readFile(file, (templates) => {
                    try {
                      const templatesObject = JSON.parse(templates);
                      const templatesDeserialized = templatesObject.map(
                        (t: FlatCharacterTemplate) => ({
                          name: t.name,
                          selectedCharacters: t.selectedCharacters.map(
                            ({
                              id,
                              target,
                            }: {
                              id: CharacterNames;
                              target: OptimizationPlan;
                            }) => ({
                              id: id,
                              target: OptimizationPlan.deserialize(target),
                            })
                          ),
                        })
                      );
                      this.props.saveTemplates(templatesDeserialized);
                    } catch (e) {
                      throw new Error(
                        "Unable to read templates from file. Make sure that you've selected a character templates file"
                      );
                    }
                  })
                }
              />
              <button
                className={"small red"}
                disabled={!this.userTemplates().length}
                onClick={() =>
                  this.props.showModal(
                    "delete-template",
                    this.deleteTemplateModal(),
                    false
                  )
                }
              >
                <FontAwesomeIcon icon={faTrashCan} title={`Delete`}/>
              </button>
            </div>
            <div className={"row"}>
              Apply:
              <button
                className={"small"}
                onClick={() =>
                  this.props.showModal(
                    "append-template",
                    this.appendTemplateModal(),
                    false
                  )
                }
              >
                Append
              </button>
              <button
                className={"small"}
                onClick={() =>
                  this.props.showModal(
                    "replace-template",
                    this.replaceTemplateModal(),
                    false
                  )
                }
              >
                Replace
              </button>
              <button
                className={"small"}
                onClick={() =>
                  this.props.showModal(
                    "template-targets",
                    this.templateTargetsModal(),
                    false
                  )
                }
              >
                Apply targets only
              </button>
            </div>
          </div>
          <CharacterList selfDrop={true} draggable={true} />
        </div>
      </div>
    );
  }

  /**
   * Renders a form for filtering available characters
   *
   * @returns JSX Element
   */
  filterForm() {
    return (
      <div className={"filters"} key={"filterForm"}>
        <div className={"filter-form"}>
          <label htmlFor={"character-filter"}>
            Search by character name, tag, or common abbreviation:
          </label>
          <input
            autoFocus={true}
            id={"character-filter"}
            type={"text"}
            defaultValue={this.props.characterFilter}
            onChange={(e) =>
              this.props.changeCharacterFilter(e.target.value.toLowerCase())
            }
          />
          <Toggle
            inputLabel={"Available Characters Display"}
            leftLabel={"Hide Selected"}
            rightLabel={"Show All"}
            leftValue={"hide"}
            rightValue={"show"}
            value={this.props.hideSelectedCharacters ? "hide" : "show"}
            onChange={() => this.props.toggleHideSelectedCharacters()}
          />
        </div>
      </div>
    );
  }

  /**
   * Renders a sidebar box with action buttons
   *
   * @returns JSX Element
   */
  sidebarActions() {
    return (
      <div className={"sidebar-actions"} key={"sidebar-actions"}>
        <h3>Actions</h3>
        <button
          type={"button"}
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
          Optimize my mods!
        </button>
        {this.props.showReviewButton ? (
          <button type={"button"} onClick={this.props.reviewOldAssignments}>
            Review recommendations
          </button>
        ) : null}
        <button
          type={"button"}
          className={"blue"}
          onClick={this.props.lockAllCharacters}
        >
          Lock all characters
        </button>
        <button
          type={"button"}
          className={"blue"}
          onClick={this.props.unlockAllCharacters}
        >
          Unlock all characters
        </button>
        <button
          type={"button"}
          className={"blue"}
          onClick={() =>
            this.props.showModal("reset-modal", this.resetCharsModal(), false)
          }
        >
          Reset all targets
        </button>
      </div>
    );
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
          <button type={"button"} onClick={() => this.props.hideModal()}>
            Cancel
          </button>
          <button
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
          </button>
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
          <button type={"button"} onClick={() => this.props.hideModal()}>
            Cancel
          </button>
          <button
            type={"button"}
            className={"red"}
            onClick={() => this.props.resetAllCharacterTargets()}
          >
            Reset
          </button>
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
          <button type={"button"} onClick={() => this.props.hideModal()}>
            Cancel
          </button>
          <button
            type={"button"}
            ref={(button) => (saveButton = button)}
            onClick={() => this.props.saveTemplate(nameInput!.value)}
          >
            Save
          </button>
        </div>
      </div>
    );
  }

  appendTemplateModal() {
    let templateSelection: HTMLSelectElement | null;
    return (
      <div>
        <h3>Select a character template to add to your selected characters</h3>
        {this.templateSelectElement((select) => (templateSelection = select))}
        <div className={"actions"}>
          <button type={"button"} onClick={() => this.props.hideModal()}>
            Cancel
          </button>
          <button
            type={"button"}
            onClick={() => this.props.appendTemplate(templateSelection!.value)}
          >
            Append
          </button>
        </div>
      </div>
    );
  }

  replaceTemplateModal() {
    let templateSelection: HTMLSelectElement | null;
    return (
      <div>
        <h3>Select a character template to replace your selected characters</h3>
        {this.templateSelectElement(
          (select: HTMLSelectElement) => (templateSelection = select)
        )}
        <div className={"actions"}>
          <button type={"button"} onClick={() => this.props.hideModal()}>
            Cancel
          </button>
          <button
            type={"button"}
            onClick={() => this.props.replaceTemplate(templateSelection!.value)}
          >
            Replace
          </button>
        </div>
      </div>
    );
  }

  templateTargetsModal() {
    let templateSelection: HTMLSelectElement | null;
    return (
      <div>
        <h3>
          Select a character template. The targets used in this template will be
          applied to any characters you already have in your selected list.
        </h3>
        {this.templateSelectElement((select) => (templateSelection = select))}
        <div className={"actions"}>
          <button type={"button"} onClick={() => this.props.hideModal()}>
            Cancel
          </button>
          <button
            type={"button"}
            onClick={() => {
              templateSelection &&
                this.props.applyTemplateTargets(templateSelection.value);
            }}
          >
            Apply Targets
          </button>
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

  exportTemplateModal() {
    let templateNameInput: HTMLSelectElement | null;

    const templateOptions = this.userTemplates().map((name) => (
      <option value={name}>{name}</option>
    ));

    return (
      <div>
        <h3>Please select a character template to export</h3>
        <Dropdown ref={(select) => (templateNameInput = select)}>
          {templateOptions}
        </Dropdown>
        <div className={"actions"}>
          <button type={"button"} onClick={() => this.props.hideModal()}>
            Cancel
          </button>
          <button
            type={"button"}
            onClick={() =>
              templateNameInput !== null &&
              this.props.exportTemplate(templateNameInput.value, (template) => {
                const templateSaveObject = {
                  name: template.name,
                  selectedCharacters: template.selectedCharacters.map(
                    ({ id, target }) => ({
                      id: id,
                      target: target.serialize(),
                    })
                  ),
                };
                const templateSerialized = JSON.stringify([templateSaveObject]);
                const userData = new Blob([templateSerialized], {
                  type: "application/json;charset=utf-8",
                });
                saveAs(userData, `modsOptimizerTemplate-${template.name}.json`);
              })
            }
          >
            Export
          </button>
          <button
            type={"button"}
            onClick={() =>
              this.props.exportAllTemplates((templates: CharacterTemplates) => {
                const templatesSaveObject = templates.map(
                  ({ name, selectedCharacters }) => ({
                    name: name,
                    selectedCharacters: selectedCharacters.map(
                      ({ id, target }) => ({
                        id: id,
                        target: target.serialize(),
                      })
                    ),
                  })
                );
                const templatesSerialized = JSON.stringify(templatesSaveObject);
                const userData = new Blob([templatesSerialized], {
                  type: "application/json;charset=utf-8",
                });
                saveAs(
                  userData,
                  `modsOptimizerTemplates-${new Date()
                    .toISOString()
                    .slice(0, 10)}.json`
                );
              })
            }
          >
            Export All
          </button>
        </div>
      </div>
    );
  }

  deleteTemplateModal() {
    let templateNameInput: HTMLSelectElement | null;

    const templateOptions = this.userTemplates().map((name) => (
      <option value={name}>{name}</option>
    ));

    return (
      <div>
        <h3>Please select a character template to delete</h3>
        <Dropdown ref={(select) => (templateNameInput = select)}>
          {templateOptions}
        </Dropdown>
        <div className={"actions"}>
          <button type={"button"} onClick={() => this.props.hideModal()}>
            Cancel
          </button>
          <button
            type={"button"}
            className={"red"}
            onClick={() => this.props.deleteTemplate(templateNameInput!.value)}
          >
            Delete
          </button>
        </div>
      </div>
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
          <button type={"button"} onClick={() => this.props.hideModal()}>
            Cancel
          </button>
          <button
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
          </button>
        </div>
      </div>
    );
  }

  globalSettingsHelp() {
    return (
      <div className={"help"}>
        <p>
          Global settings are a quick way to make changes that apply to every
          character during an optimization. They always override any
          character-specific settings that you have set.
        </p>
        <ul>
          <li>
            <strong>Threshold to change mods</strong> - As the optimizer is
            running, its normal behavior is to always recommend the absolute
            best mod set it can find, based on the target you have selected. If
            this number is above 0, then the optimizer will only recommend that
            you change mods on a character if the new recommended set is at
            least this much better than what the character previously had, or if
            the character's mods were moved to a character higher in your list
            and needed to be replaced.
          </li>
          <li>
            <strong>Lock all unselected characters</strong> - If this box is
            checked, then no mods will be taken from characters that aren't in
            your selected list. If you have a number of unassigned mods, this
            can be a quick way to make use of them without triggering a major
            remod of your whole roster.
          </li>
          <li>
            <strong>Don't break mod sets</strong> - If this box is checked, the
            optimizer will try to keep mod sets together, so you always get the
            maximum set bonuses. Sometimes it's not possible to do so, either
            because of other restrictions on a character's target or because you
            don't have enough mods left to make a full set. In these cases, the
            optimizer will still drop this restriction to try to recommend the
            best set.
          </li>
        </ul>
      </div>
    );
  }

  characterTemplatesHelp() {
    return (
      <div className={"help"}>
        <p>
          Character Templates are a way to work with groups of{" "}
          <strong>selected characters</strong> and their{" "}
          <strong>targets</strong> independently of the rest of your data. They
          can be used to set up teams for a particular use and shared with your
          friends, guildmates, or on the Mods Optimizer discord server to
          quickly allow other people to copy your settings. Here is a quick
          description of the buttons to interact with character templates:
        </p>
        <h5>Managing templates</h5>
        <ul>
          <li>
            <strong>Save</strong> - Save your current selected characters and
            their targets as a new template. You'll be asked to give your
            template a name, which you can then use to apply it or export it
            later.
          </li>
          <li>
            <strong>Export</strong> - Export one or all of your templates to a
            file that can be shared with others.
          </li>
          <li>
            <strong>Load</strong> - Load templates from a file into the
            optimizer. This won't apply the templates, but will instead add them
            to the list of known templates that you can work with.
          </li>
          <li>
            <strong>Delete</strong> - Delete one of your templates from the
            optimizer. This only works on templates that you have created or
            loaded from a file. The default templates in the optimizer can't be
            deleted.
          </li>
        </ul>
        <h5>Applying templates</h5>
        <ul>
          <li>
            <strong>Append</strong> - Add the characters from a template to the
            end of your selected characters.
          </li>
          <li>
            <strong>Replace</strong> - Clear your selected characters and
            replace them with those from a template.
          </li>
          <li>
            <strong>Apply targets only</strong> - Don't change which characters
            you have selected or their order, but for any that are in a
            template, change their targets to match.
          </li>
        </ul>
      </div>
    );
  }
}

const mapStateToProps = (state: IAppState) => {
  const profile = state.profile;
  let availableCharacters = [] as Character[];
  if (state.profile) {
    availableCharacters = Object.values(profile.characters)
      .filter((character) => character.playerValues.level >= 50)
      .filter(
        (character) =>
          !state.hideSelectedCharacters ||
          !profile.selectedCharacters
            .map(({ id }) => id)
            .includes(character.baseID)
      )
      .sort((left, right) => left.compareGP(right));
  }
  /**
   * Checks whether a character matches the filter string in name or tags
   * @param character {Character} The character to check
   * @returns boolean
   */
  const characterFilter = (character: Character) => {
    const baseCharacter = state.baseCharacters[character.baseID] ?? {
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
    allyCode: state.allyCode,
    mods: profile?.mods ?? [],
    globalSettings: profile?.globalSettings ?? {},
    characterFilter: state.characterFilter,
    hideSelectedCharacters: state.hideSelectedCharacters,
    sortView: state.characterEditSortView,
    baseCharacters: state.baseCharacters,
    highlightedCharacters: availableCharacters.filter(characterFilter),
    availableCharacters: availableCharacters
      ? availableCharacters.filter((c) => !characterFilter(c))
      : [],
    selectedCharacters: profile?.selectedCharacters ?? {},
    lastSelectedCharacter: profile?.selectedCharacters.length - 1 ?? 0,
    showReviewButton:
      profile?.modAssignments && Object.keys(profile.modAssignments).length,
    characterTemplates: Object.keys(state.characterTemplates),
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  showModal: (clazz: string, content: DOMContent, cancelable: boolean) =>
    dispatch(showModal(clazz, content, cancelable)),
  hideModal: () => dispatch(hideModal()),
  showError: (error: DOMContent) => dispatch(showError(error)),
  changeCharacterFilter: (filter: string) =>
    dispatch(changeCharacterFilter(filter)),
  toggleHideSelectedCharacters: () => dispatch(toggleHideSelectedCharacters()),
  toggleCharacterEditSortView: () => dispatch(toggleCharacterEditSortView()),
  reviewOldAssignments: () => {
    dispatch(
      updateModListFilter({
        view: "sets",
        sort: "assignedCharacter",
      })
    );
    dispatch(changeOptimizerView("review"));
  },
  selectCharacter: (
    characterID: CharacterNames,
    target: OptimizationPlan,
    prevIndex: number
  ) => dispatch(selectCharacter(characterID, target, prevIndex)),
  unselectCharacter: (characterIndex: number) =>
    dispatch(unselectCharacter(characterIndex)),
  clearSelectedCharacters: () => dispatch(unselectAllCharacters()),
  lockSelectedCharacters: () => dispatch(lockSelectedCharacters()),
  unlockSelectedCharacters: () => dispatch(unlockSelectedCharacters()),
  lockAllCharacters: () => dispatch(lockAllCharacters()),
  unlockAllCharacters: () => dispatch(unlockAllCharacters()),
  toggleCharacterLock: (characterID: CharacterNames) =>
    dispatch(toggleCharacterLock(characterID)),
  updateLockUnselectedCharacters: (lock: boolean) =>
    dispatch(updateLockUnselectedCharacters(lock)),
  resetAllCharacterTargets: () => dispatch(resetAllCharacterTargets()),
  resetIncrementalIndex: () => dispatch(setOptimizeIndex(null)),
  optimizeMods: () => dispatch(optimizeMods()),
  updateModChangeThreshold: (threshold: number) =>
    dispatch(updateModChangeThreshold(threshold)),
  updateForceCompleteModSets: (forceCompleteModSets: boolean) =>
    dispatch(updateForceCompleteModSets(forceCompleteModSets)),
  generateCharacterList: (
    mode: UseCaseModes,
    behavior: boolean,
    allyCode: string,
    parameters: CharacterListGenerationParameters
  ) => {
    dispatch(fetchCharacterList(mode, behavior, allyCode, parameters));
    dispatch(hideModal());
  },
  saveTemplate: (name: string) => dispatch(saveTemplate(name)),
  saveTemplates: (templates: CharacterTemplates) =>
    dispatch(saveTemplates(templates)),
  appendTemplate: (templateName: string) => {
    dispatch(appendTemplate(templateName));
    dispatch(hideModal());
  },
  replaceTemplate: (templateName: string) => {
    dispatch(replaceTemplate(templateName));
    dispatch(hideModal());
  },
  applyTemplateTargets: (templateName: string) => {
    dispatch(applyTemplateTargets(templateName));
    dispatch(hideModal());
  },
  exportTemplate: (
    templateName: string,
    callback: (template: CharacterTemplate) => void
  ) => {
    dispatch(exportCharacterTemplate(templateName, callback));
    dispatch(hideModal());
  },
  exportAllTemplates: (callback: (templates: CharacterTemplates) => void) => {
    dispatch(exportCharacterTemplates(callback));
    dispatch(hideModal());
  },
  deleteTemplate: (templateName: string) =>
    dispatch(deleteTemplate(templateName)),
});

type Props = PropsFromRedux & OwnProps & WithTranslation<"optimize-ui">;
type PropsFromRedux = ConnectedProps<typeof connector>;
type OwnProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(withTranslation("optimize-ui")(CharacterEditView));
