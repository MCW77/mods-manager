// utils
import * as v from "valibot";

// domain
import { characterNames } from "#/constants/CharacterNames";

const LockedStatusByCharacterIdSchema = v.pipe(
	v.object(
		Object.fromEntries(
			characterNames.map((name) => [name, v.optional(v.boolean())]),
		),
	),
	v.transform((obj) => {
		const result: Record<(typeof characterNames)[number], boolean> =
			{} as Record<(typeof characterNames)[number], boolean>;
		for (const name of characterNames) {
			result[name] = obj[name] ?? false;
		}
		return result;
	}),
);

export { LockedStatusByCharacterIdSchema };
