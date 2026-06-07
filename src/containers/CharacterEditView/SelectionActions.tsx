// react
import { useTranslation } from "react-i18next";
import { Show, useValue } from "@legendapp/state/react";

// state
import { beginBatch, endBatch, type Observable } from "@legendapp/state";
import { stateLoader$ } from "#/modules/stateLoader/stateLoader";

const profilesManagement$ = stateLoader$.profilesManagement$;
const characters$ = stateLoader$.characters$;
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
	const [t] = useTranslation("optimize-ui");

	const baseCharacterById = useValue(characters$.baseCharacterById);
	const selectedCharacters = useValue(
		compilations$.defaultCompilation.selectedCharacters,
	);
	const last6DotGuaranteedCharacter = useValue(() => {
		const selectedCharacters =
			compilations$.defaultCompilation.selectedCharacters.get();
		const minimalFull6Dot = profilesManagement$.minimalFull6Dot.get();
		return minimalFull6Dot > 0 && selectedCharacters.length >= minimalFull6Dot
			? baseCharacterById[selectedCharacters[minimalFull6Dot - 1].id].name
			: "";
	});

	return (
		<div className={"flex flex-col gap-4"}>
			<div className="flex flex-wrap gap-2">
				<Button
					className="flex flex-gap-2"
					type="button"
					onClick={() => compilations$.unselectAllCharacters()}
				>
					<FontAwesomeIcon icon={faBan} title="Clear" />{" "}
					{t("sidebar.selection.Clear")}
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
					{t("sidebar.selection.Lock")}
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
					{t("sidebar.selection.Unlock")}
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
								{t("sidebar.selection.Expand")}
							</>
						)}
					>
						<FontAwesomeIcon icon={faCompress} title="Normal View" />
						{t("sidebar.selection.Normal")}
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
					{t("sidebar.selection.AddAll")}
				</Button>
			</div>
			<div className="flex flex-col gap-1">
				<span>{t("sidebar.selection.Last6DotGuaranteed")}</span>
				<span>{last6DotGuaranteedCharacter}</span>
			</div>
		</div>
	);
};

SelectionActions.displayName = "SelectionActions";

export default SelectionActions;
