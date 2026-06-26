// utils
import * as v from "valibot";

// domain
import { SelectedCharactersSchema, SelectedCharactersOutputSchema } from "./SelectedCharactersSchemas";

const CharacterTemplateSchema = v.object({
	name: v.string(),
	selectedCharacters: SelectedCharactersSchema,
});

const CharacterTemplateOutputSchema = v.object({
	name: v.string(),
	selectedCharacters: SelectedCharactersOutputSchema,
});

const CharacterTemplateByNameSchema = v.record(
	v.string(),
	CharacterTemplateSchema,
);
const CharacterTemplatesSchema = v.array(CharacterTemplateSchema, "");
const CharacterTemplatesOutputSchema = v.array(CharacterTemplateOutputSchema, "");

export { CharacterTemplateByNameSchema, CharacterTemplatesSchema, CharacterTemplatesOutputSchema };
