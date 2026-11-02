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
		omis: [],
		playerValues: {
			equippedStats: {
				"Accuracy %": 0,
				Armor: 0,
				"Critical Avoidance %": 0,
				"Critical Damage %": 0,
				Health: 0,
				"Potency %": 0,
				Protection: 0,
				"Physical Critical Chance %": 0,
				"Physical Damage": 0,
				Resistance: 0,
				"Special Critical Chance %": 0,
				"Special Damage": 0,
				Speed: 0,
				"Tenacity %": 0,
			},
			galacticPower: 0,
			gearLevel: 13,
			gearPieces: [],
			level: 85,
			relicTier: 0,
			stars: 7,
		},
		targets: [],
		zetas: [],
	};

	return (
		<div className={"grid grid-cols-1 gap-6 justify-items-stretch"}>
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
