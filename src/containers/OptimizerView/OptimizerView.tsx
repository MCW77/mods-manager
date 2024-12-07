// react
import React, { lazy } from "react";

// state
const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader");

const profilesManagement$ = stateLoader$.profilesManagement$;
import { optimizerView$ } from "#/modules/optimizerView/state/optimizerView";

// components
import { Switch } from "@legendapp/state/react";

// containers
/*
const CharacterEditForm = lazy(
	() => import("#/modules/planEditing/pages/CharacterEditForm"),
);
*/
const CharacterEditForm = lazy(async () => {
	console.log("Loading CharacterEditForm...");
	const module = await import("#/modules/planEditing/pages/CharacterEditForm");
	console.log("CharacterEditForm loaded");
	return module;
});
// const Review = lazy(() => import("#/modules/review/pages/Review"));
const Review = lazy(async () => {
	console.log("Loading Review...");
	const module = await import("#/modules/review/pages/Review");
	console.log("Review loaded");
	return module;
});
/*
const CharacterEditView = lazy(
	() => import("#/containers/CharacterEditView/CharacterEditView"),
);
*/
const CharacterEditView = lazy(async () => {
	console.log("Loading CharacterEditView...");
	const module = await import(
		"#/containers/CharacterEditView/CharacterEditView"
	);
	console.log("CharacterEditView loaded");
	return module;
});

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

export default OptimizerView;
