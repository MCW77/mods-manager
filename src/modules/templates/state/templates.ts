// utils
import { saveAs } from "file-saver";

// state
import { observable, type ObservableObject } from "@legendapp/state";
import { syncObservable } from "@legendapp/state/sync";
import {
	latestDBVersion,
	persistOptions,
} from "#/utils/globalLegendPersistSettings";

import { stateLoader$ } from "#/modules/stateLoader/stateLoader";

const compilations$ = stateLoader$.compilations$;
const about$ = stateLoader$.about$;

// domain
import { defaultTemplates } from "#/constants/characterTemplates";

import { type Backup, convertTemplates } from "../domain/Backup";
import type {
	CharacterTemplate,
	CharacterTemplates,
	CharacterTemplatesByName,
} from "../domain/CharacterTemplates";
import type { TemplatesAddingMode } from "../domain/TemplatesAddingMode";
import type { TemplatesObservable } from "../domain/TemplatesObservable";
import type { TemplateTypes } from "../domain/TemplateTypes";
import { fromShortOptimizationPlan } from "#/domain/OptimizationPlan";

const templates$: ObservableObject<TemplatesObservable> =
	observable<TemplatesObservable>({
		id: "",
		category: "",
		import: {
			errorMessage: "",
			errorReason: "",
			errorSolution: "",
		},

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
			return Object.values<CharacterTemplate>(
				templates$.userTemplatesByName.get(),
			);
		},
		userTemplatesNames: () => {
			return Object.keys(templates$.userTemplatesByName.get());
		},
		builtinTemplates: defaultTemplates.map((shortTemplate) => ({
			id: shortTemplate.id,
			category: shortTemplate.category,
			selectedCharacters: shortTemplate.selectedCharacters.map(
				({ id, target }) => ({
					id,
					target: fromShortOptimizationPlan(target),
				}),
			),
		})),
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
			const filter = templates$.filter.get();
			const selectedCategory = templates$.selectedCategory.get();
			if (filter === "all") templates = templates$.allTemplates.get().slice();
			if (filter === "user") templates = [...templates$.userTemplates.get()];
			if (filter === "builtin")
				templates = [...templates$.builtinTemplates.get()];
			if (selectedCategory !== "" && selectedCategory !== undefined)
				templates = templates.filter(
					(template) => template.category === selectedCategory,
				);
			return templates;
		},
		saveTemplate: () => {
			templates$.userTemplatesByName[templates$.id.peek()].set({
				id: templates$.id.peek(),
				category: templates$.category.peek(),
				selectedCharacters: structuredClone(
					compilations$.defaultCompilation.selectedCharacters.peek(),
				),
			});
		},
		reset: () => {
			templatesSyncStatus$.reset();
			templatesAddingModeSyncStatus$.reset();
		},
		importTemplates: (templatesString: string) => {
			let parsedJSON: unknown;
			try {
				parsedJSON = JSON.parse(templatesString);
			} catch (error) {
				if (error instanceof SyntaxError) {
					templates$.import.errorMessage.set(
						"Import of character templates failed.",
					);
					templates$.import.errorReason.set(error.message);
					templates$.import.errorSolution.set("Check the JSON format");
				}
				return;
			}
			const conversionResult = convertTemplates(parsedJSON);
			if (conversionResult.importError.errorMessage !== "") {
				templates$.import.errorMessage.set(
					conversionResult.importError.errorMessage,
				);
				templates$.import.errorReason.set(
					conversionResult.importError.errorReason,
				);
				templates$.import.errorSolution.set(
					conversionResult.importError.errorSolution,
				);
				return;
			}
			if (conversionResult.backup !== null) {
				templates$.import.errorMessage.set("");
				for (const template of conversionResult.backup.characterTemplates) {
					templates$.userTemplatesByName[template.id].set(template);
				}
			}
		},
		exportTemplates: (selectedTemplates) => {
			const backup: Backup = {
				appVersion: about$.version.peek(),
				backupType: "characterTemplates",
				characterTemplates: selectedTemplates,
				client: "mods-manager",
				version: latestDBVersion,
			};
			const serializedBackup = JSON.stringify(backup);
			const userData = new Blob([serializedBackup], {
				type: "application/json;charset=utf-8",
			});
			saveAs(
				userData,
				`mods-managerTemplates-${new Date().toISOString().slice(0, 10)}.json`,
			);
		},
	});

const templatesSyncStatus$ = syncObservable(
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

const templatesAddingModeSyncStatus$ = syncObservable(
	templates$.userTemplatesByName,
	persistOptions({
		persist: {
			name: "Templates",
		},
		initial: {},
	}),
);

export { templates$, templatesSyncStatus$, templatesAddingModeSyncStatus$ };
