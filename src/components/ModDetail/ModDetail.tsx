// react
import { memo } from "react";

// state
import { useValue } from "@legendapp/state/react";
import { stateLoader$ } from "#/modules/stateLoader/stateLoader";

const profilesManagement$ = stateLoader$.profilesManagement$;
const characters$ = stateLoader$.characters$;

// domain
import type * as Character from "#/domain/Character";
import type { Mod } from "#/domain/Mod";
import type * as OptimizationPlan from "#/domain/OptimizationPlan";

// components
import CharacterAvatar from "#/components/CharacterAvatar/CharacterAvatar";
import ModImage from "#/components/ModImage/ModImage";
import ModStats from "#/components/ModStats/ModStats";
import SellModButton from "#/components/SellModButton/SellModButton";
import { Label } from "#ui/label";

type ComponentProps = {
	assignedTarget?: OptimizationPlan.OptimizationPlan;
	mod: Mod;
};

const ModDetail = memo(({ assignedTarget, mod }: ComponentProps) => {
	const baseCharacterById = useValue(characters$.baseCharacterById);
	const characterById = useValue(
		profilesManagement$.activeProfile.characterById,
	);

	const character: Character.Character | null =
		mod.characterID !== "null" ? characterById[mod.characterID] : null;

	return (
		<div
			className={
				"relative inline-grid p-1 w-84 grid-cols-[5em_1fr] grid-rows-[1fr_auto_auto] gap-x-2 gap-y-1 items-start text-foreground dark:bg-blue-900 bg-blue-200 dark:bg-opacity-40 border-1 border-solid border-blue-500 text-shadow-md"
			}
			key={mod.id}
		>
			<ModImage mod={mod} />
			{character && <CharacterAvatar character={character} />}
			{character && (
				<h4
					className={
						"row-start-3 row-end-3 col-start-1 col-end-3 m-0 text-left font-normal text-sm"
					}
				>
					{baseCharacterById[character.id]
						? baseCharacterById[character.id].name
						: character.id}
				</h4>
			)}
			<div className="stats text-[0.9em] row-start-1 row-span-2 col-start-2 col-span-2">
				<ModStats mod={mod} assignedTarget={assignedTarget} />
			</div>
			{mod.pips === 6 && (
				<div
					className={
						" row-start-2 col-start-2 col-span-2 self-end m-b-1 flex gap-1 items-center"
					}
				>
					<Label>Calibrations:</Label>
					<span className={"text-sm"}>
						{mod.reRolledCount}/{mod.tier + 1} at {mod.reRollPrice()}
					</span>
				</div>
			)}
			<SellModButton mod={mod} />
		</div>
	);
});

ModDetail.displayName = "ModDetail";

export default ModDetail;
