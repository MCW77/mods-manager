// domain
import type {
	CharacterTemplates,
	CharacterTemplatesByName,
} from "./CharacterTemplates.js";
import type { TemplatesAddingMode } from "./TemplatesAddingMode.js";
import type { TemplateTypes } from "./TemplateTypes.js";

interface Templates {
	id: string;
	category: string;
	templatesAddingMode: TemplatesAddingMode;
	userTemplatesByName: CharacterTemplatesByName;
	selectedTemplate: string;
	selectedCategory: string;
	filter: TemplateTypes;
	allTemplates: () => CharacterTemplates;
	userTemplates: () => CharacterTemplates;
	userTemplatesNames: () => string[];
	builtinTemplates: CharacterTemplates;
	builtinTemplatesNames: string[];
	templatesNames: () => string[];
	categories: () => string[];
	isUnique: () => boolean;
	groupTemplatesById: (
		templates: CharacterTemplates,
	) => CharacterTemplatesByName;
}

export type { Templates };
