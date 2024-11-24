// react
import React from "react";

// state
import { stateLoader$ } from "#/modules/stateLoader/stateLoader";

const profilesManagement$ = stateLoader$.profilesManagement$;
import { optimizerView$ } from "#/modules/optimizerView/state/optimizerView";

// components
import { Switch } from "@legendapp/state/react";

// containers
import { CharacterEditForm } from "#/modules/planEditing/pages/CharacterEditForm";
import { Review } from "#/modules/review/pages/Review";
import { CharacterEditView } from "#/containers/CharacterEditView/CharacterEditView";

const OptimizerView = React.memo(() => {
	const characterById = profilesManagement$.activeProfile.characterById.get();

	return (
		<div className={"flex items-stretch overflow-hidden flex-grow-1"}>
			<Switch value={optimizerView$.view}>
				{{
					basic: () => <CharacterEditView />,
					edit: () => (
						<CharacterEditForm
							character={
								characterById[optimizerView$.currentCharacter.id.get()]
							}
							target={optimizerView$.currentCharacter.target.get()}
						/>
					),
					review: () => <Review />,
				}}
			</Switch>
		</div>
	);
});

OptimizerView.displayName = "OptimizerView";

export { OptimizerView };
