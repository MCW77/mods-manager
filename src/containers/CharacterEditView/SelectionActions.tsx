// state
import { beginBatch, endBatch, type Observable } from "@legendapp/state";
import { Show, useValue } from "@legendapp/state/react";
import { stateLoader$ } from "#/modules/stateLoader/stateLoader";

const compilations$ = stateLoader$.compilations$;
const lockedStatus$ = stateLoader$.lockedStatus$;

import { isBusy$ } from "#/modules/busyIndication/state/isBusy";

// domain
import { characterSettings } from "#/constants/characterSettings";
import * as Character from "#/domain/Character";

// component
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faBan,
	faCompress,
	faExpand,
	faLock,
	faPlus,
	faUnlock,
} from "@fortawesome/free-solid-svg-icons";

import { Button } from "#ui/button";

interface SelectionActionsProps {
	visibleCharacters: Character.Character[];
	lastSelectedCharacterIndex: number;
	isSelectionExpanded$: Observable<boolean>;
}

const SelectionActions = ({
	visibleCharacters,
	lastSelectedCharacterIndex,
	isSelectionExpanded$,
}: SelectionActionsProps) => {
	const selectedCharacters = useValue(
		compilations$.defaultCompilation.selectedCharacters,
	);

	return (
		<div className="flex flex-wrap gap-2">
			<Button
				className="flex flex-gap-2"
				type="button"
				onClick={() => compilations$.unselectAllCharacters()}
			>
				<FontAwesomeIcon icon={faBan} title="Clear" /> Clear
			</Button>
			<Button
				className="flex flex-gap-2"
				type="button"
				onClick={() => {
					beginBatch();
					for (const selectedCharacter of selectedCharacters) {
						lockedStatus$.lockedCharactersForActivePlayer.add(
							selectedCharacter.id,
						);
					}
					endBatch();
				}}
			>
				<FontAwesomeIcon icon={faLock} title="Lock All" />
				Lock All
			</Button>
			<Button
				className="flex flex-gap-2"
				type="button"
				onClick={() => {
					beginBatch();
					for (const selectedCharacter of selectedCharacters) {
						lockedStatus$.lockedCharactersForActivePlayer.delete(
							selectedCharacter.id,
						);
					}
					endBatch();
				}}
			>
				<FontAwesomeIcon icon={faUnlock} title="Unlock All" />
				Unlock All
			</Button>
			<Button
				className="flex flex-gap-2"
				type="button"
				onClick={() => isSelectionExpanded$.toggle()}
			>
				<Show
					if={isSelectionExpanded$}
					else={() => (
						<>
							<FontAwesomeIcon icon={faExpand} title="Expand View" />
							Expand View
						</>
					)}
				>
					<FontAwesomeIcon icon={faCompress} title="Normal View" />
					Normal View
				</Show>
			</Button>
			<Button
				className="flex flex-gap-2"
				type="button"
				onClick={() => {
					isBusy$.set(true);
					visibleCharacters.forEach((character, index) => {
						compilations$.selectCharacter(
							character.id,
							Character.defaultTarget(characterSettings, character),
							index + lastSelectedCharacterIndex,
						);
					});
					isBusy$.set(false);
				}}
			>
				<FontAwesomeIcon icon={faPlus} title={"Add all"} />
				Add all
			</Button>
		</div>
	);
};

SelectionActions.displayName = "SelectionActions";

export default SelectionActions;
