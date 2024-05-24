// domain
import type {
	CharacterTemplates,
	CharacterTemplatesByName,
} from "./CharacterTemplates";
import type { TemplatesAddingMode } from "./TemplatesAddingMode";
import type { TemplateTypes } from "./TemplateTypes";

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
