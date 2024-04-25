import type { CharacterTemplatesByName } from "./CharacterTemplates";
import type { TemplatesAddingMode } from "./TemplatesAddingMode";

export interface Templates {
	templatesAddingMode: TemplatesAddingMode;
	userTemplatesByName: CharacterTemplatesByName;
}
