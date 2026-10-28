// react
import * as React from "react";
import { useValue } from "@legendapp/state/react";

// state
import { stateLoader$ } from "#/modules/stateLoader/stateLoader";
const characters$ = stateLoader$.characters$;
import { review$ } from "#/modules/review/state/review";

// Mobile-specific avatar that selects on tap (no focus/selected distinction)
const CharacterAvatarMobile = React.memo(
  ({ characterId, index }: { characterId: string; index: number }) => {
    const baseCharacterById = useValue(characters$.baseCharacterById);
    const isSelected = useValue(
      () => review$.selectedCharacter.get() === characterId,
    );

    if (
      characterId === undefined ||
      characterId === null ||
      characterId === "null"
    )
      return null;

    const baseCharacter = baseCharacterById[characterId] ?? {
      id: characterId,
      name: characterId,
    };
    const avatarUrl =
      baseCharacter.avatarUrl === "" ? undefined : baseCharacter.avatarUrl;

    const handleSelect = () => {
      review$.selectedCharacter.set(characterId);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleSelect();
      }
    };

    return (
      <div className="flex flex-col items-center justify-center select-none">
        <div
          className={`relative inline-block size-16 m-1 rounded-full ${
            isSelected ? "ring-3 text-mod-gold" : ""
          }`}
          id={`character-option-${index}`}
          role="option"
          aria-selected={isSelected}
          data-character-index={index}
          tabIndex={0}
          onClick={handleSelect}
          onKeyDown={handleKeyDown}
        >
          <div className="grid h-16">
            <div className="row-start-1 row-end-1 col-start-1 col-end-1 self-center">
              <img
                className="rounded-full"
                src={avatarUrl}
                loading="lazy"
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

CharacterAvatarMobile.displayName = "CharacterAvatarMobile";

export default CharacterAvatarMobile;
