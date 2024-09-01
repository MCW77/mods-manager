// react
import { observer } from "@legendapp/state/react";

// state
import { dialog$ } from "#/modules/dialog/state/dialog";
import { profilesManagement$ } from "#/modules/profilesManagement/state/profilesManagement";
import { templates$ } from "#/modules/templates/state/templates";

// domain
import type { CharacterTemplate } from "#/modules/templates/domain/CharacterTemplates";
import type { TemplateTypes } from "#/modules/templates/domain/TemplateTypes";

// components
import { Button } from "#ui/button";
import { Label } from "#ui/label";
import { ToggleGroup, ToggleGroupItem } from "#ui/toggle-group";

const AddTemplateModal: React.FC = observer(() => {
	const selectedCharacters = profilesManagement$.activeProfile.selectedCharacters.get();

	return (
		<div className={"flex flex-col gap-4"}>
			<h3>Select a character template to add to your selected characters</h3>
			<div className={"flex flex-col gap-2"}>
				<div>
					<Label htmlFor={"uservsbuiltin"}>User vs Builtin</Label>
					<ToggleGroup
						id={"uservsbuiltin"}
						type={"single"}
						value={templates$.filter.get()}
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
						value={templates$.selectedCategory.get()}
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
					value={templates$.selectedTemplate.get()}
					onValueChange={(value) => {
						templates$.selectedTemplate.set(value);
					}}
				>
					{templates$.filteredTemplates.get().map((template) => {
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
					disabled={templates$.selectedTemplate.get() === ""}
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
							profilesManagement$.appendTemplate(templateName);
						}
						if (templates$.templatesAddingMode.get() === "replace")
							profilesManagement$.replaceWithTemplate(templateName);
						if (templates$.templatesAddingMode.get() === "apply targets only")
							profilesManagement$.applyTemplateTargets(templateName);
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
