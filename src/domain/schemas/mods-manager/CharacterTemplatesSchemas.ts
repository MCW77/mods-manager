// utils
import * as v from "valibot";

// domain
import { SelectedCharactersSchema, SelectedCharactersSchemaV26 } from "./index";

const CharacterTemplateSchema = v.object({
	id: v.string(),
	category: v.string(),
	selectedCharacters: SelectedCharactersSchema,
});

const CharacterTemplateSchemaV26 = v.object({
	id: v.string(),
	category: v.string(),
	selectedCharacters: SelectedCharactersSchemaV26,
});

const CharacterTemplateByNameSchema = v.record(
	v.string(),
	CharacterTemplateSchema,
);
const CharacterTemplateByNameSchemaV26 = v.record(
	v.string(),
	CharacterTemplateSchemaV26,
);

const CharacterTemplatesSchemaV18 = v.array(CharacterTemplateSchema, "");
type CharacterTemplatesBackupSchemaV18Output = v.InferOutput<
	typeof CharacterTemplatesSchemaV18
>;
const CharacterTemplatesSchemaV26 = v.array(CharacterTemplateSchemaV26, "");
type CharacterTemplatesBackupSchemaV26Output = v.InferOutput<
	typeof CharacterTemplatesBackupSchemaV26
>;

const CharacterTemplatesBackupSchemaV26 = v.object({
	appVersion: v.string(),
	backupType: v.literal("characterTemplates"),
	characterTemplates: CharacterTemplatesSchemaV26,
	client: v.literal("mods-manager"),
	version: v.literal(26),
});

const LatestCharacterTemplatesSchema = CharacterTemplatesBackupSchemaV26;

export {
	CharacterTemplateByNameSchema,
	CharacterTemplateByNameSchemaV26,
	CharacterTemplatesSchemaV18,
	CharacterTemplatesSchemaV26,
	CharacterTemplatesBackupSchemaV26,
	type CharacterTemplatesBackupSchemaV18Output,
	type CharacterTemplatesBackupSchemaV26Output,
	LatestCharacterTemplatesSchema,
};
