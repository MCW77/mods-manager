// utils
import * as v from "valibot";

// domain
import { SelectedCharactersSchema } from "./SelectedCharactersSchemas.js";

const CharacterTemplateSchema = v.object({
	name: v.string(),
	selectedCharacters: SelectedCharactersSchema,
});

const CharacterTemplateByNameSchema = v.record(
	v.string(),
	CharacterTemplateSchema,
);
const CharacterTemplatesSchema = v.array(CharacterTemplateSchema, "");

export { CharacterTemplateByNameSchema, CharacterTemplatesSchema };
