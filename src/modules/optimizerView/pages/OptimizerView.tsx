// react
import { memo } from "react";
import { Switch, useValue } from "@legendapp/state/react";

// state
import { stateLoader$ } from "#/modules/stateLoader/stateLoader";

const roster$ = stateLoader$.roster$;
import { optimizerView$ } from "#/modules/optimizerView/state/optimizerView";

// containers
import CharacterEditView from "../components/CharacterEditView/CharacterEditView";

import CharacterEditForm from "#/modules/planEditing/pages/CharacterEditForm";
import ReviewWrapper from "#/modules/review/pages/ReviewWrapper";

const OptimizerView = memo(() => {
	const characterById = useValue(roster$.activeCharacterById);
	const currentCharacterId = useValue(optimizerView$.currentCharacter.id);
	const currentCharacterTarget = useValue(
		optimizerView$.currentCharacter.target,
	);

	return (
		<div className={"flex items-stretch overflow-hidden flex-grow-1"}>
			<Switch value={optimizerView$.view}>
				{{
					basic: () => <CharacterEditView />,
					edit: () => (
						<CharacterEditForm
							character={characterById[currentCharacterId]}
							target={currentCharacterTarget}
						/>
					),
					review: () => <ReviewWrapper />,
				}}
			</Switch>
		</div>
	);
});

OptimizerView.displayName = "OptimizerView";

export default OptimizerView;
