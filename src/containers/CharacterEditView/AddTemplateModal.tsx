// react
import { observer, useValue } from "@legendapp/state/react";

// state
const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader");

const compilations$ = stateLoader$.compilations$;
const templates$ = stateLoader$.templates$;

import { dialog$ } from "#/modules/dialog/state/dialog";

import {
	appendTemplate,
	applyTemplateTargets,
	replaceWithTemplate,
} from "#/modules/templateToCompilationAdder/templateToCompilationAdder";

// domain
import type { CharacterTemplate } from "#/modules/templates/domain/CharacterTemplates";
import type { TemplateTypes } from "#/modules/templates/domain/TemplateTypes";

// components
import { Button } from "#ui/button";
import { Label } from "#ui/label";
import { ToggleGroup, ToggleGroupItem } from "#ui/toggle-group";

const AddTemplateModal: React.FC = observer(() => {
	const selectedCharacters = useValue(
		compilations$.defaultCompilation.selectedCharacters,
	);
	const templatesFilter = useValue(templates$.filter);
	const selectedCategory = useValue(templates$.selectedCategory);
	const selectedTemplate = useValue(templates$.selectedTemplate);
	const filteredTemplates = useValue(templates$.filteredTemplates);

	return (
		<div className={"flex flex-col gap-4"}>
			<h3>Select a character template to add to your selected characters</h3>
			<div className={"flex flex-col gap-2"}>
				<div>
					<Label htmlFor={"uservsbuiltin"}>User vs Builtin</Label>
					<ToggleGroup
						id={"uservsbuiltin"}
						type={"single"}
						value={templatesFilter}
						onValueChange={(value: TemplateTypes) => {
							templates$.filter.set(value);
						}}
					>
						{(["all", "user", "builtin"] as TemplateTypes[]).map((type) => (
							<ToggleGroupItem key={type} value={type}>
								{type}
							</ToggleGroupItem>
						))}
					</ToggleGroup>
				</div>
				<div>
					<Label htmlFor={"categories"}>Categories</Label>
					<ToggleGroup
						id={"categories"}
						type={"single"}
						value={selectedCategory}
						onValueChange={(value) => {
							templates$.selectedCategory.set(value);
						}}
					>
						{templates$.categories.map((category) => {
							const cat = category.peek();
							return (
								<ToggleGroupItem key={cat} value={cat}>
									{cat}
								</ToggleGroupItem>
							);
						})}
					</ToggleGroup>
				</div>
			</div>
			<div className={"overflow-y-auto"}>
				<Label htmlFor={"templates"}>Templates</Label>
				<ToggleGroup
					className={"flex flex-row gap-1 justify-center flex-wrap"}
					id={"templates"}
					type={"single"}
					value={selectedTemplate}
					onValueChange={(value) => {
						templates$.selectedTemplate.set(value);
					}}
				>
					{filteredTemplates.map((template) => {
						const id = template.id;
						return (
							<ToggleGroupItem key={id} value={id}>
								{id}
							</ToggleGroupItem>
						);
					})}
				</ToggleGroup>
			</div>
			<div className={"flex gap-2 justify-center"}>
				<Button type={"button"} onClick={() => dialog$.hide()}>
					Cancel
				</Button>
				<Button
					type={"button"}
					disabled={selectedTemplate === ""}
					onClick={() => {
						dialog$.hide();
						const templateName = templates$.selectedTemplate.get();
						if (templateName === null || templateName === "") return;
						if (templates$.templatesAddingMode.get() === "append") {
							const template = templates$.allTemplates
								.get()
								.find(
									(template: CharacterTemplate) => template.id === templateName,
								);
							if (template === undefined) return;

							const selectedCharactersIDs = template.selectedCharacters.map(
								({ id }) => id,
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
							appendTemplate(templateName);
						}
						if (templates$.templatesAddingMode.get() === "replace")
							replaceWithTemplate(templateName);
						if (templates$.templatesAddingMode.get() === "apply targets only")
							applyTemplateTargets(templateName);
					}}
				>
					Add
				</Button>
			</div>
		</div>
	);
});

AddTemplateModal.displayName = "AddTemplateModal";

export default AddTemplateModal;
