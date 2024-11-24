// domain
import type {
	CharacterTemplates,
	CharacterTemplatesByName,
} from "./CharacterTemplates";
import type { TemplatesAddingMode } from "./TemplatesAddingMode";
import type { TemplateTypes } from "./TemplateTypes";

interface TemplatesObservable {
	id: string;
	category: string;
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
	reset: () => void;
}

export type { TemplatesObservable };
