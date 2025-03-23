// react
import React, { lazy } from "react";

// state
const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader");

const profilesManagement$ = stateLoader$.profilesManagement$;
import { optimizerView$ } from "#/modules/optimizerView/state/optimizerView";

// components
import { Switch, use$ } from "@legendapp/state/react";

// containers
const CharacterEditForm = lazy(
	() => import("#/modules/planEditing/pages/CharacterEditForm"),
);
const Review = lazy(() => import("#/modules/review/pages/Review"));
const CharacterEditView = lazy(
	() => import("#/containers/CharacterEditView/CharacterEditView"),
);

const OptimizerView = React.memo(() => {
	const characterById = use$(profilesManagement$.activeProfile.characterById);
	const currentCharacterId = use$(optimizerView$.currentCharacter.id);
	const currentCharacterTarget = use$(optimizerView$.currentCharacter.target);

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
