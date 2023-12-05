import { CharacterTemplatesByName } from "./CharacterTemplates";
import { TemplatesAddingMode } from "./TemplatesAddingMode";

export interface Templates {
  templatesAddingMode: TemplatesAddingMode;
  userTemplatesByName: CharacterTemplatesByName;
}