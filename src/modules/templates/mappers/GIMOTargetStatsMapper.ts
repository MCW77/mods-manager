// utils
import type * as v from "valibot";

// domain
import { createTargetStat, type TargetStats } from "#/domain/TargetStat";
import type { TargetStatsSchema as GIMOTargetStatsSchema } from "#/domain/schemas/gimo/TargetStatsSchemas";

type GIMOTargetStats = v.InferOutput<typeof GIMOTargetStatsSchema>;

export const fromGIMOTargetStats = (
	targetStats: GIMOTargetStats,
): TargetStats => {
	return targetStats.map((targetStat) => {
		return createTargetStat(
			targetStat.stat,
			targetStat.type,
			targetStat.minimum,
			targetStat.maximum,
			targetStat.relativeCharacterId,
			targetStat.optimizeForTarget,
		);
	});
};
