// utils
import * as v from "valibot";

// domain
import { CharacterTemplatesSchema } from "./CharacterTemplatesSchemas.js";
import { SelectedCharactersSchema } from "./SelectedCharactersSchemas.js";

const ProfileSchema = v.object({
	allyCode: v.string(),
	playerName: v.string(),
	characters: v.any(),
	mods: v.any(),
	globalSettings: v.any(),
	selectedCharacters: SelectedCharactersSchema,
	modAssignments: v.any(),
	previousSettings: v.any(),
	incrementalOptimizeIndex: v.any(),
});

// Schema for a lastRuns entry
const LastRunEntrySchema = v.object({
	allyCode: v.string(),
	selectedCharacters: SelectedCharactersSchema,
	characters: v.any(),
	mods: v.any(),
	globalSettings: v.any(),
});

// Schema for lastRuns array
const LastRunsSchema = v.array(LastRunEntrySchema);

const BackupSchema = v.pipe(
	v.object({
		allyCode: v.string(),
		characterTemplates: CharacterTemplatesSchema,
		gameSettings: v.any(),
		lastRuns: LastRunsSchema,
		profiles: v.array(ProfileSchema),
		version: v.string(),
	}),
	v.transform((input) => ({
		allycode: input.allyCode,
		characterTemplates: input.characterTemplates,
		gameSettings: {},
		lastRuns: input.lastRuns,
		profiles: input.profiles,
		version: input.version,
	})),
);

export { BackupSchema };
