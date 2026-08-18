// react
import React from "react";
import { Switch, useValue } from "@legendapp/state/react";

// state
import { stateLoader$ } from "#/modules/stateLoader/stateLoader";

const roster$ = stateLoader$.roster$;
import { optimizerView$ } from "#/modules/optimizerView/state/optimizerView";

// containers
import CharacterEditForm from "#/modules/planEditing/pages/CharacterEditForm";
import Review from "#/modules/review/pages/Review";
import CharacterEditView from "#/containers/CharacterEditView/CharacterEditView";

const OptimizerView = React.memo(() => {
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
					review: () => <Review />,
				}}
			</Switch>
		</div>
	);
});

OptimizerView.displayName = "OptimizerView";

export default OptimizerView;
