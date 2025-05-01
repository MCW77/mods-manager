// utils
import * as v from "valibot";

// state
import { observable, type ObservableObject, when } from "@legendapp/state";
import { syncObservable } from "@legendapp/state/sync";
import {
	latestDBVersion,
	persistOptions,
} from "#/utils/globalLegendPersistSettings";

const { compilations$ } = await import(
	"#/modules/compilations/state/compilations"
);

// domain
import defaultTemplates from "#/constants/characterTemplates.json";

import type {
	CharacterTemplate,
	CharacterTemplates,
	CharacterTemplatesByName,
} from "../domain/CharacterTemplates";
import type { TemplatesAddingMode } from "../domain/TemplatesAddingMode";
import type { TemplateTypes } from "../domain/TemplateTypes";
import type { TemplatesObservable } from "../domain/TemplatesObservable";
import { fromGIMOCharacterTemplates } from "../mappers/GIMOCharacterTemplatesMapper";
import { CharacterTemplatesSchema as GIMOCharacterTemplatesSchema } from "#/domain/schemas/gimo/CharacterTemplatesSchemas";
import {
	CharacterTemplatesSchemaV18,
	CharacterTemplatesSchemaV19,
	LatestCharacterTemplatesSchema,
} from "#/domain/schemas/mods-manager";

interface Backup {
	characterTemplates: unknown;
	client: "mods-manager";
	backupType: "characterTemplates";
	version: number;
}

const normalizeTemplatesJSON = (data: unknown) => {
	const normalizedData: Backup = {
		characterTemplates: data,
		client: "mods-manager",
		backupType: "characterTemplates",
		version: 18,
	};
	return normalizedData;
};

const migrations = new Map<number, (data: unknown) => Backup>([]);

function runMigrations(data: Backup) {
	let currentData = data;
	while (data.version < latestDBVersion) {
		const migrate = migrations.get(data.version);
		if (!migrate) {
			templates$.import.errorMessage.set(
				"Import of character templates failed",
			);
			templates$.import.errorReason.set(
				`Couldn't find a migration for version ${data.version}`,
			);
			templates$.import.errorSolution.set(
				"Ensure your backup matches a known schema.",
			);
			return null;
		}
		currentData = migrate(currentData);
	}

	return currentData;
}

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
		builtinTemplates: defaultTemplates as CharacterTemplates,
		builtinTemplatesNames: (defaultTemplates as CharacterTemplates).map(
			({ id }) => id,
		),
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
				selectedCharacters: structuredClone(
					compilations$.defaultCompilation.selectedCharacters.peek(),
				),
			});
		},
		reset: () => {
			syncStatus1$.reset();
			syncStatus2$.reset();
		},
		importTemplates: (templatesString: string) => {
			let parsedJSON: unknown;
			let templates = null as Backup | null;
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

			const gimoParseResult = v.safeParse(
				GIMOCharacterTemplatesSchema,
				parsedJSON,
			);
			if (gimoParseResult.success) {
				templates = normalizeTemplatesJSON(
					fromGIMOCharacterTemplates(gimoParseResult.output),
				);
			} else {
				const modsManagerParseResult = v.safeParse(
					CharacterTemplatesSchemaV18,
					parsedJSON,
				);
				if (modsManagerParseResult.success) {
					templates = normalizeTemplatesJSON(modsManagerParseResult.output);
				}
			}
			if (templates === null) {
				const modsManagerParseResult = v.safeParse(
					CharacterTemplatesSchemaV19,
					parsedJSON,
				);
				if (modsManagerParseResult.success) {
					templates = modsManagerParseResult.output;
				}
			}
			if (templates === null) {
				templates$.import.errorMessage.set(
					"Import of character templates failed.",
				);
				templates$.import.errorReason.set(
					"Couldn't validate a character templates backup",
				);
				templates$.import.errorSolution.set(
					"Please check you selected a valid file. If so let me know about the error on discord",
				);
				return;
			}
			templates = runMigrations(templates);
			if (templates === null) {
				return;
			}

			const finalSchemaResult = v.safeParse(
				LatestCharacterTemplatesSchema,
				templates,
			);
			if (!finalSchemaResult.success) {
				templates$.import.errorMessage.set(
					"Import of character templates failed",
				);
				templates$.import.errorReason.set(
					`Validation of the final migrated data failed:
			 ${finalSchemaResult.issues.map((issue) => issue.message)}`,
				);
				templates$.import.errorSolution.set("Please report on discord!");
				return;
			}
			templates$.import.errorMessage.set("");
			for (const template of finalSchemaResult.output.characterTemplates) {
				templates$.userTemplatesByName[template.id].set(template);
			}
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
await when(syncStatus1$.isPersistLoaded);

const syncStatus2$ = syncObservable(
	templates$.userTemplatesByName,
	persistOptions({
		persist: {
			name: "Templates",
		},
		initial: {},
	}),
);
await when(syncStatus2$.isPersistLoaded);

export { templates$ };
