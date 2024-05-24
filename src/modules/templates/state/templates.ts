// state
import { observable, when } from "@legendapp/state";

// domain
import defaultTemplates from "#/constants/characterTemplates.json";

import type {
	CharacterTemplate,
	CharacterTemplates,
	CharacterTemplatesByName,
} from "../domain/CharacterTemplates";
import type { TemplatesAddingMode } from "../domain/TemplatesAddingMode";
import { syncObservable } from "@legendapp/state/sync";
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
});

const status1$ = syncObservable(templates$.templatesAddingMode, {
	persist: {
		name: "TemplatesAddingMode",
		indexedDB: {
			itemID: "templatesAddingMode",
		},
	},
});
await when(status1$.isPersistLoaded);

const status2$ = syncObservable(templates$.userTemplatesByName, {
	persist: {
		name: "Templates",
	},
});
await when(status2$.isPersistLoaded);

export { templates$ };
