// react
import React from "react";

// state
import { optimizerView$ } from "#/modules/optimizerView/state/optimizerView";
import { profilesManagement$ } from "#/modules/profilesManagement/state/profilesManagement";

// components
import { Switch } from "@legendapp/state/react";

// containers
import { CharacterEditForm } from "#/modules/planEditing/pages/CharacterEditForm";
import { Review } from "#/modules/review/pages/Review";
import { CharacterEditView } from "#/containers/CharacterEditView/CharacterEditView";

const OptimizerView = React.memo(() => {
	const characters = profilesManagement$.activeProfile.charactersById.get();

	return (
		<div className={"flex items-stretch overflow-hidden flex-grow-1"}>
			<Switch value={optimizerView$.view}>
				{{
					basic: () => <CharacterEditView />,
					edit: () => (
						<CharacterEditForm
							character={characters[optimizerView$.currentCharacter.id.get()]}
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
