// react

// state
import { beginBatch, endBatch } from "@legendapp/state";
import { stateLoader$ } from "#/modules/stateLoader/stateLoader";

const profilesManagement$ = stateLoader$.profilesManagement$;
const compilations$ = stateLoader$.compilations$;

import { dialog$ } from "#/modules/dialog/state/dialog";
import { isBusy$ } from "#/modules/busyIndication/state/isBusy";
import { stackRank$ } from "#/modules/stackRank/state/stackRank";

// domain
import { characterSettings } from "#/constants/characterSettings";
import * as Character from "#/domain/Character";

// component
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSave } from "@fortawesome/free-solid-svg-icons";

import AddTemplateModal from "#/containers/CharacterEditView/AddTemplateModal";
import SaveTemplateModal from "#/containers/CharacterEditView/SaveTemplateModal";

import { HelpLink } from "#/modules/help/components/HelpLink";

import { Button } from "#ui/button";

interface TemplatesActionsProps {
	hasNoSelectedCharacters: boolean;
	visibleCharacters: Character.Character[];
	lastSelectedCharacterIndex: number;
}

const TemplatesActions = ({
	hasNoSelectedCharacters,
	visibleCharacters,
	lastSelectedCharacterIndex,
}: TemplatesActionsProps) => {
	return (
		<div className={"flex gap-2"}>
			<Button size="sm" onClick={() => dialog$.show(<AddTemplateModal />)}>
				<FontAwesomeIcon icon={faPlus} title={"Add template"} />
			</Button>
			<Button
				size="sm"
				onClick={async () => {
					try {
						isBusy$.set(true);
						beginBatch();
						if (hasNoSelectedCharacters) {
							visibleCharacters.forEach((character, index) => {
								compilations$.selectCharacter(
									character.id,
									Character.defaultTarget(characterSettings, character),
									index + lastSelectedCharacterIndex,
								);
							});
						}
						endBatch();
						const ranking = await stackRank$.fetch(
							profilesManagement$.profiles.activeAllycode.get(),
						);
						compilations$.applyRanking(ranking);
					} catch (error) {
						if (error instanceof Error) dialog$.showError(error.message);
					} finally {
						isBusy$.set(false);
					}
				}}
			>
				Auto-generate List
			</Button>
			<Button
				size="sm"
				disabled={hasNoSelectedCharacters}
				onClick={() => dialog$.show(<SaveTemplateModal />)}
			>
				<FontAwesomeIcon icon={faSave} title={"Save"} />
			</Button>
			<HelpLink title="" section="optimizer" topic={2} />
		</div>
	);
};

TemplatesActions.displayName = "TemplatesActions";

export default TemplatesActions;
