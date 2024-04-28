// react
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { ThunkDispatch } from "#/state/reducers/modsOptimizer";
import { observer, reactive } from "@legendapp/state/react";

// state
import { type ObservableObject, computed, observable } from "@legendapp/state";

import { dialog$ } from "#/modules/dialog/state/dialog";

// modules
import { CharacterEdit } from "#/state/modules/characterEdit";

// domain
import defaultTemplates from "#/constants/characterTemplates.json";

import type { CharacterTemplates } from "#/domain/CharacterTemplates";

// components
import { Label } from "#/components/ui/label";
import { Button } from "#ui/button";
import { ToggleGroup, ToggleGroupItem } from "#ui/toggle-group";

type TemplateTypes = "all" | "user" | "builtin";

interface Templates {
  selectedTemplate: string;
  selectedCategory: string;
  filter: TemplateTypes;
  userTemplates: CharacterTemplates;
  builtinTemplates: CharacterTemplates;
  categories: string[];
}

const templates$: ObservableObject<Templates> = observable<Templates>({
  selectedTemplate: "",
  selectedCategory: "",
  filter: "all",
  userTemplates: [],
  builtinTemplates: defaultTemplates as CharacterTemplates,
  categories: [],
});

const allTemplates$ = computed<CharacterTemplates>(() => {
  return templates$.builtinTemplates
    .get()
    .concat(templates$.userTemplates.get());
});

const filteredTemplates$ = computed<CharacterTemplates>(() => {
  let templates: CharacterTemplates = [];
  if (templates$.filter.get() === "all")
    templates = allTemplates$.get().slice();
  if (templates$.filter.get() === "user")
    templates = [...templates$.userTemplates.get()];
  if (templates$.filter.get() === "builtin")
    templates = [...templates$.builtinTemplates.get()];
  if (templates$.selectedCategory.get() !== "")
    templates = templates.filter(
      (template) => template.category === templates$.selectedCategory.get(),
    );
  return templates;
});

const AddTemplateModal = observer(() => {
	const dispatch: ThunkDispatch = useDispatch();
	const templatesAddingMode = useSelector(
		CharacterEdit.selectors.selectTemplatesAddingMode,
	);
	const selectedCharacters = useSelector(
		CharacterEdit.selectors.selectSelectedCharactersInActiveProfile,
	);
  const userTemplates = useSelector(CharacterEdit.selectors.selectUserTemplates);
  const allTemplates = [...userTemplates, ...defaultTemplates];
  const templatesCategories = Array.from(new Set(allTemplates.map(({ category }) => category)));

  useEffect(() => {
    templates$.userTemplates.set(userTemplates);
    templates$.categories.set(templatesCategories);
  }, [userTemplates, templatesCategories]);

  useEffect(() => {
    templates$.selectedTemplate.set("");
  }, []);

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
            {
              (["all", "user", "builtin"] as TemplateTypes[]).map((type) => (
                <ToggleGroupItem
                  key={type}
                  value={type}
                >
                  {type}
                </ToggleGroupItem>
              ))
            }
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
            {
              templates$.categories.map((category) => {
                const cat = category.peek();
                return (
                  <ToggleGroupItem
                    key={cat}
                    value={cat}
                  >
                    {cat}
                  </ToggleGroupItem>
                )
              })
            }
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
        {
          filteredTemplates$.get().map((template) => {
            const id = template.id;
            return (
              <ToggleGroupItem
                key={id}
                value={id}
              >{id}</ToggleGroupItem>
            )
          })
        }
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
						if (templatesAddingMode === "append") {
							const template = defaultTemplates.find(
								(template) => template.id === templateName,
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
