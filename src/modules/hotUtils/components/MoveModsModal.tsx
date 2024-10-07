// react
import { useDispatch } from "react-redux";
import type { ThunkDispatch } from "#/state/reducers/modsOptimizer";

// utils
import { flatten } from "lodash-es";
import collectByKey from "#/utils/collectByKey";
import { formatNumber } from "#/utils/formatNumber";
import groupByKey from "#/utils/groupByKey";

//state
import { hotutils$ } from "../state/hotUtils";
import { dialog$ } from "#/modules/dialog/state/dialog";
import { lockedStatus$ } from "#/modules/lockedStatus/state/lockedStatus";
import { profilesManagement$ } from "#/modules/profilesManagement/state/profilesManagement";

// domain
import type { CharacterNames } from "#/constants/characterSettings";

import type { Mod } from "#/domain/Mod";
import type { ModAssignments } from "#/domain/ModAssignment";

// components
import { Credits } from "#/components/Credits/Credits";
import { Button } from "#ui/button";

interface HUModsProfile {
	id: CharacterNames;
	modIds: string[];
	target: string;
}
type HUModsProfiles = HUModsProfile[];
export interface HUModsMoveProfile {
	units: HUModsProfiles;
}

// A map from number of pips that a mod has to the cost to remove it
const modRemovalCosts = {
	1: 550,
	2: 1050,
	3: 1900,
	4: 3000,
	5: 4750,
	6: 8000,
};

const MoveModsModal = () => {
	const dispatch: ThunkDispatch = useDispatch();
	const profileMods = profilesManagement$.activeProfile.mods.get();
	const activeProfile = profilesManagement$.activeProfile.get();

	const currentModsByCharacter: Record<CharacterNames, Mod[]> = collectByKey(
		profileMods.filter((mod) => mod.characterID !== "null"),
		(mod: Mod) => mod.characterID,
	);

	const modsById = groupByKey(profileMods, (mod) => mod.id);
	const modAssignments: ModAssignments = activeProfile.modAssignments
		.filter((x) => null !== x)
		.map(({ id, target, assignedMods, missedGoals }) => ({
			id: id,
			target: target,
			assignedMods: assignedMods
				? assignedMods.map((id) => modsById[id]).filter((mod) => !!mod)
				: [],
			missedGoals: missedGoals || [],
		})) as ModAssignments;

	const movingModsByAssignedCharacter = modAssignments
		.map(({ id, target, assignedMods }) => ({
			id: id,
			target: target,
			assignedMods: assignedMods.filter((mod) => mod.characterID !== id),
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

	const generateHotUtilsProfile = () => {
		const assignedMods = activeProfile.modAssignments
			.filter((x) => null !== x)
			.filter(
				({ id }) => activeProfile.characterById[id].playerValues.level >= 50,
			)
			.map(({ id, assignedMods, target }) => ({
				id: id,
				modIds: assignedMods,
				target: target.id,
			}));

		const lockedMods = (
			Object.entries(currentModsByCharacter) as [CharacterNames, Mod[]][]
		)
			.filter(([id]) => lockedStatus$.ofActivePlayerByCharacterId[id])
			.map(([id, mods]) => ({
				id: id,
				modIds: mods.map(({ id }) => id),
				target: "locked",
			}));

		return assignedMods.concat(lockedMods);
	};

	return (
		<div className={"flex flex-col gap-2"}>
			<h2>Move mods in-game using HotUtils</h2>
			<h3>
				Moving your mods will cost
				<br />
				<span
					className={
						"inline-block border-1 border-solid border-[dodgerblue] p-[.25em]"
					}
				>
					<strong className={"white"}>{formatNumber(modRemovalCost)}</strong>{" "}
					<Credits />
				</span>
			</h3>
			<p>
				This will move all of your mods as recommended by Grandivory's Mods
				Optimizer. Please note that{" "}
				<strong className={"gold"}>
					this action will log you out of Galaxy of Heroes if you are currently
					logged in
				</strong>
				.
			</p>
			<p>
				Moving your mods can take several minutes. Please be patient and allow
				the process to complete before refreshing or logging back into Galaxy of
				Heroes.
			</p>
			<p>
				<strong>Use at your own risk!</strong> HotUtils functionality breaks the
				terms of service for Star Wars: Galaxy of Heroes. You assume all risk in
				using this tool. Grandivory's Mods Optimizer is not associated with
				HotUtils.
			</p>
			<div className={"flex gap-2 justify-center"}>
				<Button
					type={"button"}
					variant={"destructive"}
					onClick={() => dialog$.hide()}
				>
					Cancel
				</Button>
				<Button
					type={"button"}
					onClick={() => {
						const profile: HUModsMoveProfile = {
							units: generateHotUtilsProfile(),
						};
						hotutils$.moveMods(profile, dispatch);
					}}
				>
					Move my mods
				</Button>
			</div>
		</div>
	);
};

MoveModsModal.displayName = "MoveModsModal";

export { MoveModsModal };
