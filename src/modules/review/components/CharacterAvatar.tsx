// utils
import { cn } from "#/lib/utils";

// react
import * as React from "react";

// state
import { useValue } from "@legendapp/state/react";
import { stateLoader$ } from "#/modules/stateLoader/stateLoader";

const characters$ = stateLoader$.characters$;
import { review$ } from "../state/review";

// domain
import type { CharacterNames } from "#/constants/CharacterNames";
import {
  type BaseCharacter,
  defaultBaseCharacter,
} from "#/modules/characters/domain/BaseCharacter";

type ComponentProps = {
  characterId: CharacterNames;
  index: number;
  className?: string;
};

const CharacterAvatar = React.memo(
  ({ characterId, index, className = "" }: ComponentProps) => {
    const baseCharacterById = useValue(characters$.baseCharacterById);
    const isSelected = useValue(
      () => review$.selectedCharacter.get() === characterId,
    );
    const isFocused = useValue(
      () => review$.focusedCharacterIndex.get() === index,
    );

    if (
      characterId === undefined ||
      characterId === null ||
      characterId === "null"
    )
      return null;

    const baseCharacter: BaseCharacter = baseCharacterById[characterId] ?? {
      ...defaultBaseCharacter,
      id: characterId,
      name: characterId,
    };
    const avatarUrl =
      baseCharacter.avatarUrl === "" ? undefined : baseCharacter.avatarUrl;

    const avatarClassName = cn(
      ` relative inline-block size-16 m-1 rounded-full row-start-2 row-end-2 col-start-1 col-end-3 after:content-[''] after:block after:absolute after:w-full after:h-full after:box-border after:z-[29] after:left-0 after:top-[10px] after:bg-cover after:pointer-events-none ${isSelected ? "ring-3 text-mod-gold" : ""} ${isFocused ? "focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[hsl(var(--mod-blue))]" : ""}`,
      className,
    );

    return (
      <div
        className="flex flex-col items-center justify-center select-none"
        id={characterId}
      >
        <div
          className={avatarClassName}
          id={`character-option-${index}`}
          role="option"
          aria-selected={isSelected}
          data-character-index={index}
          tabIndex={-1}
          onFocus={() => {
            review$.focusedCharacterIndex.set(index);
          }}
          onClick={() => {
            review$.focusedCharacterIndex.set(index);
          }}
          onDoubleClick={() => {
            review$.selectedCharacter.set(characterId);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              review$.selectedCharacter.set(characterId);
            }
          }}
        >
          <div className={"grid h-16"}>
            <div
              className={
                "row-start-1 row-end-1 col-start-1 col-end-1 self-center"
              }
            >
              <img
                className={"rounded-full"}
                src={avatarUrl}
                loading={"lazy"}
                alt={baseCharacter.name}
                title={baseCharacter.name}
                draggable={false}
              />
            </div>
          </div>
        </div>
      </div>
    );
  },
);

CharacterAvatar.displayName = "CharacterAvatar";

export default CharacterAvatar;
