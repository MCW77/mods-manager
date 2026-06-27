// react
import { observer, useValue } from "@legendapp/state/react";

// state
import { stateLoader$ } from "#/modules/stateLoader/stateLoader";

const compilations$ = stateLoader$.compilations$;
const templates$ = stateLoader$.templates$;

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
import {
	DialogClose,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "#ui/dialog";
import { Label } from "#ui/label";
import { ScrollArea } from "#ui/scroll-area";
import { ToggleGroupItem } from "#ui/toggle-group";
import { ToggleGroup as ReactiveToggleGroup } from "#/components/reactive/ToggleGroup";

const AddTemplateModal: React.FC = observer(() => {
	const selectedCharacters = useValue(
		compilations$.defaultCompilation.selectedCharacters,
	);
	const selectedTemplate = useValue(templates$.selectedTemplate);
	const filteredTemplates = useValue(templates$.filteredTemplates);

	return (
		<>
			<DialogHeader className="flex-none">
				<DialogTitle>Add template</DialogTitle>
				<DialogDescription>
					Select a character template to add to your selected characters
				</DialogDescription>
			</DialogHeader>
			<ScrollArea className="max-h-[60vh]">
				<div
					className={
						"w-[calc(100%-4rem)] sm:w-[calc(sm-4rem)] md:w-[calc(md-4rem)] lg:w-[calc(lg-4rem)] xl:w-[calc(xl-4rem)] 2xl:w-[calc(2xl-4rem)] flex flex-col gap-6"
					}
				>
					<div>
						<Label htmlFor={"uservsbuiltin"}>User vs Builtin</Label>
						<ReactiveToggleGroup
							className={"justify-start"}
							id={"uservsbuiltin"}
							multiple={false}
							$value={templates$.filter}
						>
							{(["all", "user", "builtin"] as TemplateTypes[]).map((type) => (
								<ToggleGroupItem key={type} value={type}>
									{type}
								</ToggleGroupItem>
							))}
						</ReactiveToggleGroup>
					</div>
					<div>
						<Label htmlFor={"categories"}>Categories</Label>
						<ReactiveToggleGroup
							className={"justify-start"}
							id={"categories"}
							multiple={false}
							$value={templates$.selectedCategory}
						>
							{templates$.categories.map((category) => {
								const cat = category.peek();
								return (
									<ToggleGroupItem key={cat} value={cat}>
										{cat}
									</ToggleGroupItem>
								);
							})}
						</ReactiveToggleGroup>
					</div>
					<div>
						<Label htmlFor={"templates"}>Templates</Label>
						<ReactiveToggleGroup
							className={"flex flex-row gap-1 justify-start flex-wrap"}
							id={"templates"}
							multiple={false}
							$value={templates$.selectedTemplate}
						>
							{filteredTemplates.map((template) => {
								const id = template.id;
								return (
									<ToggleGroupItem key={id} value={id}>
										{id}
									</ToggleGroupItem>
								);
							})}
						</ReactiveToggleGroup>
					</div>
				</div>
			</ScrollArea>
			<DialogFooter
				className={
					"flex-row flex-wrap flex-none justify-center sm:justify-center gap-2"
				}
			>
				<DialogClose render={<Button type={"button"}>Cancel</Button>} />
				<DialogClose
					render={
						<Button
							type={"button"}
							disabled={selectedTemplate[0] === ""}
							onClick={() => {
								const templateName = templates$.selectedTemplate.get();
								if (templateName === null || templateName === "") return;
								if (templates$.templatesAddingMode.get() === "append") {
									const template = templates$.allTemplates
										.get()
										.find(
											(template: CharacterTemplate) =>
												template.id === templateName,
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
								if (
									templates$.templatesAddingMode.get() === "apply targets only"
								)
									applyTemplateTargets(templateName);
							}}
						>
							Add
						</Button>
					}
				/>
			</DialogFooter>
		</>
	);
});

AddTemplateModal.displayName = "AddTemplateModal";

export default AddTemplateModal;
