// state
import { observable, when } from "@legendapp/state";
import { syncObservable } from "@legendapp/state/sync";
import { persistOptions } from "#/utils/globalLegendPersistSettings";

import { compilations$ } from "#/modules/compilations/state/compilations";

// domain
import defaultTemplates from "#/constants/characterTemplates.json";

import type {
	CharacterTemplate,
	CharacterTemplates,
	CharacterTemplatesByName,
} from "../domain/CharacterTemplates";
import type { TemplatesAddingMode } from "../domain/TemplatesAddingMode";
import type { TemplateTypes } from "../domain/TemplateTypes";

const templates$ = observable({
	id: "",
	category: "",
	templatesAddingMode: "replace" as TemplatesAddingMode,
	userTemplatesByName: {} as CharacterTemplatesByName,
	selectedTemplate: "",
	selectedCategory: "",
	filter: "all" as TemplateTypes,
	groupTemplatesById: (templates: CharacterTemplates) => {
		return templates.reduce((acc, template) => {
			acc[template.id] = template;
			return acc;
		}, {} as CharacterTemplatesByName);
	},
	userTemplates: () => {
		return Object.values(templates$.userTemplatesByName.get());
	},
	userTemplatesNames: () => {
		return Object.keys(templates$.userTemplatesByName.get());
	},
	builtinTemplates: defaultTemplates as CharacterTemplates,
	builtinTemplatesNames: defaultTemplates.map(({ id }) => id),
	templatesNames: () => {
		const result: string[] = [];
		return result.concat(
			templates$.userTemplatesNames.get(),
			templates$.builtinTemplatesNames.get(),
		);
	},
	categories: () =>
		Array.from(
			new Set(
				templates$.allTemplates
					.get()
					.map(({ category }: CharacterTemplate) => category),
			),
		),
	isUnique: () => {
		const templatesNames = templates$.templatesNames.get();
		if (templatesNames === undefined) return false;
		return !templatesNames.includes(templates$.id.get());
	},
	allTemplates: () =>
		templates$.builtinTemplates.get().concat(templates$.userTemplates.get()),
	filteredTemplates: () => {
		let templates: CharacterTemplates = [];
		if (templates$.filter.get() === "all")
			templates = templates$.allTemplates.get().slice();
		if (templates$.filter.get() === "user")
			templates = [...templates$.userTemplates.get()];
		if (templates$.filter.get() === "builtin")
			templates = [...templates$.builtinTemplates.get()];
		if (templates$.selectedCategory.get() !== "")
			templates = templates.filter(
				(template) => template.category === templates$.selectedCategory.get(),
			);
		return templates;
	},
	saveTemplate: () => {
		templates$.userTemplatesByName[templates$.id.peek()].set({
			id: templates$.id.peek(),
			category: templates$.category.peek(),
			selectedCharacters: structuredClone(compilations$.defaultCompilation.selectedCharacters.peek()),
		});
	},
	reset: () => {
		syncStatus1$.reset();
		syncStatus2$.reset();
	},
});

const syncStatus1$ = syncObservable(
	templates$.templatesAddingMode,
	persistOptions({
		persist: {
			name: "TemplatesAddingMode",
			indexedDB: {
				itemID: "TemplatesAddingMode",
			},
		},
	}),
);
console.log("Waiting for TemplatesAddingMode to load");
await when(syncStatus1$.isPersistLoaded);
console.log("TemplatesAddingMode loaded");
/*
(async () => {
	await when(syncStatus1$.isPersistLoaded);
})();
*/

const syncStatus2$ = syncObservable(
	templates$.userTemplatesByName,
	persistOptions({
		persist: {
			name: "Templates",
		},
		initial: {},
	}),
);
console.log("Waiting for Templates to load");
await when(syncStatus2$.isPersistLoaded);
console.log("Templates loaded");
/*
(async () => {
	await when(syncStatus2$.isPersistLoaded);
})();
*/

export { templates$ };
