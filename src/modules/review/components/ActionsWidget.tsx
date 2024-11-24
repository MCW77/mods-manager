// utils
import { flatten } from "lodash-es";
import collectByKey from "#/utils/collectByKey";

// state
const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader");

const profilesManagement$ = stateLoader$.profilesManagement$;
const compilations$ = stateLoader$.compilations$;
const hotutils$ = stateLoader$.hotutils$;

import { dialog$ } from "#/modules/dialog/state/dialog";
import { optimizerView$ } from "#/modules/optimizerView/state/optimizerView";

// domain
import type { CharacterNames } from "#/constants/characterSettings";

import type { Mod } from "#/domain/Mod";

import type { CharacterModdings } from "#/modules/compilations/domain/CharacterModdings";

// components
import { CreateProfileModal } from "../../hotUtils/components/CreateProfileModal";
import { MoveModsModal } from "../../hotUtils/components/MoveModsModal";
import { TextualReview } from "./TextualReview";
import { Button } from "#ui/button";
import { Label } from "#ui/label";

// A map from number of pips that a mod has to the cost to remove it
const modRemovalCosts = {
	1: 550,
	2: 1050,
	3: 1900,
	4: 3000,
	5: 4750,
	6: 8000,
};

const ActionsWidget = () => {
	const modById = profilesManagement$.activeProfile.modById.get();
	const modAssignments =
		compilations$.defaultCompilation.flatCharacterModdings.get();

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

	const currentModsByCharacter: Record<CharacterNames, Mod[]> = collectByKey(
		modById.values().filter((mod) => mod.characterID !== "null"),
		(mod: Mod) => mod.characterID,
	);

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

	const movingMods = flatten(
		movingModsByAssignedCharacter.map(({ assignedMods }) => assignedMods),
	).filter((mod) => mod.characterID);

	// Mod cost is the cost of all mods that are being REMOVED. Every mod
	// being assigned to a new character (so that isn't already unassigned) is
	// being removed from that character. Then, any mods that used to be equipped
	// are also being removed.
	const removedMods = flatten(
		movingModsByAssignedCharacter.map(({ characterId: id, assignedMods }) => {
			const changingSlots = assignedMods.map((mod) => mod.slot);
			return currentModsByCharacter[id]
				? currentModsByCharacter[id].filter((mod) =>
						changingSlots.includes(mod.slot),
					)
				: [];
		}),
	).filter((mod) => !movingMods.includes(mod));

	const modCostBasis = movingMods.concat(removedMods);
	// Get a count of how much it will cost to move the mods. It only costs money to remove mods
	const modRemovalCost = modCostBasis.reduce(
		(cost, mod) => cost + modRemovalCosts[mod.pips],
		0,
	);

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
			<div id="Hotutils-Actions" className="flex flex-col gap-2">
				<Label htmlFor="Hotutils-Actions">HotUtils</Label>
				<Button
					type={"button"}
					disabled={!hotutils$.hasActiveSession.get()}
					onClick={() => dialog$.show(<CreateProfileModal />)}
				>
					Create Loadout
				</Button>
				<Button
					type={"button"}
					disabled={!hotutils$.hasActiveSession.get()}
					onClick={() => dialog$.show(<MoveModsModal />)}
				>
					Move mods in-game
				</Button>
			</div>
		</div>
	);
};

ActionsWidget.displayName = "ActionsWidget";

export { ActionsWidget };
