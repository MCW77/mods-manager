// utils
import * as v from "valibot";

// domain
import { targetStatsNames } from "#/domain/TargetStat";
import { KnownCharacterNamesSchema } from "./CharacterNamesSchemas";

const TargetStatSchema = v.object({
	optimizeForTarget: v.boolean(),
	type: v.pipe(
		v.picklist(["+", "%"]),
		v.transform((value) => (value === "%" ? "*" : value)),
	),
	stat: v.picklist(targetStatsNames),
	relativeCharacterId: v.pipe(
		v.union([KnownCharacterNamesSchema, v.null()]),
		v.transform((value) => (value === null ? "null" : value)),
	),
	minimum: v.number(),
	maximum: v.number(),
});
const TargetStatsSchema = v.array(TargetStatSchema);

export { TargetStatSchema, TargetStatsSchema };
