// react
import { useValue } from "@legendapp/state/react";

// state
import { stateLoader$ } from "#/modules/stateLoader/stateLoader";

const roster$ = stateLoader$.roster$;

import { review$ } from "../state/review";

// domain
import { createModLoadout } from "#/domain/ModLoadout";

// components
import type { CharacterNames } from "#/constants/CharacterNames";
import ModLoadoutDetail from "./ModLoadoutDetail";

type CharacterModdingViewProps = {
	characterName: CharacterNames;
};

const CharacterModdingView = ({ characterName }: CharacterModdingViewProps) => {
	const newLoadout = useValue(review$.selectedCharacterNewLoadout);
	const oldLoadout = useValue(review$.selectedCharacterOldLoadout);
	const modding = useValue(review$.selectedCharacterModding);
	const characterById = useValue(roster$.activeCharacterById);
	const character = characterById[characterName] || {
		id: characterName,
		name: characterName,
	};

	return (
		<div className={"grid grid-cols-1 gap-6 justify-items-center"}>
			<ModLoadoutDetail
				newLoadout={createModLoadout(newLoadout)}
				oldLoadout={createModLoadout(oldLoadout)}
				character={character}
				useUpgrades={true}
				modAssignment={modding}
			/>
		</div>
	);
};

CharacterModdingView.displayName = "CharacterModdingView";

export default CharacterModdingView;
