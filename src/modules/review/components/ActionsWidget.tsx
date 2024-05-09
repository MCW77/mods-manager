// react
import { useSelector } from "react-redux";

// utils
import { flatten } from "lodash-es";
import collectByKey from "#/utils/collectByKey";
import groupByKey from "#/utils/groupByKey";

// state
import { dialog$ } from "#/modules/dialog/state/dialog";
import { optimizerView$ } from "#/modules/optimizerView/state/optimizerView";

// modules
import { Storage } from "#/state/modules/storage";

// domain
import type { CharacterNames } from "#/constants/characterSettings";

import type { Mod } from "#/domain/Mod";
import type { ModAssignments } from "#/domain/ModAssignment";

// components
import { DefaultCollapsibleCard } from "#/components/DefaultCollapsibleCard";
import { CreateProfileModal } from "../../hotUtils/components/CreateProfileModal";
import { MoveModsModal } from "../../hotUtils/components/MoveModsModal";
import { TextualReview } from "./TextualReview";
import { Button } from "#ui/button";
import { Label } from "#ui/label";
import { hotutils$ } from "#/modules/hotUtils/state/hotUtils";

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
	const profile = useSelector(Storage.selectors.selectActiveProfile);

	const modsById = groupByKey(profile.mods, (mod) => mod.id);
	const modAssignments: ModAssignments = profile.modAssignments
		.filter((x) => null !== x)
		.map(({ id, target, assignedMods, missedGoals }) => ({
			id: id,
			target: target,
			assignedMods: assignedMods
				? assignedMods.map((id) => modsById[id]).filter((mod) => !!mod)
				: [],
			missedGoals: missedGoals || [],
		})) as ModAssignments;

	const currentModsByCharacter: Record<CharacterNames, Mod[]> = collectByKey(
		profile.mods.filter((mod) => mod.characterID !== "null"),
		(mod: Mod) => mod.characterID,
	);

	const movingModsByAssignedCharacter: ModAssignments = modAssignments
		.map(({ id, target, assignedMods }) => ({
			id: id,
			target: target,
			assignedMods: assignedMods.filter((mod) => mod.characterID !== id),
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
		movingModsByAssignedCharacter.map(({ id, assignedMods }) => {
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
