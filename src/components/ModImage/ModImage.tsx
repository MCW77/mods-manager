// react
import { lazy, memo } from "react";

// styles
import "./ModImage.css";

// state
import { use$ } from "@legendapp/state/react";

const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader");

const profilesManagement$ = stateLoader$.profilesManagement$;
// domain
import type { CharacterNames } from "#/constants/CharacterNames";

import type { Mod } from "#/domain/Mod";
import { SetStats } from "#/domain/Stats";

// components
const CharacterAvatar = lazy(
	() => import("../CharacterAvatar/CharacterAvatar"),
);
import { Pips } from "../Pips/Pips";

type ComponentProps = {
	className?: string;
	mod: Mod;
	showAvatar?: boolean;
};

const getModColor = (mod: Mod) => {
	switch (mod.tier) {
		case 5:
			return "gold";
		case 4:
			return "purple";
		case 3:
			return "blue";
		case 2:
			return "green";
		default:
			return "gray";
	}
};

const ModImage = memo(
	({ className = "", mod, showAvatar = false }: ComponentProps) => {
		const characterById = use$(profilesManagement$.activeProfile.characterById);
		const modColor = getModColor(mod);
		const character = mod.characterID
			? characterById[mod.characterID as CharacterNames]
			: null;

		return (
			<div
				className={`mod-image dots-${mod.pips} ${
					mod.slot
				} ${SetStats.SetStat.getClassName(mod.modset)} ${modColor} ${className}`}
			>
				<Pips pips={mod.pips} />
				<div className={"mod-slot-image"} />
				<div
					className={`mod-level ${15 === mod.level ? "gold " : "gray "}${
						mod.slot
					}`}
				>
					{mod.level}
				</div>
				{showAvatar && character && (
					<CharacterAvatar
						character={character}
						displayStars={false}
						displayGear={false}
						displayLevel={false}
					/>
				)}
			</div>
		);
	},
);

ModImage.displayName = "ModImage";

export default ModImage;
