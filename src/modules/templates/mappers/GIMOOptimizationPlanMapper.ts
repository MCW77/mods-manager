// utils
import type * as v from "valibot";

// domain
import type { OptimizationPlan } from "#/domain/OptimizationPlan";
import type { OptimizationPlanSchema as GIMOOptimizationPlanSchema } from "#/domain/schemas/gimo/OptimizationPlanSchemas";

// mappers
import { fromGIMOSetRestrictions } from "./GIMOSetRestrictionsMapper";
import { fromGIMOTargetStats } from "./GIMOTargetStatsMapper";

type GIMOOptimizationPlan = v.InferOutput<typeof GIMOOptimizationPlanSchema>;

export const fromGIMOOptimizationPlan = (
	target: GIMOOptimizationPlan,
): OptimizationPlan => {
	return {
		id: target.name,
		description: "",
		primaryStatRestrictions: target.primaryStatRestrictions,
		setRestrictions: fromGIMOSetRestrictions(target.setRestrictions),
		targetStats: fromGIMOTargetStats(target.targetStats),
		useOnlyFullSets: target.useOnlyFullSets,
		minimumModDots: 5,
		Health: target.health,
		Protection: target.protection,
		Speed: target.speed,
		"Critical Damage %": target.critDmg,
		"Potency %": target.potency,
		"Tenacity %": target.tenacity,
		"Physical Damage": target.physDmg,
		"Special Damage": target.specDmg,
		"Critical Chance": target.critChance,
		Armor: target.armor,
		Resistance: target.resistance,
		"Accuracy %": target.accuracy,
		"Critical Avoidance %": target.critAvoid,
	};
};
