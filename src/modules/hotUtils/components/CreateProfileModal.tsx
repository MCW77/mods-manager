// utils
import collectByKey from "#/utils/collectByKey";

// state
import {
	observer,
	reactive,
	use$,
	useObservable,
} from "@legendapp/state/react";

const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader");

const profilesManagement$ = stateLoader$.profilesManagement$;
const compilations$ = stateLoader$.compilations$;
const hotutils$ = stateLoader$.hotutils$;
const lockedStatus$ = stateLoader$.lockedStatus$;

import { dialog$ } from "#/modules/dialog/state/dialog";

// domain
import type { CharacterNames } from "#/constants/CharacterNames";

import type { Mod } from "#/domain/Mod";
import type { ProfileCreationData } from "#/modules/hotUtils/domain/ProfileCreationData";

// components
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";

const ReactiveInput = reactive(Input);

const CreateProfileModal: React.FC = observer(() => {
	const modById = use$(() => profilesManagement$.activeProfile.modById.get());
	const modAssignments = use$(
		compilations$.defaultCompilation.flatCharacterModdings,
	);
	const characterById = use$(profilesManagement$.activeProfile.characterById);

	const currentModsByCharacter: Record<CharacterNames, Mod[]> = collectByKey(
		modById.values().filter((mod) => mod.characterID !== "null"),
		(mod: Mod) => mod.characterID,
	);

	const input$ = useObservable({
		category: "Grandivory",
		name: "",
	});
	const input = use$(input$);

	const generateHotUtilsProfile = () => {
		const assignedMods = modAssignments
			.filter((x) => null !== x)
			.filter(
				({ characterId }) =>
					characterById[characterId].playerValues.level >= 50,
			)
			.map(({ characterId, assignedMods, target }) => ({
				id: characterId,
				modIds: assignedMods,
				target: target.id,
			}));

		const lockedMods = (
			Object.entries(currentModsByCharacter) as [CharacterNames, Mod[]][]
		)
			.filter(([id]) => lockedStatus$.ofActivePlayerByCharacterId[id].peek())
			.map(([id, mods]) => ({
				id: id,
				modIds: mods.map(({ id }) => id),
				target: "locked",
			}));

		return assignedMods.concat(lockedMods);
	};

	const createLoudout = () => {
		const profile: ProfileCreationData = {
			set: {
				category: input$.category.peek(),
				name: input$.name.peek(),
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
					disabled={input.category === "" || input.name === ""}
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

export default CreateProfileModal;
