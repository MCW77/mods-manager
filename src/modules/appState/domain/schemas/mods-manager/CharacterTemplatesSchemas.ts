// utils
import * as v from "valibot";

// domain
import { SelectedCharactersSchema } from "./";

const CharacterTemplateSchema = v.object({
	id: v.string(),
	category: v.string(),
	selectedCharacters: SelectedCharactersSchema,
});

const CharacterTemplatesSchema = v.record(v.string(), CharacterTemplateSchema);

export { CharacterTemplatesSchema };
