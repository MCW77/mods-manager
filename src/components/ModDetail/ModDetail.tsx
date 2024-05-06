// react
import * as React from "react";
import { useSelector } from "react-redux";

// styles
import "./ModDetail.css";

// modules
import { Data } from "#/state/modules/data";
import { Storage } from "#/state/modules/storage";

// domain
import type * as Character from "#/domain/Character";
import type { Mod } from "#/domain/Mod";
import type * as OptimizationPlan from "#/domain/OptimizationPlan";

// components
import { Arrow } from "#/components/Arrow/Arrow";
import { CharacterAvatar } from "#/components/CharacterAvatar/CharacterAvatar";
import { ModImage } from "#/components/ModImage/ModImage";
import { ModStats } from "#/components/ModStats/ModStats";
import { SellModButton } from "#/components/SellModButton/SellModButton";
import { Label } from "../ui/label";

type ComponentProps = {
	assignedCharacter: Character.Character | null;
	assignedTarget?: OptimizationPlan.OptimizationPlan;
	mod: Mod;
	showAssigned?: boolean;
};

const ModDetail = React.memo(
	({
		assignedCharacter,
		assignedTarget,
		mod,
		showAssigned = false,
	}: ComponentProps) => {
		const baseCharacters = useSelector(Data.selectors.selectBaseCharacters);
		const characters = useSelector(
			Storage.selectors.selectCharactersInActiveProfile,
		);

		const character: Character.Character | null =
			mod.characterID !== "null" ? characters[mod.characterID] : null;

		return (
			<div className={"mod-detail"} key={mod.id}>
				<div className={"flex flex-col gap-6"}>
					<ModImage mod={mod} />
					{mod.pips === 6 &&
						<div className={" row-start-1 row-end-auto col-start-1 col-end-auto flex flex-col gap-1"}>
							<Label>Calibrations:</Label>
							<span className={"text-sm"}>{mod.reRolledCount}/{mod.tier+1} at {mod.reRollPrice()}</span>
						</div>
					}
				</div>
				{character && <CharacterAvatar character={character} />}
				{character && (
					<h4 className={"row-start-3 row-end-3 col-start-1 col-end-3 m-0 text-left font-normal text-sm"}>
						{baseCharacters[character.baseID]
							? baseCharacters[character.baseID].name
							: character.baseID}
					</h4>
				)}
				<div className="stats">
					<ModStats
						mod={mod}
						assignedCharacter={assignedCharacter}
						assignedTarget={assignedTarget}
					/>
					{showAssigned && assignedCharacter && (
						<div className={"flex justify-between"}>
							<Arrow className={"w-[4em] h-[4em]"} />
							<CharacterAvatar character={assignedCharacter} />
						</div>
					)}
				</div>
				<SellModButton mod={mod} />
			</div>
		);
	},
);

ModDetail.displayName = "ModDetail";

export { ModDetail };
