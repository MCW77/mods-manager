// react
import { useDispatch, useSelector } from "react-redux";
import type { ThunkDispatch } from "#/state/reducers/modsOptimizer";
import { observer, reactive } from "@legendapp/state/react";

// state
import { observable } from "@legendapp/state";

import { dialog$ } from "#/modules/dialog/state/dialog";

// modules
import { CharacterEdit } from "#/state/modules/characterEdit";

// domain
import defaultTemplates from "#/constants/characterTemplates.json";

// components
import { TemplatesSelector } from "./TemplatesSelector";

import { Button } from "#ui/button";

const ReactiveTemplatesSelector = reactive(TemplatesSelector);

const template$ = observable("");

const AddTemplateModal = observer(() => {
	const dispatch: ThunkDispatch = useDispatch();
	const templatesAddingMode = useSelector(
		CharacterEdit.selectors.selectTemplatesAddingMode,
	);
	const selectedCharacters = useSelector(
		CharacterEdit.selectors.selectSelectedCharactersInActiveProfile,
	);

	return (
		<div className={"flex flex-col gap-2"}>
			<h3>Select a character template to add to your selected characters</h3>
			<ReactiveTemplatesSelector
				$value={template$}
				onValueChange={(value) => {
					template$.set(value);
				}}
			/>
			<div className={"flex gap-2 justify-center"}>
				<Button type={"button"} onClick={() => dialog$.hide()}>
					Cancel
				</Button>
				<Button
					type={"button"}
					onClick={() => {
						dialog$.hide();
						const templateName = template$.get();
						if (templateName === null) return;
						if (templatesAddingMode === "append") {
							const template = defaultTemplates.find(
								(template) => template.name === templateName,
							);
							if (template === undefined) return;

							const selectedCharactersIDs = template.selectedCharacters.map(
								({ id, target }) => id,
							);
							if (
								selectedCharactersIDs.some((id) =>
									selectedCharacters.some(
										(selectedCharacter) => selectedCharacter.id === id,
									),
								)
							) {
								return;
							}
							dispatch(CharacterEdit.thunks.appendTemplate(templateName));
						}
						if (templatesAddingMode === "replace")
							dispatch(CharacterEdit.thunks.replaceTemplate(templateName));
						if (templatesAddingMode === "apply targets only")
							dispatch(CharacterEdit.thunks.applyTemplateTargets(templateName));
					}}
				>
					Add
				</Button>
			</div>
		</div>
	);
});

AddTemplateModal.displayName = "AddTemplateModal";

export { AddTemplateModal };
