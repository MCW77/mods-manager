// react
import type React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { ThunkDispatch } from "#/state/reducers/modsOptimizer";
import { observer, reactive } from "@legendapp/state/react";

// styles
import "./CharacterList.css";

// state
import { characters$ } from "#/modules/characters/state/characters";
import { incrementalOptimization$ } from "#/modules/incrementalOptimization/state/incrementalOptimization";
import { lockedStatus$ } from "#/modules/lockedStatus/state/lockedStatus";
import { optimizerView$ } from "#/modules/optimizerView/state/optimizerView";
import { profilesManagement$ } from "#/modules/profilesManagement/state/profilesManagement";

// modules
import { CharacterEdit } from "#/state/modules/characterEdit";
import { Storage } from "#/state/modules/storage";

// domain
import type { CharacterNames } from "#/constants/characterSettings";

import * as Character from "#/domain/Character";
import * as OptimizationPlan from "#/domain/OptimizationPlan";

// components
import { CharacterAvatar } from "#/components/CharacterAvatar/CharacterAvatar";
import { Button } from "#ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#ui/select";

const ReactiveSelect = reactive(Select);

type CharacterBlockProps = {
	characterId: CharacterNames;
	target: OptimizationPlan.OptimizationPlan;
	index: number;
};

const characterBlockDragStart = (index: number) => {
  return (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.dropEffect = "move";
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", `${index}`);
    // We shouldn't have to do this, but Safari is ignoring both 'dropEffect' and 'effectAllowed' on drop
    const options = {
      effect: "move",
    };
    event.dataTransfer.setData("application/json", JSON.stringify(options));
  };
};

const characterBlockDragEnter = () => {
  return (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    (event.target as HTMLDivElement).classList.add("drop-character");
  };
};

const characterBlockDragOver = () => {
  return (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };
};

const characterBlockDragLeave = () => {
  return (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    (event.target as HTMLDivElement).classList.remove("drop-character");
  };
};

const CharacterBlock: React.FC<CharacterBlockProps> = observer(
  ({
    characterId,
    target,
    index,
  }: CharacterBlockProps) => {
    const dispatch: ThunkDispatch = useDispatch();
		const characters = useSelector(
			Storage.selectors.selectCharactersInActiveProfile,
		);
		const allycode = profilesManagement$.profiles.activeAllycode.get();
    const baseCharactersById = characters$.baseCharactersById.get();
    const character = characters[characterId];
    const selectedPlan = target.name;

    /**
     * @param dropCharacterIndex The index of the character on which the drop is occurring or null (No characters in the list)
     * @returns {Function}
     */
    const characterBlockDrop = (dropCharacterIndex: number | null) => {
      return (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        const options = JSON.parse(
          event.dataTransfer.getData("application/json"),
        );

        switch (options.effect) {
          case "add": {
            const movingCharacterID: CharacterNames =
              event.dataTransfer.getData("text/plain") as CharacterNames;
            const movingCharacter = characters[movingCharacterID];
            dispatch(
              CharacterEdit.thunks.selectCharacter(
                movingCharacterID,
                Character.defaultTarget(movingCharacter),
                dropCharacterIndex,
              ),
            );
            break;
          }
          case "move": {
            const movingCharacterIndex =
              +event.dataTransfer.getData("text/plain");
            dispatch(
              CharacterEdit.thunks.moveSelectedCharacter(
                movingCharacterIndex,
                dropCharacterIndex,
              ),
            );
            break;
          }
          default:
          // Do nothing
        }

        (event.target as HTMLDivElement).classList.remove("drop-character");
      };
    };

		/**
		 * Renders the set of 10 icons that show the state of a selected character
		 * @param character {Character}
		 * @param target {OptimizationPlan}
		 */
		const renderCharacterIcons = (
			character: Character.Character,
			target: OptimizationPlan.OptimizationPlan,
		) => {
			const restrictionsActive = OptimizationPlan.hasRestrictions(target)
				? "active"
				: "";
			const targetStatActive = target.targetStats?.length ? "active" : "";
			const negativeWeightsActive = OptimizationPlan.hasNegativeWeights(target)
				? "active"
				: "";
			const minimumDots = target.minimumModDots;
			const blankTargetActive = OptimizationPlan.isBlank(target)
				? "active"
				: "";
			const lockedActive = lockedStatus$.ofActivePlayerByCharacterId[
				character.baseID
			].get()
				? "active"
				: "";

			let handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
				const newTarget = structuredClone(target);
				newTarget.minimumModDots = Number(event.target.value);
				dispatch(
					CharacterEdit.thunks.finishEditCharacterTarget(
						character.baseID,
						newTarget,
					),
				);
				(document?.activeElement as HTMLSelectElement)?.blur();
			};
			handleChange = handleChange.bind(this);

			return (
				<div className={"character-icons"}>
					<span
						className={"icon minimum-dots"}
						title={`This character will only use mods with at least ${minimumDots} ${
							1 === minimumDots ? "dot" : "dots"
						}`}
					>
						<select value={minimumDots} onChange={handleChange}>
							{[1, 2, 3, 4, 5, 6].map((dots) => (
								<option key={dots} value={dots}>
									{dots}
								</option>
							))}
						</select>
						<span className={` ${1 < minimumDots ? "green active" : "gray"}`}>
							{minimumDots}
						</span>
					</span>
					<span
						className={`icon restrictions ${restrictionsActive}`}
						title={
							restrictionsActive
								? "This character has restrictions active"
								: "This character has no restrictions active"
						}
					/>
					<span
						className={`icon target ${targetStatActive}`}
						title={
							targetStatActive
								? "This character has a target stat selected"
								: "This character has no target stat selected"
						}
					/>
					<span
						className={`icon negative ${negativeWeightsActive}`}
						title={
							negativeWeightsActive
								? "This character's target has negative stat weights"
								: "This character's target has no negative stat weights"
						}
					/>
					<span
						className={`icon blank-target ${blankTargetActive}`}
						title={
							blankTargetActive
								? "This character's target has no assigned stat weights"
								: "This character's target has at least one stat given a value"
						}
					/>
					<span
						className={`icon locked ${lockedActive}`}
						onClick={() => {
							lockedStatus$.ofActivePlayerByCharacterId[
								character.baseID
							].toggle();
						}}
						onKeyUp={(event: React.KeyboardEvent<HTMLSpanElement>) => {
							if (event.key === "Enter") {
								lockedStatus$.ofActivePlayerByCharacterId[
									character.baseID
								].toggle();
							}
						}}
						title={
							lockedActive
								? "This character is locked. Its mods will not be assigned to other characters"
								: "This character is not locked"
						}
					/>
				</div>
			);
		};

		const showEditCharacterModal = (
			character: Character.Character,
			index: number,
			target: OptimizationPlan.OptimizationPlan,
		) => {
			incrementalOptimization$.indicesByProfile[allycode].set(index);
			optimizerView$.assign({
				currentCharacter: {
					id: character.baseID,
					index: index,
					target: structuredClone(target),
				},
				view: "edit",
			});
		};

    const options = Character.targets(character)
      .map((characterTarget) => characterTarget.name)
      .map((targetName) => {
        return (
          <SelectItem className={"w-32"} value={targetName} key={targetName}>
            {targetName}
          </SelectItem>
        );
      });

    const baseClass = `character-block cursor-grab ${character.baseID}`;

  return (
    <div
      className={"character-block-wrapper"}
      key={index}
      onDragEnter={characterBlockDragEnter()}
      onDragOver={characterBlockDragOver()}
      onDragLeave={characterBlockDragLeave()}
      onDrop={characterBlockDrop(index)}
      onDoubleClick={() =>
        dispatch(CharacterEdit.thunks.unselectCharacter(index))
      }
    >
      <div
        className={
          lockedStatus$.ofActivePlayerByCharacterId[character.baseID].get()
            ? `${baseClass} locked`
            : baseClass
        }
        draggable={true}
        onDragStart={characterBlockDragStart(index)}
      >
        {renderCharacterIcons(character, target)}
        <CharacterAvatar character={character} />
        <div className={"character-name"}>
          {baseCharactersById[character.baseID]
            ? baseCharactersById[character.baseID].name
            : character.baseID}
        </div>
        <div className={"target p-y-1 flex items-center flex-wrap gap-2"}>
          <ReactiveSelect
            $value={() => selectedPlan}
            onValueChange={(value) => {
              const target = Character.targets(character).find(
                (target) => target.name === value,
              );
              if (target !== undefined) {
                dispatch(
                  CharacterEdit.thunks.changeCharacterTarget(index, target),
                );
              }
            }}
          >
            <SelectTrigger
              className={"min-w-24 w-fit h-6 px-2 inline-flex"}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent
              className={"w-32 min-w-12"}
              position={"popper"}
              sideOffset={5}
            >
              {options}
            </SelectContent>
          </ReactiveSelect>
          <Button
            size={"xs"}
            type={"button"}
            onClick={() => showEditCharacterModal(character, index, target)}
          >
            Edit
          </Button>
        </div>
      </div>
    </div>
  );
});

CharacterBlock.displayName = "CharacterBlock";

export { CharacterBlock };
