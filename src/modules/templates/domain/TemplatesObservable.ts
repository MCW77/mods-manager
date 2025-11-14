// domain
import type {
	CharacterTemplates,
	CharacterTemplatesByName,
} from "./CharacterTemplates.js";
import type { TemplatesAddingMode } from "./TemplatesAddingMode.js";
import type { TemplateTypes } from "./TemplateTypes.js";

interface Import {
	errorMessage: string;
	errorReason: string;
	errorSolution: string;
}

interface TemplatesObservable {
	id: string;
	category: string;
	import: Import;
	templatesAddingMode: TemplatesAddingMode;
	userTemplatesByName: CharacterTemplatesByName;
	selectedTemplate: string;
	selectedCategory: string;
	filter: TemplateTypes;
	groupTemplatesById: (
		templates: CharacterTemplates,
	) => CharacterTemplatesByName;
	userTemplates: () => CharacterTemplates;
	userTemplatesNames: () => string[];
	builtinTemplates: CharacterTemplates;
	builtinTemplatesNames: string[];
	templatesNames: () => string[];
	categories: () => string[];
	isUnique: () => boolean;
	allTemplates: () => CharacterTemplates;
	filteredTemplates: () => CharacterTemplates;
	saveTemplate: () => void;
	importTemplates: (templatesString: string) => void;
	reset: () => void;
}

export type { TemplatesObservable };
