// react
import { memo, Suspense } from "react";

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

import { Card, CardContent } from "#ui/card";
import { Label } from "#ui/label";

type CharacterNameProps = {
	character: Character.Character;
};

function CharacterName({ character }: CharacterNameProps) {
	const name = useValue(
		() =>
			characters$.baseCharacterById[character.id].name.get() || character.id,
	);

	return (
		<h4
			className={
				"row-start-3 row-end-3 col-start-1 col-end-3 m-0 text-left font-normal text-sm"
			}
		>
			{name}
		</h4>
	);
}
type ModDetailProps = {
	assignedTarget?: OptimizationPlan.OptimizationPlan;
	mod: Mod;
};

const ModDetail = memo(({ assignedTarget, mod }: ModDetailProps) => {
	const character = useValue(() => {
		if (mod.characterID === "null") return null;
		return (
			profilesManagement$.activeProfile.characterById[mod.characterID].get() ||
			null
		);
	});

	return (
		<Card key={mod.id}>
			<CardContent className={"p-2"}>
				<div
					className={
						"relative inline-grid p-1 w-80 grid-cols-[5em_1fr] grid-rows-[1fr_auto_auto] gap-x-2 gap-y-1 items-start"
					}
				>
					<Suspense
						fallback={
							<div className="col-span-3 row-span-3 h-40 w-full animate-pulse bg-muted/20" />
						}
					>
						<ModImage mod={mod} />
						{character && <CharacterAvatar character={character} />}
						{character && <CharacterName character={character} />}
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
					</Suspense>
				</div>
			</CardContent>
		</Card>
	);
});

ModDetail.displayName = "ModDetail";

export default ModDetail;
