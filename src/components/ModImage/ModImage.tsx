// react
import * as React from "react";

// styles
import "./ModImage.css";

// state
import { profilesManagement$ } from "#/modules/profilesManagement/state/profilesManagement";

// domain
import type { CharacterNames } from "../../constants/characterSettings";

import type { Mod } from "../../domain/Mod";
import { SetStats } from "../../domain/Stats";

// components
import { CharacterAvatar } from "../CharacterAvatar/CharacterAvatar";
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

const ModImage = React.memo(
	({ className = "", mod, showAvatar = false }: ComponentProps) => {
		const characters = profilesManagement$.activeProfile.charactersById.get();
		const modColor = getModColor(mod);
		const character = mod.characterID
			? characters[mod.characterID as CharacterNames]
			: null;

		return (
			<div
				className={`mod-image dots-${mod.pips} ${
					mod.slot
				} ${SetStats.SetStat.getClassName(mod.set)} ${modColor} ${className}`}
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

export { ModImage };
