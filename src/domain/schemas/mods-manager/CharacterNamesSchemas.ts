// utils
import * as v from "valibot";

// domain
import {
	characterNames,
	type CharacterNames,
} from "#/constants/CharacterNames";

const KnownCharacterNamesSchema = v.picklist(characterNames);
const ArbitraryCharacterNamesSchema = v.pipe(
	v.string(),
	v.transform((value: string) => value as CharacterNames),
);

export { ArbitraryCharacterNamesSchema, KnownCharacterNamesSchema };
