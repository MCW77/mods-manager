// utils
import * as v from "valibot";

// domain
import { characterNames } from "#/constants/CharacterNames";

const LockedStatusByCharacterIdSchema = v.looseObject(
	v.entriesFromList(characterNames, v.boolean()),
);

export { LockedStatusByCharacterIdSchema };
