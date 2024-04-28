// react
// biome-ignore lint/style/useImportType: <explanation>
import React, { PureComponent } from "react";
import { withTranslation, type WithTranslation } from "react-i18next";
import { connect, type ConnectedProps } from "react-redux";
import type { ThunkDispatch } from "#/state/reducers/modsOptimizer";

// styles
import "./CharacterEditView.css";

// state
import type { IAppState } from "#/state/storage";

import { observable } from "@legendapp/state";

import { charactersManagement$ } from "#/modules/charactersManagement/state/charactersManagement";

// modules
import { CharacterEdit } from "#/state/modules/characterEdit";
import { Data } from "#/state/modules/data";
import { Storage } from "#/state/modules/storage";

// domain
import { characterSettings } from "#/constants/characterSettings";

import { defaultBaseCharacter } from "#/domain/BaseCharacter";
import * as Character from "#/domain/Character";

// components
import { DefaultCollapsibleCard } from "#/components/DefaultCollapsibleCard";

// containers
import { CharacterList } from "#/containers/CharacterList/CharacterList";
import { SelectionActions } from "./SelectionActions";
import { TemplatesActions } from "./TemplatesActions";
import { CharacterActions } from "./CharacterActions";
import { CharacterFilters } from "./CharacterFilters";
import { CharacterWidget } from "./CharacterWidget";


const isSelectionExpanded$ = observable(false);
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

  render() {
    return (
      <div className={`character-edit flex flex-col flex-grow-1 ${isSelectionExpanded$.get() ? "sort-view" : ""}`}>
        <div className="flex flex-gap-2 flex-wrap justify-around items-stretch w-full p-y-2">
          <DefaultCollapsibleCard title="Filters">
           <CharacterFilters />
          </DefaultCollapsibleCard>
          <DefaultCollapsibleCard title="Actions">
            <CharacterActions />
          </DefaultCollapsibleCard>
          <DefaultCollapsibleCard title="Selection">
            <SelectionActions visibleCharacters={this.props.highlightedCharacters} lastSelectedCharacterIndex={this.props.lastSelectedCharacter} isSelectionExpanded$={isSelectionExpanded$}/>
          </DefaultCollapsibleCard>
          <DefaultCollapsibleCard title="Templates">
            <TemplatesActions hasNoSelectedCharacters={this.props.selectedCharacters.length === 0} visibleCharacters={this.props.highlightedCharacters} lastSelectedCharacterIndex={this.props.lastSelectedCharacter}/>
          </DefaultCollapsibleCard>
        </div>
        <div className="flex h-full">
          <div
            className="available-characters"
            onDragEnter={CharacterEditView.availableCharactersDragEnter}
            onDragOver={CharacterEditView.dragOver}
            onDragLeave={CharacterEditView.dragLeave}
            onDrop={this.availableCharactersDrop.bind(this)}
          >
            <div className={"grid grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] p-x-1"}>
              {this.props.highlightedCharacters.map((character) =>
                <CharacterWidget key={character.baseID} character={character} className={"active"} />
              )}
              {this.props.availableCharacters.map((character) =>
                <CharacterWidget key={character.baseID} character={character} className={"inactive"} />
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
}

const mapStateToProps = (state: IAppState) => {
  const profile = Storage.selectors.selectActiveProfile(state);
  const characters = Storage.selectors.selectCharactersInActiveProfile(state);
  const baseCharacters = Data.selectors.selectBaseCharacters(state);
  let availableCharacters = [] as Character.Character[];

  availableCharacters = Object.values(characters)
    .filter((character) => character.playerValues.level >= 50)
    .filter(
      (character) =>
        !charactersManagement$.filters.hideSelectedCharacters.get() ||
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
  const filterCharacters = (character: Character.Character) => {
    const baseCharacter = baseCharacters[character.baseID] ?? {
      ...defaultBaseCharacter,
      baseID: character.baseID,
      name: character.baseID,
    };
    const characterFilter = charactersManagement$.filters.characterFilter.get();

    return (
      characterFilter === "" ||
      baseCharacter.name.toLowerCase().includes(characterFilter) ||
      (["lock", "locked"].includes(characterFilter) &&
        character.optimizerSettings.isLocked) ||
      (["unlock", "unlocked"].includes(characterFilter) &&
        !character.optimizerSettings.isLocked) ||
      baseCharacter.categories
        .concat(
          characterSettings[character.baseID]
            ? characterSettings[character.baseID].extraTags
            : []
        )
        .some((tag) => tag.toLowerCase().includes(characterFilter))
    );
  };

  return {
    highlightedCharacters: availableCharacters.filter(filterCharacters),
    availableCharacters: availableCharacters
      ? availableCharacters.filter((c) => !filterCharacters(c))
      : [],
    selectedCharacters: profile.selectedCharacters ?? {},
    lastSelectedCharacter: profile.selectedCharacters.length - 1,
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  unselectCharacter: (characterIndex: number) =>
    dispatch(CharacterEdit.thunks.unselectCharacter(characterIndex)),
});

type Props = PropsFromRedux & WithTranslation<"optimize-ui">;
type PropsFromRedux = ConnectedProps<typeof connector>;

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(withTranslation("optimize-ui")(CharacterEditView));
