// utils
import * as v from "valibot";

// domain
import { SelectedCharactersSchema } from "./";

const CharacterTemplateSchema = v.object({
	id: v.string(),
	category: v.string(),
	selectedCharacters: SelectedCharactersSchema,
});

const CharacterTemplateByNameSchema = v.record(
	v.string(),
	CharacterTemplateSchema,
);
const CharacterTemplatesSchemaV18 = v.array(CharacterTemplateSchema, "");
const CharacterTemplatesSchemaV19 = v.object({
	backupType: v.literal("characterTemplates"),
	characterTemplates: v.array(CharacterTemplateSchema, ""),
	client: v.literal("mods-manager"),
	version: v.literal(19),
});

const LatestCharacterTemplatesSchema = v.object({
	backupType: v.literal("characterTemplates"),
	characterTemplates: v.array(CharacterTemplateSchema, ""),
	client: v.literal("mods-manager"),
	version: v.literal(18),
});

export {
	CharacterTemplateByNameSchema,
	CharacterTemplatesSchemaV18,
	CharacterTemplatesSchemaV19,
	LatestCharacterTemplatesSchema,
};
