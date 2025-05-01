// utils
import * as v from "valibot";

// domain
import { targetStatsNames } from "#/domain/TargetStat";
import { KnownCharacterNamesSchema } from ".";

const TargetStatSchema = v.object({
	id: v.string(),
	optimizeForTarget: v.boolean(),
	type: v.picklist(["+", "*"]),
	stat: v.picklist(targetStatsNames),
	relativeCharacterId: v.union([KnownCharacterNamesSchema, v.literal("null")]),
	minimum: v.number(),
	maximum: v.number(),
});
const TargetStatsSchema = v.array(TargetStatSchema);

export { TargetStatSchema, TargetStatsSchema };
