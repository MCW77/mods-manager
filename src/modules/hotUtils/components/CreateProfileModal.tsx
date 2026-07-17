// utils
import collectByKey from "#/utils/collectByKey";

// state
import { observer, useValue, useObservable } from "@legendapp/state/react";
import { stateLoader$ } from "#/modules/stateLoader/stateLoader";

const compilations$ = stateLoader$.compilations$;
const hotutils$ = stateLoader$.hotutils$;
const lockedStatus$ = stateLoader$.lockedStatus$;
const mods$ = stateLoader$.mods$;
const roster$ = stateLoader$.roster$;

// domain
import type { CharacterNames } from "#/constants/CharacterNames";

import type { Mod } from "#/domain/Mod";
import type { ProfileCreationData } from "#/modules/hotUtils/domain/ProfileCreationData";

// components
import { Input } from "#/components/reactive/Input";

import { Button } from "#ui/button";
import {
	DialogClose,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "#ui/dialog";
import { Label } from "#ui/label";

const CreateProfileModal: React.FC = observer(() => {
	const modById = useValue(() => mods$.activeModById.get());
	const modAssignments = useValue(
		compilations$.defaultCompilation.flatCharacterModdings,
	);
	const characterById = useValue(roster$.activeCharacterById);

	const currentModsByCharacter: Record<CharacterNames, Mod[]> = collectByKey(
		modById.values().filter((mod) => mod.characterID !== "null"),
		(mod: Mod) => mod.characterID,
	);

	const input$ = useObservable({
		category: "Grandivory",
		name: "",
	});
	const input = useValue(input$);

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
			.filter(([id]) => lockedStatus$.lockedCharactersForActivePlayer.has(id))
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
		<>
			<DialogHeader>
				<DialogTitle>Create a new HotUtils loudout</DialogTitle>
				<DialogDescription>
					Please note that using the same name as an existing loudout will cause
					it to be overwritten.
				</DialogDescription>
			</DialogHeader>
			<div>
				<Label htmlFor={"categoryName"}>Category:</Label>
				<Input id={"categoryName"} type={"text"} $value={input$.category} />
			</div>
			<div>
				<Label htmlFor={"loudoutName"}>Loudout Name:</Label>
				<Input id={"loudoutName"} type={"text"} $value={input$.name} />
			</div>
			<DialogFooter className="sm:justify-center pb-1">
				<div className="flex flex-row gap-2 items-center justify-center">
					<DialogClose
						render={
							<Button type={"button"} variant={"destructive"}>
								Cancel
							</Button>
						}
					/>
					<DialogClose
						render={
							<Button
								type={"button"}
								disabled={input.category === "" || input.name === ""}
								onClick={() => {
									createLoudout();
								}}
							>
								Create Loudout
							</Button>
						}
					/>
				</div>
			</DialogFooter>
		</>
	);
});

CreateProfileModal.displayName = "CreateProfileModal";

export default CreateProfileModal;
