// react
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { ThunkDispatch } from "#/state/reducers/modsOptimizer";

// state
import { useSelector as useLegendSelector } from "@legendapp/state/react";
import { characters$ } from "#/modules/characters/state/characters";
import { dialog$ } from "#/modules/dialog/state/dialog";

// modules

import { Storage } from "#/state/modules/storage";

// domain
import type { Mod } from "#/domain/Mod";

// components
import { CharacterAvatar } from "#/components/CharacterAvatar/CharacterAvatar";
import { ModImage } from "#/components/ModImage/ModImage";
import { ModStats } from "#/components/ModStats/ModStats";
import { Button } from "#ui/button";
import { Label } from "#ui/label";

type ComponentProps = {
	mod: Mod;
};

const SellModButton = React.memo(({ mod }: ComponentProps) => {
	const dispatch: ThunkDispatch = useDispatch();
	const characters = useSelector(
		Storage.selectors.selectCharactersInActiveProfile,
	);
	const baseCharactersById = useLegendSelector(characters$.baseCharactersById);

	const deleteModal = () => {
		const character =
			mod.characterID !== "null" ? characters[mod.characterID] : null;

		return (
			<div>
				<h2>Delete Mod</h2>
				<div className={"delete-mod-display"}>
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
						<h4 className={"character-name"}>
							{baseCharactersById[character.baseID]
								? baseCharactersById[character.baseID].name
								: character.baseID}
						</h4>
					)}
					<ModStats mod={mod} />
				</div>
				<p>Are you sure you want to delete this mod from the mods optimizer?</p>
				<div className={"flex gap-2 justify-center"}>
					<Button
						type={"button"}
						onClick={() => {
							dialog$.hide();
						}}
					>
						No
					</Button>
					<Button
						type={"button"}
						onClick={() => {
							dispatch(Storage.thunks.deleteMod(mod));
							dialog$.hide();
						}}
						className={""}
						variant={"destructive"}
					>
						Yes, Delete Mod
					</Button>
				</div>
			</div>
		);
	};

	return (
		<Button
			type={"button"}
			variant={"destructive"}
			size={"xs"}
			className={"absolute top-0 right-0 m-2"}
			onClick={() => dialog$.show(deleteModal())}
		>
			X
		</Button>
	);
});

SellModButton.displayName = "SellModButton";

export { SellModButton };
