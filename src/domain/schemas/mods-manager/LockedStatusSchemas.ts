// utils
import * as v from "valibot";

// domain
import { characterNames } from "#/constants/CharacterNames";

const LockedStatusByCharacterIdSchemaV18 = v.pipe(
	v.record(v.string(), v.boolean()),
	v.transform((obj) => {
		const result: Record<(typeof characterNames)[number], boolean> =
			{} as Record<(typeof characterNames)[number], boolean>;
		for (const name of characterNames) {
			result[name] = obj[name] ?? false;
		}
		return result;
	}),
);

const LockedStatusByCharacterIdSchemaV20 = v.set(v.picklist(characterNames));

export {
	LockedStatusByCharacterIdSchemaV18,
	LockedStatusByCharacterIdSchemaV20,
};
