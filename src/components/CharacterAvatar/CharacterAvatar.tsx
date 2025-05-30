// react
import * as React from "react";

// styles
import "./CharacterAvatar.css";

// state
import { use$ } from "@legendapp/state/react";

const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader");

const characters$ = stateLoader$.characters$;

// domain
import {
	type BaseCharacter,
	defaultBaseCharacter,
} from "#/modules/characters/domain/BaseCharacter";
import type * as Character from "#/domain/Character";

type ComponentProps = {
	character?: Character.Character;
	displayGear?: boolean;
	displayLevel?: boolean;
	displayStars?: boolean;
	id?: string;
};

const CharacterAvatar = React.memo(
	({
		character,
		displayGear = true,
		displayLevel = true,
		displayStars = true,
		id,
	}: ComponentProps) => {
		const baseCharacterById = use$(characters$.baseCharacterById);

		if (character === undefined || character === null) return null;

		const baseCharacter: BaseCharacter = baseCharacterById[character.id] ?? {
			...defaultBaseCharacter,
			id: character.id,
			name: character.id,
		};
		const className = `avatar gear-${
			displayGear ? character.playerValues.gearLevel : 0
		} star-${character.playerValues.stars} align-${baseCharacter.alignment}`;

		const star: (position: number) => React.ReactNode = (position) => {
			const isActive = position <= character.playerValues.stars;
			const baseClass = isActive ? "active star" : "star";
			return (
				<div
					className={`${baseClass} star-${position}`}
					key={`star-${position}`}
				/>
			);
		};

		return (
			<div className={className} id={id}>
				{displayStars && [1, 2, 3, 4, 5, 6, 7].map(star)}
				<img
					src={baseCharacter.avatarUrl}
					loading={"lazy"}
					alt={baseCharacter.name}
					title={baseCharacter.name}
					draggable={false}
				/>
				{displayLevel && (
					<div className={"character-level"}>
						{character.playerValues.level}
					</div>
				)}
			</div>
		);
	},
);

CharacterAvatar.displayName = "CharacterAvatar";

export default CharacterAvatar;
