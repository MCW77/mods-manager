// utils
import type * as v from "valibot";

// domain
import { CharacterTemplatesSchema as GIMOCharacterTemplatesSchema } from "#/domain/schemas/gimo/CharacterTemplatesSchemas.js";
import { CharacterTemplatesSchemaV18 } from "#/domain/schemas/mods-manager/index.js";

const schemaByVersion = new Map<
	number,
	v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>
>([
	[0, GIMOCharacterTemplatesSchema],
	[18, CharacterTemplatesSchemaV18],
]);

export { schemaByVersion };
