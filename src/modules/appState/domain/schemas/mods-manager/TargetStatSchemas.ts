// utils
import * as v from "valibot";

// domain
import { targetStatsNames } from "#/domain/TargetStat";
import { KnownCharacterNamesSchema } from "./";

const TargetStatSchema = v.object({
	id: v.string(),
	optimizeForTarget: v.boolean(),
	type: v.picklist(["+", "*"]),
	stat: v.picklist(targetStatsNames),
	value: v.number(),
	relativeCharacterId: KnownCharacterNamesSchema,
	relativeValue: v.optional(v.number()),
	minimum: v.number(),
	maximum: v.number(),
	goal: v.optional(v.boolean()),
	relative: v.optional(v.boolean()),
});
const TargetStatsSchema = v.array(TargetStatSchema);

export { TargetStatSchema, TargetStatsSchema };
