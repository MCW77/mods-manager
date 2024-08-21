// react
import { useSelector } from "react-redux";

// utils
import collectByKey from "#/utils/collectByKey";

// state
import { observer, reactive, useObservable } from "@legendapp/state/react";

import { dialog$ } from "#/modules/dialog/state/dialog";
import { hotutils$ } from "#/modules/hotUtils/state/hotUtils";
import { lockedStatus$ } from "#/modules/lockedStatus/state/lockedStatus";

// modules
import { Storage } from "#/state/modules/storage";

// domain
import type { CharacterNames } from "#/constants/characterSettings";

import type { Mod } from "#/domain/Mod";
import type { ProfileCreationData } from "#/modules/hotUtils/domain/ProfileCreationData";

// components
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";

const ReactiveInput = reactive(Input);

const CreateProfileModal: React.FC = observer(() => {
	const profile = useSelector(Storage.selectors.selectActiveProfile);

	const currentModsByCharacter: Record<CharacterNames, Mod[]> = collectByKey(
		profile.mods.filter((mod) => mod.characterID !== "null"),
		(mod: Mod) => mod.characterID,
	);

	const input$ = useObservable({
		category: "Grandivory",
		name: "",
	});

	const generateHotUtilsProfile = () => {
		const assignedMods = profile.modAssignments
			.filter((x) => null !== x)
			.filter(({ id }) => profile.characters[id].playerValues.level >= 50)
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

	let categoryInput: HTMLInputElement | null;
	let profileNameInput: HTMLInputElement | null;
	let error: HTMLParagraphElement | null;

	const createLoudout = () => {
		const profile: ProfileCreationData = {
			set: {
				category: categoryInput?.value ?? "",
				name: profileNameInput?.value ?? "",
				units: generateHotUtilsProfile(),
			},
		};

		hotutils$.createProfile(profile);
	};

	return (
		<div className={"flex flex-col gap-2"}>
			<h2>Create a new HotUtils loudout</h2>
			<p className={"center"}>
				Please note that using the same name as an existing loudout will cause
				it to be overwritten.
			</p>
			<div className={"form-row"}>
				<Label htmlFor={"categoryName"}>Category:</Label>
				<ReactiveInput
					id={"categoryName"}
					type={"text"}
					$value={input$.category}
					onChange={(e) => input$.category.set(e.target.value)}
				/>
			</div>
			<div className={"form-row"}>
				<Label htmlFor={"loudoutName"}>Loudout Name:</Label>
				<ReactiveInput
					id={"loudoutName"}
					type={"text"}
					$value={input$.name}
					onChange={(e) => input$.name.set(e.target.value)}
				/>
			</div>
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
					disabled={input$.category.get() === "" || input$.name.get() === ""}
					onClick={() => {
						dialog$.hide();
						createLoudout();
					}}
				>
					Create Loudout
				</Button>
			</div>
		</div>
	);
});

CreateProfileModal.displayName = "CreateProfileModal";

export { CreateProfileModal };
