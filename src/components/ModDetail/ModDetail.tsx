// react
import { memo, lazy } from "react";

// styles
import "./ModDetail.css";

// state
const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader");

const profilesManagement$ = stateLoader$.profilesManagement$;
const characters$ = stateLoader$.characters$;

// domain
import type * as Character from "#/domain/Character";
import type { Mod } from "#/domain/Mod";
import type * as OptimizationPlan from "#/domain/OptimizationPlan";

// components
import { Arrow } from "#/components/Arrow/Arrow";
const CharacterAvatar = lazy(
	() => import("#/components/CharacterAvatar/CharacterAvatar"),
);
const ModImage = lazy(() => import("#/components/ModImage/ModImage"));
const ModStats = lazy(() => import("#/components/ModStats/ModStats"));
const SellModButton = lazy(
	() => import("#/components/SellModButton/SellModButton"),
);
import { Label } from "#ui/label";

type ComponentProps = {
	assignedTarget?: OptimizationPlan.OptimizationPlan;
	mod: Mod;
};

const ModDetail = memo(({ assignedTarget, mod }: ComponentProps) => {
	const baseCharacterById = characters$.baseCharacterById.get();
	const characterById = profilesManagement$.activeProfile.characterById.get();

	const character: Character.Character | null =
		mod.characterID !== "null" ? characterById[mod.characterID] : null;

	return (
		<div className={"mod-detail"} key={mod.id}>
			<div className={"flex flex-col gap-6"}>
				<ModImage mod={mod} />
			</div>
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
			<div className="stats">
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
