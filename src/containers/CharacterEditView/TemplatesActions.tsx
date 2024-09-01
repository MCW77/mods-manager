// state
import { dialog$ } from "#/modules/dialog/state/dialog";
import { isBusy$ } from "#/modules/busyIndication/state/isBusy";
import { profilesManagement$ } from "#/modules/profilesManagement/state/profilesManagement";
import { stackRank$ } from "#/modules/stackRank/state/stackRank";

// domain
import * as Character from "#/domain/Character";

// component
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSave } from "@fortawesome/free-solid-svg-icons";

import { AddTemplateModal } from "./AddTemplateModal";
import { SaveTemplateModal } from "./SaveTemplateModal";

import { Button } from "#ui/button";

import { HelpLink } from "#/modules/help/components/HelpLink";

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
						if (hasNoSelectedCharacters) {
							isBusy$.set(true);
							visibleCharacters.forEach((character, index) => {
								profilesManagement$.selectCharacter(
									character.id,
									Character.defaultTarget(character),
									index + lastSelectedCharacterIndex,
								);
							});
							isBusy$.set(false);
						}
						const ranking = await stackRank$.fetch(
							profilesManagement$.profiles.activeAllycode.get(),
						);
						profilesManagement$.applyRanking(ranking);
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

export { TemplatesActions };
