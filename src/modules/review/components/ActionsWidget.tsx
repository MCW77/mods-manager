// react
import { lazy, useId } from "react";

// state
import { use$ } from "@legendapp/state/react";
const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader");

const profilesManagement$ = stateLoader$.profilesManagement$;
const compilations$ = stateLoader$.compilations$;
const hotutils$ = stateLoader$.hotutils$;

import { dialog$ } from "#/modules/dialog/state/dialog";
import { optimizerView$ } from "#/modules/optimizerView/state/optimizerView";

// domain
import type { CharacterModdings } from "#/modules/compilations/domain/CharacterModdings";

// components
const CreateProfileModal = lazy(
	() => import("#/modules/hotUtils/components/CreateProfileModal"),
);
const MoveModsModal = lazy(
	() => import("#/modules/modMove/components/MoveModsModal"),
);
const TextualReview = lazy(() => import("./TextualReview"));
import { Button } from "#ui/button";
import { Label } from "#ui/label";

const ActionsWidget = () => {
	const actionsId = useId();
	const modById = use$(() => profilesManagement$.activeProfile.modById.get());
	const modAssignments = use$(
		compilations$.defaultCompilation.flatCharacterModdings,
	);
	const hasActiveSession = use$(hotutils$.hasActiveSession);

	const modAssignments2: CharacterModdings = modAssignments
		.filter((x) => null !== x)
		.map(({ characterId, target, assignedMods, missedGoals }) => ({
			characterId,
			target,
			assignedMods: assignedMods
				? assignedMods.map((id) => modById.get(id)).filter((mod) => !!mod)
				: [],
			missedGoals: missedGoals || [],
		})) as CharacterModdings;

	const movingModsByAssignedCharacter: CharacterModdings = modAssignments2
		.map(({ characterId, target, assignedMods }) => ({
			characterId,
			target,
			assignedMods: assignedMods.filter(
				(mod) => mod.characterID !== characterId,
			),
			missedGoals: [],
		}))
		.filter(({ assignedMods }) => assignedMods.length);

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-2">
				<Button
					type={"button"}
					size={"sm"}
					onClick={() =>
						dialog$.show(
							<TextualReview modAssignments={movingModsByAssignedCharacter} />,
						)
					}
				>
					Show Summary
				</Button>
			</div>
			<div className="flex flex-col gap-2">
				<Label htmlFor="">I don't like these results...</Label>
				<Button
					type={"button"}
					onClick={() => optimizerView$.view.set("basic")}
				>
					Change my selection
				</Button>
			</div>
			<div id={`Hotutils-Actions-${actionsId}`} className="flex flex-col gap-2">
				<Label htmlFor={`Hotutils-Actions-${actionsId}`}>HotUtils</Label>
				<Button
					type={"button"}
					disabled={!hasActiveSession}
					onClick={() => dialog$.show(<CreateProfileModal />)}
				>
					Create Loadout
				</Button>
				<Button
					type={"button"}
					disabled={!hasActiveSession}
					onClick={() => dialog$.show(<MoveModsModal />)}
				>
					Move mods in-game
				</Button>
			</div>
		</div>
	);
};

ActionsWidget.displayName = "ActionsWidget";

export default ActionsWidget;
